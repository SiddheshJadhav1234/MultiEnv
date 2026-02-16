const path = require('path');
const dotenv = require('dotenv');

// Load environment dynamically from root level
const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, '..', `.env.${env}`);
dotenv.config({ path: envPath });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Log active environment and database
console.log('\n========================================');
console.log(`🚀 ACTIVE ENVIRONMENT: ${env.toUpperCase()}`);
console.log(`📦 DATABASE: ${process.env.DATABASE_URL}`);
console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Loaded' : '✗ Missing'}`);
console.log(`🌐 CLIENT_URL: ${process.env.CLIENT_URL}`);
console.log('========================================\n');

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅ Connected to MongoDB: ${dbName}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Sample routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: env,
    database: mongoose.connection.db.databaseName,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    environment: env,
    apiBaseUrl: process.env.API_BASE_URL,
    clientUrl: process.env.CLIENT_URL
  });
});

// Sample User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    console.log('📝 Creating user:', req.body);
    const user = new User(req.body);
    await user.save();
    console.log('✅ User created:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
});
