import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class OrderService {
  async create(userId: string, address: any, paymentId?: string) {
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

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );
    const tax = Math.round(subtotal * 0.1);
    const shipping = 500;
    const total = subtotal + tax + shipping;

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        address,
        subtotal,
        tax,
        shipping,
        total,
        paymentId,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Order placed',
        body: `Your order ${order.orderNumber} has been created successfully.`,
        type: 'order',
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async getOrderStatus(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        tracking: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.getOrder(userId, orderId);

    if (order.status === 'delivered' || order.status === 'shipped') {
      throw new AppError('Order cannot be cancelled after shipping', 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Order cancelled',
        body: `Your order ${order.orderNumber} was cancelled successfully.`,
        type: 'order',
      },
    });

    return updatedOrder;
  }
}