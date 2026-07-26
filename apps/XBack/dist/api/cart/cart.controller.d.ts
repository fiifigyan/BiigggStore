import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class CartController {
    private cartService;
    constructor();
    getCart: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    addItem: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateQuantity: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    removeItem: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    clearCart: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=cart.controller.d.ts.map