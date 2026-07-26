"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    constructor() {
        this.register = async (req, res, next) => {
            try {
                const { email, password, firstName, lastName, phone } = req.body;
                const result = await this.authService.register({
                    email,
                    password,
                    firstName,
                    lastName,
                    phone,
                });
                res.status(201).json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login(email, password);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                const user = await this.authService.getUser(req.userId);
                res.json({ success: true, customer: user });
            }
            catch (error) {
                next(error);
            }
        };
        this.refreshToken = async (req, res, next) => {
            try {
                const result = await this.authService.refreshToken(req.userId);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.socialLogin = async (req, res, next) => {
            try {
                const { provider, email, firstName, lastName, avatar } = req.body;
                const result = await this.authService.socialLogin(provider, { email, firstName, lastName, avatar });
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.forgotPassword = async (req, res, next) => {
            try {
                const { email } = req.body;
                const result = await this.authService.forgotPassword(email);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                const { token, password } = req.body;
                const result = await this.authService.resetPassword(token, password);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map