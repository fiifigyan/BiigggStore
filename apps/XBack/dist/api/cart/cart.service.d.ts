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
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=cart.service.d.ts.map