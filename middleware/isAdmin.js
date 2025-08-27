/**
 * @file isAdmin.js
 * @description Authorization middleware to check for admin role.
 * This should be used AFTER the requireAuth middleware.
 * It checks the user's public metadata from Clerk to see if they have the 'admin' role.
 */

const isAdmin = (req, res, next) => {
  // The requireAuth middleware (from auth.js) should have already run and populated req.auth.
  // We check the public metadata stored with the user in Clerk.
  if (req.auth.sessionClaims?.publicMetadata?.role === 'admin') {
    // If the user has the 'admin' role, proceed to the next middleware or route handler.
    return next();
  }

  // If the user is not an admin, return a 403 Forbidden error.
  res.status(403).json({ message: 'Access denied. Admin privileges required.' });
};

module.exports = isAdmin;