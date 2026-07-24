import { prisma } from '../../lib/prisma';

export class ProductService {
  async getAll(query: any) {
    const { 
      limit = 20, 
      offset = 0, 
      category, 
      subcategory,
      search,
      minPrice,
      maxPrice,
      sort = 'createdAt:desc'
    } = query;

    const where: any = { isPublished: true };

    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    const [sortField, sortOrder] = sort.split(':');
    const orderBy: any = {};
    orderBy[sortField] = sortOrder || 'desc';

    const [products, count] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
      totalPages: Math.ceil(count / parseInt(limit)),
    };
  }

  async getById(id: string) {
    return prisma.product.findUnique({
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

  async getFeatured(limit: number = 10) {
    return prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async search(query: string) {
    if (!query || query.length < 2) {
      return { products: [], total: 0 };
    }

    const products = await prisma.product.findMany({
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
    const categories = await prisma.product.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    });
    return categories.map(c => c.category).filter(Boolean);
  }
}