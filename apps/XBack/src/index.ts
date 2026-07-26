import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Routes
import authRoutes from './api/auth/auth.routes';
import productRoutes from './api/products/product.routes';
import cartRoutes from './api/cart/cart.routes';
import orderRoutes from './api/orders/order.routes';
import userRoutes from './api/users/user.routes';
import notificationRoutes from './api/notifications/notification.routes';

// Middleware
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 9000);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// CORS
const allowedOrigins = new Set(
  [
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    ...(process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) || []),
  ]
);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = origin.toLowerCase();

  if (allowedOrigins.has(origin) || normalizedOrigin.startsWith('exp://')) {
    return true;
  }

  return (
    normalizedOrigin.includes('localhost') ||
    normalizedOrigin.includes('127.0.0.1') ||
    normalizedOrigin.startsWith('http://10.') ||
    normalizedOrigin.startsWith('https://10.') ||
    normalizedOrigin.startsWith('http://192.168.') ||
    normalizedOrigin.startsWith('https://192.168.') ||
    normalizedOrigin.startsWith('http://172.') ||
    normalizedOrigin.startsWith('https://172.')
  );
};

app.use(cors({
  origin: (origin, callback) => {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API: http://0.0.0.0:${PORT}/api`);
  console.log(`🔄 Environment: ${process.env.NODE_ENV || 'development'}`);
});