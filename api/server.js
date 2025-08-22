require('dotenv').config({ path: './.env' }); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('../routes/product'); 

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// MongoDB Connect + Serverless Export
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

module.exports = app; 
