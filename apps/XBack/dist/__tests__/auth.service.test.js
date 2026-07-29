"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../api/auth/auth.service");
const prisma_1 = require("../lib/prisma");
jest.mock('../lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));
describe('AuthService - forgotPassword', () => {
    const svc = new auth_service_1.AuthService();
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('returns message even when user not found', async () => {
        prisma_1.prisma.user.findUnique.mockResolvedValue(null);
        const res = await svc.forgotPassword('noone@example.com');
        expect(res).toHaveProperty('message');
    });
    it('generates reset token and returns message when user exists', async () => {
        prisma_1.prisma.user.findUnique.mockResolvedValue({
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
//# sourceMappingURL=auth.service.test.js.map