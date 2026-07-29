export declare class CartService {
    getCart(userId: string): Promise<{
        items: ({
            product: {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(userId: string, productId: string, quantity?: number): Promise<{
        items: ({
            product: {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    updateQuantity(userId: string, itemId: string, quantity: number): Promise<{
        items: ({
            product: {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        items: ({
            product: {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    clearCart(userId: string): Promise<{
        items: ({
            product: {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
//# sourceMappingURL=cart.service.d.ts.map