"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = require("./payment.service");
describe('PaymentService', () => {
    const originalFetch = global.fetch;
    afterEach(() => {
        global.fetch = originalFetch;
        delete process.env.PAYSTACK_SECRET_KEY;
    });
    it('initializes Paystack payments when credentials are available', async () => {
        process.env.PAYSTACK_SECRET_KEY = 'sk_test_123';
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                status: true,
                data: {
                    reference: 'ref_123',
                    authorization_url: 'https://paystack.com/checkout/ref_123',
                },
            }),
        });
        global.fetch = mockFetch;
        const service = new payment_service_1.PaymentService();
        const result = await service.initiate('user_1', 70000, 'test@example.com', 'GHS');
        expect(result.reference).toBe('ref_123');
        expect(result.authorization_url).toBe('https://paystack.com/checkout/ref_123');
        expect(result.provider).toBe('paystack');
        expect(mockFetch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=payment.service.test.js.map