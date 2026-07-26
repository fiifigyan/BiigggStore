"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
class CartController {
    constructor() {
        this.getCart = async (req, res, next) => {
            try {
                const cart = await this.cartService.getCart(req.userId);
                res.json({ success: true, cart });
            }
            catch (error) {
                next(error);
            }
        };
        this.addItem = async (req, res, next) => {
            try {
                const { productId, quantity } = req.body;
                const cart = await this.cartService.addItem(req.userId, productId, quantity);
                res.json({ success: true, cart });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateQuantity = async (req, res, next) => {
            try {
                const { quantity } = req.body;
                const itemId = req.params.itemId;
                const cart = await this.cartService.updateQuantity(req.userId, itemId, quantity);
                res.json({ success: true, cart });
            }
            catch (error) {
                next(error);
            }
        };
        this.removeItem = async (req, res, next) => {
            try {
                const itemId = req.params.itemId;
                const cart = await this.cartService.removeItem(req.userId, itemId);
                res.json({ success: true, cart });
            }
            catch (error) {
                next(error);
            }
        };
        this.clearCart = async (req, res, next) => {
            try {
                const cart = await this.cartService.clearCart(req.userId);
                res.json({ success: true, cart });
            }
            catch (error) {
                next(error);
            }
        };
        this.cartService = new cart_service_1.CartService();
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map