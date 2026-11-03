require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev / prototype demo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    service: 'Employee Management Backend API',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/employees', employeeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Employee Management API',
    endpoints: {
      health: 'GET /api/health',
      stats: 'GET /api/employees/stats',
      employees: 'GET /api/employees',
      createEmployee: 'POST /api/employees',
      seedDemoData: 'POST /api/employees/seed',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error] Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Initialize server and connect to Database
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Employee API Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        mongoose.connection.close(false).then(() => {
          console.log('[Database] MongoDB connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[Server] Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
