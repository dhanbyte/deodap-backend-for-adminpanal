// middleware/auth.js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
require('dotenv').config();

const client = jwksClient({
  jwksUri: process.env.CLERK_JWKS_URL,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("❌ Error fetching signing key:", err);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ Missing or invalid Authorization header:", authHeader);
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  console.log("🔑 Incoming Token:", token);

  jwt.verify(token, getKey, {}, (err, decoded) => {
    if (err) {
      console.error("❌ Token verification failed:", err);
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log("✅ Decoded Token Payload:", decoded);
    req.clerkId = decoded.sub; // Clerk userId assign
    next();
  });
}

module.exports = auth;
