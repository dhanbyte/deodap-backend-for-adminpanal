/**
 * @file db.js
 * @description Handles the connection to the MongoDB database using Mongoose.
 */

const mongoose = require('mongoose');

// A flag to keep track of the connection status
let isConnected = false;

/**
 * Establishes a connection to the MongoDB database.
 * It uses the MONGO_URI from the environment variables.
 * The function ensures that it does not create multiple connections.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
const connectDB = async () => {
  // If already connected, exit the function to prevent multiple connections.
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    // Attempt to connect to the database with the provided URI.
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Note: tlsAllowInvalidCertificates is not recommended for production.
      // It is useful for local development with self-signed certificates.
      tls: true,
      tlsAllowInvalidCertificates: true 
    });

    // Set the connection flag to true and log a success message.
    isConnected = true;
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    // If an error occurs, log the error and exit the process.
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;