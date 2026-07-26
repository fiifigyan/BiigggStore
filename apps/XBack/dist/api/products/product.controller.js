"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
class ProductController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const result = await this.productService.getAll(req.query);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const product = await this.productService.getById(id);
                if (!product) {
                    res.status(404).json({ success: false, message: 'Product not found' });
                    return;
                }
                res.json({ success: true, product });
            }
            catch (error) {
                next(error);
            }
        };
        this.getFeatured = async (req, res, next) => {
            try {
                const limit = parseInt(req.query.limit) || 10;
                const products = await this.productService.getFeatured(limit);
                res.json({ success: true, products });
            }
            catch (error) {
                next(error);
            }
        };
        this.search = async (req, res, next) => {
            try {
                const query = req.query.q;
                const results = await this.productService.search(query);
                res.json({ success: true, ...results });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCategories = async (_req, res, next) => {
            try {
                const categories = await this.productService.getCategories();
                res.json({ success: true, categories });
            }
            catch (error) {
                next(error);
            }
        };
        this.productService = new product_service_1.ProductService();
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map