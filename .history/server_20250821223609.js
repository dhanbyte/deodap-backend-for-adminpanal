require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/product');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
    app.get("/", (req, res) => {
  res.send("API is running...");
});
// API Routes
app.use('/api/products', productRoutes);

// Error Handling Middleware (catch all errors)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));
