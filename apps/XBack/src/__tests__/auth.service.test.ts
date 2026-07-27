import { AuthService } from '../api/auth/auth.service';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('AuthService - forgotPassword', () => {
  const svc = new AuthService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns message even when user not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await svc.forgotPassword('noone@example.com');
    expect(res).toHaveProperty('message');
  });

  it('generates reset token and returns message when user exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user1',
      email: 'test@example.com',
      firstName: 'Test',
    });

    const res = await svc.forgotPassword('test@example.com');
    expect(res).toHaveProperty('message');
    // In non-production env we return resetToken
    if (process.env.NODE_ENV !== 'production') {
      expect(res).toHaveProperty('resetToken');
    }
  });
});
