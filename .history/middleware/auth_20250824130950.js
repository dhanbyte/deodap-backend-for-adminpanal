const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.payload?.sub) {
      return res.status(401).json({ message: "Invalid Clerk token" });
    }

    req.clerkId = decoded.payload.sub;
    console.log("✅ Clerk User ID:", req.clerkId); // Debugging

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token verification failed" });
  }
};
