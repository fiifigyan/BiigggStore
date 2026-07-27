"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const adminAuth = (req, res, next) => {
    const providedSecret = req.header('x-admin-secret');
    const bearerToken = req.header('authorization')?.replace(/^Bearer\s+/i, '');
    const expectedSecret = process.env.ADMIN_API_KEY || 'dev-admin-secret';
    if (providedSecret === expectedSecret || bearerToken === expectedSecret) {
        next();
        return;
    }
    res.status(403).json({ success: false, message: 'Admin access required' });
};
exports.adminAuth = adminAuth;
//# sourceMappingURL=admin.js.map