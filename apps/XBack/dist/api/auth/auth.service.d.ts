export declare class AuthService {
    register(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        customer: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            avatar: string | null;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
        customer: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            avatar: string | null;
        };
    }>;
    getUser(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        avatar: string | null;
        createdAt: Date;
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
    refreshToken(userId: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    socialLogin(provider: string, profile: {
        email?: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
        accessToken?: string;
        idToken?: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        customer: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            avatar: string | null;
        };
        provider: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map