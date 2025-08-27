/**
 * @file auth.js
 * @description Authentication middleware using Clerk.
 * This middleware verifies the session token provided in the request headers.
 * It uses the official Clerk SDK to ensure the user is authenticated.
 */

const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// This middleware will protect the route and make sure only authenticated users can access it.
// If the user is not authenticated, it will return a 401 Unauthorized error.
// The authenticated user's data will be available on the `req.auth` object.
const requireAuth = ClerkExpressRequireAuth();

module.exports = requireAuth;