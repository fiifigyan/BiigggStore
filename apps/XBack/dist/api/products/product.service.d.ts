export declare class ProductService {
    getAll(query: any): Promise<{
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            description: string | null;
            compareAt: number | null;
            isPublished: boolean;
            isFeatured: boolean;
            price: number;
            images: string[];
            category: string | null;
            subcategory: string | null;
            stock: number;
        }[];
        total: number;
        limit: number;
        offset: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<({
        reviews: {
            user: {
                firstName: string | null;
                lastName: string | null;
            };
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            comment: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        description: string | null;
        compareAt: number | null;
        isPublished: boolean;
        isFeatured: boolean;
        price: number;
        images: string[];
        category: string | null;
        subcategory: string | null;
        stock: number;
    }) | null>;
    getFeatured(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        description: string | null;
        compareAt: number | null;
        isPublished: boolean;
        isFeatured: boolean;
        price: number;
        images: string[];
        category: string | null;
        subcategory: string | null;
        stock: number;
    }[]>;
    search(query: string): Promise<{
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            description: string | null;
            compareAt: number | null;
            isPublished: boolean;
            isFeatured: boolean;
            price: number;
            images: string[];
            category: string | null;
            subcategory: string | null;
            stock: number;
        }[];
        total: number;
    }>;
    getCategories(): Promise<(string | null)[]>;
}
//# sourceMappingURL=product.service.d.ts.map