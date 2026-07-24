import { Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { AuthRequest } from '../../middleware/auth';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.getCart(req.userId!);
      res.json({ success: true, cart });
    } catch (error) {
      next(error);
    }
  };

  addItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId, quantity } = req.body;
      const cart = await this.cartService.addItem(req.userId!, productId, quantity);
      res.json({ success: true, cart });
    } catch (error) {
      next(error);
    }
  };

  updateQuantity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { quantity } = req.body;
      const itemId = req.params.itemId as string;
      const cart = await this.cartService.updateQuantity(req.userId!, itemId, quantity);
      res.json({ success: true, cart });
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const itemId = req.params.itemId as string;
      const cart = await this.cartService.removeItem(req.userId!, itemId);
      res.json({ success: true, cart });
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.clearCart(req.userId!);
      res.json({ success: true, cart });
    } catch (error) {
      next(error);
    }
  };
}