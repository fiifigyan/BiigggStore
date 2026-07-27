"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const errorHandler_1 = require("../../middleware/errorHandler");
const prisma_1 = require("../../lib/prisma");
class AuthService {
    async register(data) {
        const existing = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new errorHandler_1.AppError('User already exists', 400);
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                createdAt: true,
            },
        });
        await prisma_1.prisma.cart.create({
            data: { userId: user.id },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        return {
            access_token: token,
            refresh_token: refreshToken,
            customer: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatar: user.avatar,
            },
        };
    }
    async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        const valid = await (0, password_1.comparePassword)(password, user.password);
        if (!valid) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        const token = (0, jwt_1.generateToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        return {
            access_token: token,
            refresh_token: refreshToken,
            customer: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatar: user.avatar,
            },
        };
    }
    async getUser(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                createdAt: true,
                addresses: true,
            },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return user;
    }
    async refreshToken(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return {
            access_token: (0, jwt_1.generateToken)(user.id),
            refresh_token: (0, jwt_1.generateRefreshToken)(user.id),
        };
    }
    async forgotPassword(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return {
                message: 'If an account with that email exists, a password reset link has been generated.',
            };
        }
        const resetToken = (0, jwt_1.generateResetToken)(user.id);
        return {
            message: 'Password reset link generated successfully.',
            resetToken,
        };
    }
    async resetPassword(token, password) {
        const decoded = (0, jwt_1.verifyResetToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid or expired reset token', 400);
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        return {
            message: 'Password reset successfully.',
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map