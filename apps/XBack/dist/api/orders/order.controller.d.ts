import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class OrderController {
    private orderService;
    constructor();
    create: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getAll: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    cancel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=order.controller.d.ts.map