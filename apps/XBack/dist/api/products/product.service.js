"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = require("../../lib/prisma");
class ProductService {
    async getAll(query) {
        const limit = parseInt(query.limit) || 20;
        const offset = parseInt(query.offset) || 0;
        const category = query.category;
        const subcategory = query.subcategory;
        const search = query.search || query.q;
        const minPrice = query.minPrice ?? query.min_price;
        const maxPrice = query.maxPrice ?? query.max_price;
        const isFeatured = query.isFeatured ?? query.is_featured;
        const sort = query.sort || query.order || 'createdAt:desc';
        const where = { isPublished: true };
        if (category)
            where.category = category;
        if (subcategory)
            where.subcategory = subcategory;
        if (isFeatured !== undefined)
            where.isFeatured = isFeatured === 'true' || isFeatured === true;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = parseInt(minPrice);
            if (maxPrice !== undefined)
                where.price.lte = parseInt(maxPrice);
        }
        const [sortField, sortOrder] = sort.split(':');
        const fieldMap = {
            created_at: 'createdAt',
            updated_at: 'updatedAt',
            compare_at: 'compareAt',
            is_published: 'isPublished',
            is_featured: 'isFeatured',
        };
        const normalizedField = fieldMap[sortField] ?? sortField;
        const orderBy = {};
        orderBy[normalizedField] = (sortOrder || 'desc');
        const [products, count] = await Promise.all([
            prisma_1.prisma.product.findMany({
                where,
                orderBy,
                take: limit,
                skip: offset,
            }),
            prisma_1.prisma.product.count({ where }),
        ]);
        return {
            products,
            total: count,
            limit,
            offset,
            totalPages: Math.ceil(count / limit),
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