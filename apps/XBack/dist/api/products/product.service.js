"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = require("../../lib/prisma");
class ProductService {
    async getAll(query) {
        const { limit = 20, offset = 0, category, subcategory, search, minPrice, maxPrice, sort = 'createdAt:desc' } = query;
        const where = { isPublished: true };
        if (category)
            where.category = category;
        if (subcategory)
            where.subcategory = subcategory;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = parseInt(minPrice);
            if (maxPrice)
                where.price.lte = parseInt(maxPrice);
        }
        const [sortField, sortOrder] = sort.split(':');
        const orderBy = {};
        orderBy[sortField] = sortOrder || 'desc';
        const [products, count] = await Promise.all([
            prisma_1.prisma.product.findMany({
                where,
                orderBy,
                take: parseInt(limit),
                skip: parseInt(offset),
            }),
            prisma_1.prisma.product.count({ where }),
        ]);
        return {
            products,
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset),
            totalPages: Math.ceil(count / parseInt(limit)),
        };
    }
    async getById(id) {
        return prisma_1.prisma.product.findUnique({
            where: { id, isPublished: true },
            include: {
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        userId: true,
                        createdAt: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getFeatured(limit = 10) {
        return prisma_1.prisma.product.findMany({
            where: { isPublished: true, isFeatured: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    async search(query) {
        if (!query || query.length < 2) {
            return { products: [], total: 0 };
        }
        const products = await prisma_1.prisma.product.findMany({
            where: {
                isPublished: true,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: 20,
        });
        return { products, total: products.length };
    }
    async getCategories() {
        const categories = await prisma_1.prisma.product.findMany({
            where: { isPublished: true },
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map(c => c.category).filter(Boolean);
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map