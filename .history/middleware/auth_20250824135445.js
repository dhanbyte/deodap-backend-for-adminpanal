const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Replace this with your Clerk frontend API URL
// e.g., https://your-clerk-domain.clerk.accounts.dev
const CLERK_ISSUER = 'https://big-pony-93.clerk.accounts.dev/.well-known/jwks.json
';

const client = jwksClient({
  jwksUri: `${CLERK_ISSUER}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, {
    audience: undefined, // optional: add if you want to verify audience
    issuer: CLERK_ISSUER
  }, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: 'Invalid Clerk token' });
    }
    req.user = decoded;
    next();
  });
};
