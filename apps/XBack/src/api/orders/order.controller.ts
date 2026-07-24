import { Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { AuthRequest } from '../../middleware/auth';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { address, paymentId } = req.body;
      const order = await this.orderService.create(req.userId!, address, paymentId);
      res.status(201).json({ success: true, order });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getUserOrders(req.userId!);
      res.json({ success: true, orders });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.orderService.getOrder(req.userId!, id);
      res.json({ success: true, order });
    } catch (error) {
      next(error);
    }
  };

  getStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const status = await this.orderService.getOrderStatus(req.userId!, id);
      res.json({ success: true, status });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.orderService.cancel(req.userId!, id);
      res.json({ success: true, order });
    } catch (error) {
      next(error);
    }
  };
}