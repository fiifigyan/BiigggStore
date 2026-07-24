// src/api/cart/cart.service.ts
import { AppError } from '../../middleware/errorHandler';
import { prisma } from '../../lib/prisma';

export class CartService {
  async getCart(userId: string) {
    const cart = await prisma.cart.findUnique({
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
      return prisma.cart.create({
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

  async addItem(userId: string, productId: string, quantity: number = 1) {
    const cart = await this.getCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      return this.updateQuantity(userId, existingItem.id, existingItem.quantity + quantity);
    }

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return this.getCart(userId);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    const cart = await this.getCart(userId);
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new AppError('Item not found in cart', 404);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    await prisma.cartItem.delete({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCart(userId);
  }
}