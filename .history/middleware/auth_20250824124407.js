async function dummyAuth(req, res, next) {
  const clerkId = req.headers['clerkid'];
  if (!clerkId) {
    return res.status(401).json({ message: 'Missing ClerkId' });
  }

  // For testing: only allow one fixed userId
  if (clerkId !== 'user_31CLee2LJFuitNRcZ70bGMtbhga') {
    return res.status(401).json({ message: 'Invalid ClerkId' });
  }

  req.clerkId = clerkId;
  next();
}

module.exports = dummyAuth;
