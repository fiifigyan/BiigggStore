import { Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { AuthRequest } from '../../middleware/auth';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  initiate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount, email, currency = 'GHS' } = req.body;
      const payment = await this.paymentService.initiate(req.userId!, amount, email, currency);
      res.status(201).json({ success: true, payment });
    } catch (error) {
      next(error);
    }
  };

  verify = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { reference } = req.body;
      const payment = await this.paymentService.verify(req.userId!, reference);
      res.json({ success: true, payment });
    } catch (error) {
      next(error);
    }
  };
}
