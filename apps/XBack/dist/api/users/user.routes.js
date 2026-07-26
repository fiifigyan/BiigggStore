"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const controller = new user_controller_1.UserController();
router.use(auth_1.authenticate);
router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.get('/addresses', controller.getAddresses);
router.post('/addresses', controller.addAddress);
router.put('/addresses/:id', controller.updateAddress);
router.delete('/addresses/:id', controller.deleteAddress);
exports.default = router;
//# sourceMappingURL=user.routes.js.map