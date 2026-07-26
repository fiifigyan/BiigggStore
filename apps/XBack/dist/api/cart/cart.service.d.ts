export declare class CartService {
    getCart(userId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addItem(userId: string, productId: string, quantity?: number): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateQuantity(userId: string, itemId: string, quantity: number): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    clearCart(userId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=cart.service.d.ts.map