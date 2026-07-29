export declare class OrderService {
    create(userId: string, address: any, paymentId?: string): Promise<{
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
            productId: string;
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNumber: string;
        userId: string;
        total: number;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        status: string;
        paymentStatus: string;
        paymentId: string | null;
        address: import("@prisma/client/runtime/library").JsonValue;
        tracking: string | null;
        notes: string | null;
    }>;
    getUserOrders(userId: string): Promise<({
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
            productId: string;
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNumber: string;
        userId: string;
        total: number;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        status: string;
        paymentStatus: string;
        paymentId: string | null;
        address: import("@prisma/client/runtime/library").JsonValue;
        tracking: string | null;
        notes: string | null;
    })[]>;
    getOrder(userId: string, orderId: string): Promise<{
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
            productId: string;
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNumber: string;
        userId: string;
        total: number;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        status: string;
        paymentStatus: string;
        paymentId: string | null;
        address: import("@prisma/client/runtime/library").JsonValue;
        tracking: string | null;
        notes: string | null;
    }>;
    getOrderStatus(userId: string, orderId: string): Promise<{
        id: string;
        updatedAt: Date;
        status: string;
        paymentStatus: string;
        tracking: string | null;
    }>;
    cancel(userId: string, orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNumber: string;
        userId: string;
        total: number;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        status: string;
        paymentStatus: string;
        paymentId: string | null;
        address: import("@prisma/client/runtime/library").JsonValue;
        tracking: string | null;
        notes: string | null;
    }>;
}
//# sourceMappingURL=order.service.d.ts.map