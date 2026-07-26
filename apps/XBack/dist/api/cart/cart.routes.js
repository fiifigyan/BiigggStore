"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const controller = new cart_controller_1.CartController();
router.use(auth_1.authenticate);
router.get('/', controller.getCart);
router.post('/items', controller.addItem);
router.put('/items/:itemId', controller.updateQuantity);
router.delete('/items/:itemId', controller.removeItem);
router.delete('/clear', controller.clearCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map