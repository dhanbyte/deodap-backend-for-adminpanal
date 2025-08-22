// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../db');
const productRoutes = require('../routes/product');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/products", productRoutes);

connectDB();

module.exports = app; // <-- Important for Vercel

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
