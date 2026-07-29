export declare class PaymentService {
    initiate(userId: string, amount: number, email: string, currency: string): Promise<{
        success: boolean;
        reference: any;
        authorization_url: any;
        amount: number;
        currency: string;
        provider: string;
        status: string;
        message: string;
    }>;
    verify(userId: string, reference: string): Promise<{
        success: boolean;
        reference: string;
        provider: string;
        status: any;
        message: string;
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map