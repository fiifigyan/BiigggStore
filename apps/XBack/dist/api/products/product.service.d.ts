export declare class ProductService {
    getAll(query: any): Promise<{
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            category: string | null;
            subcategory: string | null;
            description: string | null;
            price: number;
            compareAt: number | null;
            images: string[];
            stock: number;
            isPublished: boolean;
            isFeatured: boolean;
        }[];
        total: number;
        limit: number;
        offset: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<({
        reviews: {
            userId: string;
            user: {
                firstName: string | null;
                lastName: string | null;
            };
            id: string;
            createdAt: Date;
            rating: number;
            comment: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        category: string | null;
        subcategory: string | null;
        description: string | null;
        price: number;
        compareAt: number | null;
        images: string[];
        stock: number;
        isPublished: boolean;
        isFeatured: boolean;
    }) | null>;
    getFeatured(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        category: string | null;
        subcategory: string | null;
        description: string | null;
        price: number;
        compareAt: number | null;
        images: string[];
        stock: number;
        isPublished: boolean;
        isFeatured: boolean;
    }[]>;
    search(query: string): Promise<{
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            category: string | null;
            subcategory: string | null;
            description: string | null;
            price: number;
            compareAt: number | null;
            images: string[];
            stock: number;
            isPublished: boolean;
            isFeatured: boolean;
        }[];
        total: number;
    }>;
    getCategories(): Promise<(string | null)[]>;
}
//# sourceMappingURL=product.service.d.ts.map