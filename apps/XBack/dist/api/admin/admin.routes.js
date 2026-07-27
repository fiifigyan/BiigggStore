"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../../middleware/admin");
const product_controller_1 = require("../products/product.controller");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
const notifier_1 = require("../../lib/notifier");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const extractCloudinaryPublicId = (imageUrl) => {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?([^\.\s]+)/);
    return match ? match[1] : null;
};
const deleteImageFromCloudinary = async (imageUrl) => {
    const publicId = extractCloudinaryPublicId(imageUrl);
    if (!publicId)
        return;
    try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
    }
    catch (error) {
        console.warn('Cloudinary delete failed for', imageUrl, error);
    }
};
router.use(admin_1.adminAuth);
router.get('/products', productController.getAll);
router.post('/products', async (req, res, next) => {
    try {
        const product = await req.app.locals.prisma?.product.create({
            data: {
                title: req.body.title || 'Untitled product',
                description: req.body.description || '',
                price: Number(req.body.price || 0),
                compareAt: Number(req.body.compareAt || 0),
                category: req.body.category || 'General',
                subcategory: req.body.subcategory || null,
                stock: Number(req.body.stock || 0),
                isPublished: req.body.isPublished !== false,
                isFeatured: Boolean(req.body.isFeatured),
                images: Array.isArray(req.body.images) ? req.body.images : [],
            },
        });
        res.status(201).json({ success: true, product });
    }
    catch (error) {
        next(error);
    }
});
// Upload endpoint that sends files to Cloudinary and returns hosted URLs
// multer is dynamically required to avoid TS runtime resolution issues in some environments
const multer = require('multer');
const upload = multer();
router.post('/upload', upload.array('images'), async (req, res, next) => {
    try {
        const files = req.files || [];
        // configure cloudinary using env vars
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const { Readable } = require('stream');
        const uploadOne = (file) => new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'xstore' }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            const r = new Readable();
            r.push(file.buffer);
            r.push(null);
            r.pipe(stream);
        });
        const results = await Promise.all(files.map((f) => uploadOne(f)));
        const urls = results.map((r) => r.secure_url || r.url).filter(Boolean);
        res.json({ success: true, images: urls });
    }
    catch (error) {
        console.error('Upload route error:', error);
        next(error);
    }
});
// Return a signature and timestamp so the client can upload directly to Cloudinary
router.post('/upload/sign', async (_req, res, next) => {
    try {
        const crypto = require('crypto');
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'xstore';
        const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
        const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
        const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex');
        res.json({ success: true, signature, timestamp, api_key: process.env.CLOUDINARY_API_KEY, cloud_name: process.env.CLOUDINARY_CLOUD_NAME, folder });
    }
    catch (error) {
        next(error);
    }
});
router.post('/upload/delete', async (req, res, next) => {
    try {
        const imageUrl = req.body?.imageUrl;
        if (!imageUrl || typeof imageUrl !== 'string') {
            return res.status(400).json({ success: false, message: 'imageUrl is required' });
        }
        const publicId = extractCloudinaryPublicId(imageUrl);
        if (!publicId) {
            return res.status(400).json({ success: false, message: 'Invalid Cloudinary image URL' });
        }
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Cloudinary delete image error:', error);
        return next(error);
    }
});
router.put('/products/:id', async (req, res, next) => {
    try {
        const existing = await req.app.locals.prisma?.product.findUnique({ where: { id: req.params.id } });
        const newImages = Array.isArray(req.body.images) ? req.body.images : [];
        const deletedImages = existing?.images?.filter((url) => !newImages.includes(url)) || [];
        if (deletedImages.length) {
            await Promise.all(deletedImages.map((url) => deleteImageFromCloudinary(url)));
        }
        const product = await req.app.locals.prisma?.product.update({
            where: { id: req.params.id },
            data: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price !== undefined ? Number(req.body.price) : undefined,
                compareAt: req.body.compareAt !== undefined ? Number(req.body.compareAt) : undefined,
                category: req.body.category,
                subcategory: req.body.subcategory,
                stock: req.body.stock !== undefined ? Number(req.body.stock) : undefined,
                isPublished: req.body.isPublished,
                isFeatured: req.body.isFeatured,
                images: newImages,
            },
        });
        res.json({ success: true, product });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/products/:id', async (req, res, next) => {
    try {
        const existing = await req.app.locals.prisma?.product.findUnique({ where: { id: req.params.id } });
        if (existing?.images?.length) {
            await Promise.all(existing.images.map((url) => deleteImageFromCloudinary(url)));
        }
        const product = await req.app.locals.prisma?.product.delete({ where: { id: req.params.id } });
        res.json({ success: true, product });
    }
    catch (error) {
        next(error);
    }
});
router.get('/orders', async (req, res, next) => {
    try {
        const orders = await req.app.locals.prisma?.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, orders });
    }
    catch (error) {
        next(error);
    }
});
router.put('/orders/:id', async (req, res, next) => {
    try {
        const order = await req.app.locals.prisma?.order.update({
            where: { id: req.params.id },
            data: {
                status: req.body.status,
                paymentStatus: req.body.paymentStatus,
                tracking: req.body.tracking,
                notes: req.body.notes,
            },
        });
        if (order) {
            notifier_1.notifier.emit('notification', { type: 'order:update', message: `Order ${order.orderNumber} status updated to ${order.status}`, data: { orderId: order.id } });
        }
        res.json({ success: true, order });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/orders/:id', async (req, res, next) => {
    try {
        const order = await req.app.locals.prisma?.order.delete({ where: { id: req.params.id } });
        res.json({ success: true, order });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map