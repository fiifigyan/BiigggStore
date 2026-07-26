export declare class UserService {
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        orders: {
            id: string;
            createdAt: Date;
            orderNumber: string;
            total: number;
            status: string;
        }[];
        addresses: {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            address1: string;
            address2: string | null;
            city: string;
            state: string | null;
            country: string;
            postalCode: string;
            isDefault: boolean;
        }[];
    }>;
    updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        avatar: string | null;
    }>;
    getAddresses(userId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address1: string;
        address2: string | null;
        city: string;
        state: string | null;
        country: string;
        postalCode: string;
        isDefault: boolean;
    }[]>;
    addAddress(userId: string, data: any): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address1: string;
        address2: string | null;
        city: string;
        state: string | null;
        country: string;
        postalCode: string;
        isDefault: boolean;
    }>;
    updateAddress(userId: string, addressId: string, data: any): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address1: string;
        address2: string | null;
        city: string;
        state: string | null;
        country: string;
        postalCode: string;
        isDefault: boolean;
    }>;
    deleteAddress(userId: string, addressId: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map