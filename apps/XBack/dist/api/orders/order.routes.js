"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const controller = new order_controller_1.OrderController();
router.use(auth_1.authenticate);
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/status', controller.getStatus);
router.post('/:id/cancel', controller.cancel);
exports.default = router;
//# sourceMappingURL=order.routes.js.map