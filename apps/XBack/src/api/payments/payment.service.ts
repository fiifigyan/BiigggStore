import { AppError } from '../../middleware/errorHandler';

export class PaymentService {
  async initiate(userId: string, amount: number, email: string, currency: string) {
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!amount || amount <= 0) {
      throw new AppError('Invalid payment amount', 400);
    }

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const normalizedCurrency = (currency || 'GHS').toUpperCase();

    if (!secretKey) {
      throw new AppError('Paystack secret key is not configured', 500);
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount),
        currency: normalizedCurrency,
      }),
    });

    const payload = await response.json() as any;

    if (!response.ok || !payload?.status) {
      throw new AppError(payload?.message || 'Payment initialization failed', 502);
    }

    return {
      success: true,
      reference: payload.data.reference,
      authorization_url: payload.data.authorization_url,
      amount,
      currency: normalizedCurrency,
      provider: 'paystack',
      status: 'pending',
      message: 'Payment initialized successfully',
    };
  }

  async verify(userId: string, reference: string) {
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    if (!reference) {
      throw new AppError('Reference is required', 400);
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new AppError('Paystack secret key is not configured', 500);
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const payload = await response.json() as any;

    if (!response.ok || !payload?.status) {
      throw new AppError(payload?.message || 'Payment verification failed', 502);
    }

    return {
      success: true,
      reference,
      provider: 'paystack',
      status: payload.data.status === 'success' ? 'verified' : payload.data.status,
      message: 'Payment verified successfully',
    };
  }
}
