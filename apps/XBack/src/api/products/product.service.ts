import { prisma } from '../../lib/prisma';

export class ProductService {
  async getAll(query: any) {
    const limit = parseInt(query.limit as string) || 20;
    const offset = parseInt(query.offset as string) || 0;
    const category = query.category as string;
    const subcategory = query.subcategory as string;
    const search = (query.search as string) || (query.q as string);
    const minPrice = query.minPrice ?? query.min_price;
    const maxPrice = query.maxPrice ?? query.max_price;
    const isFeatured = query.isFeatured ?? query.is_featured;
    const sort = (query.sort as string) || (query.order as string) || 'createdAt:desc';

    const where: any = { isPublished: true };

    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseInt(minPrice as string);
      if (maxPrice !== undefined) where.price.lte = parseInt(maxPrice as string);
    }

    const [sortField, sortOrder] = sort.split(':');
    const fieldMap: Record<string, string> = {
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      compare_at: 'compareAt',
      is_published: 'isPublished',
      is_featured: 'isFeatured',
    };
    const normalizedField = fieldMap[sortField] ?? sortField;
    const orderBy: any = {};
    orderBy[normalizedField] = (sortOrder || 'desc') as any;

    const [products, count] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
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