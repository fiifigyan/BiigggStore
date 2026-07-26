export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
}
export interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    compareAt?: number;
    images: string[];
    category?: string;
    subcategory?: string;
    stock: number;
    isPublished: boolean;
    isFeatured: boolean;
}
export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
}
export interface Order {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    items: OrderItem[];
    address: any;
    createdAt: Date;
}
export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=index.d.ts.map