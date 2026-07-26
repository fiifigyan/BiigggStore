"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
// src/api/cart/cart.service.ts
const errorHandler_1 = require("../../middleware/errorHandler");
const prisma_1 = require("../../lib/prisma");
class CartService {
    async getCart(userId) {
        const cart = await prisma_1.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart) {
            return prisma_1.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }
        return cart;
    }
    async addItem(userId, productId, quantity = 1) {
        const cart = await this.getCart(userId);
        const existingItem = await prisma_1.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        });
        if (existingItem) {
            return this.updateQuantity(userId, existingItem.id, existingItem.quantity + quantity);
        }
        await prisma_1.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
        return this.getCart(userId);
    }
    async updateQuantity(userId, itemId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(userId, itemId);
        }
        const cart = await this.getCart(userId);
        const item = await prisma_1.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });
        if (!item) {
            throw new errorHandler_1.AppError('Item not found in cart', 404);
        }
        await prisma_1.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getCart(userId);
        await prisma_1.prisma.cartItem.delete({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getCart(userId);
        await prisma_1.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return this.getCart(userId);
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map