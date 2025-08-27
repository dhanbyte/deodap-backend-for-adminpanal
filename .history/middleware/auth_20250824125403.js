const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
require('dotenv').config();

const client = jwksClient({
  jwksUri: process.env.CLERK_JWKS_URL,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, {}, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    req.clerkId = decoded.sub; // Clerk userId assign
    next();
  });
}

module.exports = auth;
