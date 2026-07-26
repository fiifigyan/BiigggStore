"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map