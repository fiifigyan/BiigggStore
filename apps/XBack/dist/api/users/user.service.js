"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errorHandler_1 = require("../../middleware/errorHandler");
const prisma_1 = require("../../lib/prisma");
class UserService {
    async getProfile(userId) {
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
                updatedAt: true,
                addresses: true,
                orders: {
                    select: {
                        id: true,
                        orderNumber: true,
                        total: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return user;
    }
    async updateProfile(userId, data) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
            },
        });
    }
    async getAddresses(userId) {
        return prisma_1.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
    }
    async addAddress(userId, data) {
        if (data.isDefault) {
            await prisma_1.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return prisma_1.prisma.address.create({
            data: {
                userId,
                ...data,
            },
        });
    }
    async updateAddress(userId, addressId, data) {
        const address = await prisma_1.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!address) {
            throw new errorHandler_1.AppError('Address not found', 404);
        }
        if (data.isDefault) {
            await prisma_1.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return prisma_1.prisma.address.update({
            where: { id: addressId },
            data,
        });
    }
    async deleteAddress(userId, addressId) {
        const address = await prisma_1.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!address) {
            throw new errorHandler_1.AppError('Address not found', 404);
        }
        await prisma_1.prisma.address.delete({
            where: { id: addressId },
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map