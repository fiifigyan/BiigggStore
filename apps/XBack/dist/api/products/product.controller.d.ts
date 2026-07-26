import { Request, Response, NextFunction } from 'express';
export declare class ProductController {
    private productService;
    constructor();
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFeatured: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    search: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCategories: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map