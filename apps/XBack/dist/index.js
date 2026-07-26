"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const auth_routes_1 = __importDefault(require("./api/auth/auth.routes"));
const product_routes_1 = __importDefault(require("./api/products/product.routes"));
const cart_routes_1 = __importDefault(require("./api/cart/cart.routes"));
const order_routes_1 = __importDefault(require("./api/orders/order.routes"));
const user_routes_1 = __importDefault(require("./api/users/user.routes"));
const notification_routes_1 = __importDefault(require("./api/notifications/notification.routes"));
// Middleware
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 9000);
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);
// CORS
const allowedOrigins = new Set([
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    ...(process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) || []),
]);
const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }
    const normalizedOrigin = origin.toLowerCase();
    if (allowedOrigins.has(origin) || normalizedOrigin.startsWith('exp://')) {
        return true;
    }
    return (normalizedOrigin.includes('localhost') ||
        normalizedOrigin.includes('127.0.0.1') ||
        normalizedOrigin.startsWith('http://10.') ||
        normalizedOrigin.startsWith('https://10.') ||
        normalizedOrigin.startsWith('http://192.168.') ||
        normalizedOrigin.startsWith('https://192.168.') ||
        normalizedOrigin.startsWith('http://172.') ||
        normalizedOrigin.startsWith('https://172.'));
};
app.options('*', (0, cors_1.default)({
    origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
}));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Error handler
app.use(errorHandler_1.errorHandler);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API: http://0.0.0.0:${PORT}/api`);
    console.log(`🔄 Environment: ${process.env.NODE_ENV || 'development'}`);
});
//# sourceMappingURL=index.js.map