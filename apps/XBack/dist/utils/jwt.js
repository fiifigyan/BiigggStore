"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.verifyToken = exports.generateResetToken = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const JWT_RESET_EXPIRES_IN = process.env.JWT_RESET_EXPIRES_IN || '1h';
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.generateToken = generateToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId, purpose: 'refresh' }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};
exports.generateRefreshToken = generateRefreshToken;
const generateResetToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId, purpose: 'password-reset' }, JWT_SECRET, { expiresIn: JWT_RESET_EXPIRES_IN });
};
exports.generateResetToken = generateResetToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
const verifyResetToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (decoded.purpose !== 'password-reset') {
        throw new Error('Invalid reset token purpose');
    }
    return { userId: decoded.userId };
};
exports.verifyResetToken = verifyResetToken;
//# sourceMappingURL=jwt.js.map