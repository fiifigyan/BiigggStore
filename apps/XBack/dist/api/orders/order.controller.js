"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
class OrderController {
    constructor() {
        this.create = async (req, res, next) => {
            try {
                const { address, paymentId } = req.body;
                const order = await this.orderService.create(req.userId, address, paymentId);
                res.status(201).json({ success: true, order });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAll = async (req, res, next) => {
            try {
                const orders = await this.orderService.getUserOrders(req.userId);
                res.json({ success: true, orders });
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const order = await this.orderService.getOrder(req.userId, id);
                res.json({ success: true, order });
            }
            catch (error) {
                next(error);
            }
        };
        this.getStatus = async (req, res, next) => {
            try {
                const id = req.params.id;
                const status = await this.orderService.getOrderStatus(req.userId, id);
                res.json({ success: true, status });
            }
            catch (error) {
                next(error);
            }
        };
        this.cancel = async (req, res, next) => {
            try {
                const id = req.params.id;
                const order = await this.orderService.cancel(req.userId, id);
                res.json({ success: true, order });
            }
            catch (error) {
                next(error);
            }
        };
        this.orderService = new order_service_1.OrderService();
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map