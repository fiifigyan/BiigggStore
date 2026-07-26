"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const controller = new auth_controller_1.AuthController();
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/social-login', controller.socialLogin);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);
router.get('/me', auth_1.authenticate, controller.getMe);
router.post('/refresh', auth_1.authenticate, controller.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map