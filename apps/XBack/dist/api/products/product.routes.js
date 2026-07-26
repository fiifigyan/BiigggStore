"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const router = (0, express_1.Router)();
const controller = new product_controller_1.ProductController();
router.get('/', controller.getAll);
router.get('/featured', controller.getFeatured);
router.get('/search', controller.search);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getById);
exports.default = router;
//# sourceMappingURL=product.routes.js.map