const axios = require('axios');

async function dummyAuth(req, res, next) {
  const clerkId = req.headers['clerkid'];
  if (!clerkId) return res.status(401).json({ message: 'Missing ClerkId' });

  // Clerk API से User डेटा लाओ
  try {
    const response = await axios.get(`https://api.clerk.dev/v1/users/${clerkId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    });

    req.clerkUser = response.data; // Clerk का पूरा यूज़र डेटा स्टोर करो
    req.clerkId = clerkId;
    next();

  } catch (err) {
    console.error('Clerk API Error:', err.response?.data || err.message);
    return res.status(401).json({ message: 'Invalid ClerkId' });
  }
}

module.exports = dummyAuth;
