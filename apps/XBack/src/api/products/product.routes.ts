import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();
const controller = new ProductController();

router.get('/', controller.getAll);
router.get('/featured', controller.getFeatured);
router.get('/search', controller.search);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getById);

export default router;