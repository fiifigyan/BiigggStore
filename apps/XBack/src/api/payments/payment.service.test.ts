import { PaymentService } from './payment.service';

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

    global.fetch = mockFetch as unknown as typeof fetch;

    const service = new PaymentService();
    const result = await service.initiate('user_1', 70000, 'test@example.com', 'GHS');

    expect(result.reference).toBe('ref_123');
    expect(result.authorization_url).toBe('https://paystack.com/checkout/ref_123');
    expect(result.provider).toBe('paystack');
    expect(mockFetch).toHaveBeenCalled();
  });
});
