import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class PaymentController {
    private paymentService;
    constructor();
    initiate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    verify: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=payment.controller.d.ts.map