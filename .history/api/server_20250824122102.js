require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
// ...orderRoutes, reviewRoutes

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
// ... add more

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
