"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
class UserController {
    constructor() {
        this.getProfile = async (req, res, next) => {
            try {
                const user = await this.userService.getProfile(req.userId);
                res.json({ success: true, user });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const user = await this.userService.updateProfile(req.userId, req.body);
                res.json({ success: true, user });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAddresses = async (req, res, next) => {
            try {
                const addresses = await this.userService.getAddresses(req.userId);
                res.json({ success: true, addresses });
            }
            catch (error) {
                next(error);
            }
        };
        this.addAddress = async (req, res, next) => {
            try {
                const address = await this.userService.addAddress(req.userId, req.body);
                res.status(201).json({ success: true, address });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateAddress = async (req, res, next) => {
            try {
                const id = req.params.id;
                const address = await this.userService.updateAddress(req.userId, id, req.body);
                res.json({ success: true, address });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteAddress = async (req, res, next) => {
            try {
                const id = req.params.id;
                await this.userService.deleteAddress(req.userId, id);
                res.json({ success: true });
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map