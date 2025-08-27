// Minimal placeholder, clerkId via "clerkid" header or req.body for now.
async function dummyAuth(req, res, next) {
  const clerkId = req.headers['clerkid'];
  if (!clerkId) return res.status(401).json({ message: 'Missing ClerkId' });
  req.clerkId = clerkId;
  next();
}

module.exports = dummyAuth;
