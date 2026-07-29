"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const controller = new payment_controller_1.PaymentController();
router.use(auth_1.authenticate);
router.post('/initiate', controller.initiate);
router.post('/verify', controller.verify);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map