"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
class PaymentController {
    constructor() {
        this.initiate = async (req, res, next) => {
            try {
                const { amount, email, currency = 'GHS' } = req.body;
                const payment = await this.paymentService.initiate(req.userId, amount, email, currency);
                res.status(201).json({ success: true, payment });
            }
            catch (error) {
                next(error);
            }
        };
        this.verify = async (req, res, next) => {
            try {
                const { reference } = req.body;
                const payment = await this.paymentService.verify(req.userId, reference);
                res.json({ success: true, payment });
            }
            catch (error) {
                next(error);
            }
        };
        this.paymentService = new payment_service_1.PaymentService();
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map