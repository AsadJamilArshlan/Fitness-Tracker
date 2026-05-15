const dns=require('dns')
dns.setServers(['8.8.8.8','1.1.1.1'])

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/auth');
const user = require('./routes/user');
const foodLog = require('./routes/foodLog');
const activityLog = require('./routes/activityLog');
const imageAnalysis = require('./routes/imageAnalysis');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', user);
app.use('/api/food-logs', foodLog);
app.use('/api/activity-logs', activityLog);
app.use('/api/image-analysis', imageAnalysis);

const PORT = process.env.PORT || 1337;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
