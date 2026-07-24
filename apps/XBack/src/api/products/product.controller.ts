import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.productService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.getById(id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

  getFeatured = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const products = await this.productService.getFeatured(limit);
      res.json({ success: true, products });
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query.q as string;
      const results = await this.productService.search(query);
      res.json({ success: true, ...results });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.productService.getCategories();
      res.json({ success: true, categories });
    } catch (error) {
      next(error);
    }
  };
}