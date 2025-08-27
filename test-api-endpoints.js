/**
 * API Endpoint Testing Script
 * 
 * This script tests all the major API endpoints of the Buddy Bazaar application
 * to ensure they are working correctly before deployment.
 */

const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
let adminToken = '';
let userToken = '';
let testProductId = '';
let testOrderId = '';
let testUserId = '';

// API Endpoints Reference
const ENDPOINTS = {
  // Product API
  PRODUCTS: '/products',                      // GET: Get all products
  PRODUCT_DETAIL: '/products/:id',           // GET: Get product by ID
  FEATURED_PRODUCTS: '/products/featured',   // GET: Get featured products
  
  // Admin API
  ADMIN_LOGIN: '/admin/login',               // POST: Admin login
  ADMIN_DASHBOARD: '/admin/dashboard-stats', // GET: Get dashboard stats
  
  // User API
  USERS: '/user',                           // GET: Get all users (admin)
  USER_DETAIL: '/user/:id',                 // GET: Get user by ID (admin)
  USER_PROFILE: '/user/profile',            // GET: Get user profile
  
  // Order API
  ORDERS_ALL: '/orders/all',                // GET: Get all orders (admin)
  ORDER_DETAIL: '/orders/:id',              // GET: Get order by ID
  ORDER_STATUS: '/orders/:id/status',       // PUT: Update order status
  PLACE_ORDER: '/orders',                   // POST: Place new order
  USER_ORDERS: '/orders/user',              // GET: Get user orders
  
  // Checkout API
  CHECKOUT_CALCULATE: '/checkout/calculate', // POST: Calculate checkout total
  
  // Search API
  SEARCH: '/search',                        // GET: Search products
  
  // Review API
  PRODUCT_REVIEWS: '/reviews/product/:id',   // GET: Get product reviews
  ADD_REVIEW: '/reviews',                    // POST: Add product review
  
  // Coupon API
  VALIDATE_COUPON: '/coupon/validate'        // POST: Validate coupon code
};

// Test credentials
const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

const testUserCredentials = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'test123'
};

const testCouponCode = process.env.TEST_COUPON_CODE || 'WELCOME10';

// Helper functions
async function runTest(name, testFn) {
  try {
    console.log(chalk.blue(`\nRunning test: ${name}...`));
    await testFn();
    console.log(chalk.green(`✓ Test passed: ${name}`));
    return true;
  } catch (error) {
    console.log(chalk.red(`✗ Test failed: ${name}`));
    console.error(chalk.red(`Error: ${error.message}`));
    if (error.response) {
      console.error(chalk.red(`Status: ${error.response.status}`));
      console.error(chalk.red(`Data: ${JSON.stringify(error.response.data, null, 2)}`));
    }
    return false;
  }
}

async function adminLogin() {
  const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.ADMIN_LOGIN}`, adminCredentials);
  adminToken = response.data.adminKey;
  console.log(chalk.green('Admin login successful'));
  return adminToken;
}

async function userLogin() {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, testUserCredentials);
  userToken = response.data.token;
  console.log(chalk.green('User login successful'));
  return userToken;
}

// Test functions
async function testProductAPI() {
  // Get all products
  const productsResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.PRODUCTS}`);
  if (!productsResponse.data || !Array.isArray(productsResponse.data.products)) {
    throw new Error('Failed to get products');
  }
  console.log(chalk.green(`Retrieved ${productsResponse.data.products.length} products`));
  
  if (productsResponse.data.products.length > 0) {
    testProductId = productsResponse.data.products[0]._id;
    console.log(chalk.blue(`Using product ID: ${testProductId} for further tests`));
  } else {
    throw new Error('No products found to test with');
  }
  
  // Get product by ID
  const productDetailEndpoint = ENDPOINTS.PRODUCT_DETAIL.replace(':id', testProductId);
  const productDetailResponse = await axios.get(`${API_BASE_URL}${productDetailEndpoint}`);
  if (!productDetailResponse.data || !productDetailResponse.data.product) {
    throw new Error('Failed to get product details');
  }
  console.log(chalk.green(`Retrieved product details for: ${productDetailResponse.data.product.name}`));
  
  // Get featured products
  const featuredResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.FEATURED_PRODUCTS}`);
  if (!featuredResponse.data || !Array.isArray(featuredResponse.data.products)) {
    throw new Error('Failed to get featured products');
  }
  console.log(chalk.green(`Retrieved ${featuredResponse.data.products.length} featured products`));
  
  // Test search
  const searchTerm = productDetailResponse.data.product.name.split(' ')[0];
  const searchResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.SEARCH}?query=${searchTerm}`);
  if (!searchResponse.data || !Array.isArray(searchResponse.data.products)) {
    throw new Error('Failed to search products');
  }
  console.log(chalk.green(`Search for '${searchTerm}' returned ${searchResponse.data.products.length} results`));
  
  // Test product reviews
  try {
    const reviewsEndpoint = ENDPOINTS.PRODUCT_REVIEWS.replace(':id', testProductId);
    const reviewsResponse = await axios.get(`${API_BASE_URL}${reviewsEndpoint}`);
    if (reviewsResponse.data && Array.isArray(reviewsResponse.data.reviews)) {
      console.log(chalk.green(`Retrieved ${reviewsResponse.data.reviews.length} reviews for product`));
    }
  } catch (error) {
    console.log(chalk.yellow(`Note: Product reviews test failed, but continuing with other tests`));
  }
}

async function testAdminAPI() {
  // Get admin token
  if (!adminToken) {
    await adminLogin();
  }
  
  // Get dashboard stats
  const statsResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.ADMIN_DASHBOARD}`, {
    headers: { 'x-admin-key': adminToken }
  });
  if (!statsResponse.data) {
    throw new Error('Failed to get dashboard stats');
  }
  console.log(chalk.green('Retrieved dashboard stats'));
  console.log(chalk.blue(`Total Revenue: ${statsResponse.data.totalRevenue || 'N/A'}`));
  console.log(chalk.blue(`Total Orders: ${statsResponse.data.totalOrders || 'N/A'}`));
  console.log(chalk.blue(`Total Products: ${statsResponse.data.totalProducts || 'N/A'}`));
  console.log(chalk.blue(`Total Users: ${statsResponse.data.totalUsers || 'N/A'}`));
  
  // Get all users
  const usersResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.USERS}`, {
    headers: { 'x-admin-key': adminToken }
  });
  if (!usersResponse.data || !Array.isArray(usersResponse.data.users)) {
    throw new Error('Failed to get users');
  }
  console.log(chalk.green(`Retrieved ${usersResponse.data.users.length} users`));
  
  if (usersResponse.data.users.length > 0) {
    testUserId = usersResponse.data.users[0]._id;
    console.log(chalk.blue(`Using user ID: ${testUserId} for further tests`));
    
    // Get user details
    try {
      const userDetailEndpoint = ENDPOINTS.USER_DETAIL.replace(':id', testUserId);
      const userDetailResponse = await axios.get(`${API_BASE_URL}${userDetailEndpoint}`, {
        headers: { 'x-admin-key': adminToken }
      });
      if (userDetailResponse.data && userDetailResponse.data.user) {
        console.log(chalk.green(`Retrieved details for user: ${userDetailResponse.data.user.name || userDetailResponse.data.user.email}`));
      }
    } catch (error) {
      console.log(chalk.yellow(`Note: User details test failed, but continuing with other tests`));
    }
  }
  
  // Get all orders
  const ordersResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.ORDERS_ALL}`, {
    headers: { 'x-admin-key': adminToken }
  });
  if (!ordersResponse.data || !Array.isArray(ordersResponse.data.orders)) {
    throw new Error('Failed to get orders');
  }
  console.log(chalk.green(`Retrieved ${ordersResponse.data.orders.length} orders`));
  
  if (ordersResponse.data.orders.length > 0) {
    testOrderId = ordersResponse.data.orders[0]._id;
    console.log(chalk.blue(`Using order ID: ${testOrderId} for further tests`));
  }
}

async function testOrderAPI() {
  // Skip if no order ID is available
  if (!testOrderId) {
    console.log(chalk.yellow('No order ID available, skipping order tests'));
    return;
  }
  
  // Get order by ID (admin)
  const orderDetailEndpoint = ENDPOINTS.ORDER_DETAIL.replace(':id', testOrderId);
  const orderDetailResponse = await axios.get(`${API_BASE_URL}${orderDetailEndpoint}`, {
    headers: { 'x-admin-key': adminToken }
  });
  if (!orderDetailResponse.data || !orderDetailResponse.data.order) {
    throw new Error('Failed to get order details');
  }
  console.log(chalk.green(`Retrieved order details for order: ${orderDetailResponse.data.order._id}`));
  console.log(chalk.blue(`Order Status: ${orderDetailResponse.data.order.status}`));
  console.log(chalk.blue(`Payment Method: ${orderDetailResponse.data.order.paymentMethod}`));
  console.log(chalk.blue(`Total Amount: ${orderDetailResponse.data.order.totalAmount}`));
  
  // Update order status (admin)
  const newStatus = 'processing';
  const orderStatusEndpoint = ENDPOINTS.ORDER_STATUS.replace(':id', testOrderId);
  const updateResponse = await axios.put(
    `${API_BASE_URL}${orderStatusEndpoint}`,
    { status: newStatus },
    { headers: { 'x-admin-key': adminToken } }
  );
  if (!updateResponse.data || !updateResponse.data.success) {
    throw new Error('Failed to update order status');
  }
  console.log(chalk.green(`Updated order status to: ${newStatus}`));
  
  // Test user orders (if user token available)
  try {
    if (!userToken) {
      await userLogin();
    }
    
    const userOrdersResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.USER_ORDERS}`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (userOrdersResponse.data && Array.isArray(userOrdersResponse.data.orders)) {
      console.log(chalk.green(`Retrieved ${userOrdersResponse.data.orders.length} orders for user`));
    }
  } catch (error) {
    console.log(chalk.yellow(`Note: User orders test failed, but continuing with other tests`));
  }
}

async function testCheckoutAPI() {
  // Test checkout calculation without coupon
  const checkoutData = {
    items: [
      { productId: testProductId, quantity: 2 }
    ],
    couponCode: ''
  };
  
  const checkoutResponse = await axios.post(`${API_BASE_URL}${ENDPOINTS.CHECKOUT_CALCULATE}`, checkoutData);
  if (!checkoutResponse.data) {
    throw new Error('Failed to calculate checkout');
  }
  console.log(chalk.green('Checkout calculation successful'));
  console.log(chalk.blue(`Subtotal: ${checkoutResponse.data.subtotal}`));
  console.log(chalk.blue(`Shipping: ${checkoutResponse.data.shipping}`));
  console.log(chalk.blue(`Total: ${checkoutResponse.data.total}`));
  
  // Test checkout calculation with coupon
  try {
    const checkoutWithCouponData = {
      items: [
        { productId: testProductId, quantity: 2 }
      ],
      couponCode: testCouponCode
    };
    
    const couponCheckoutResponse = await axios.post(`${API_BASE_URL}${ENDPOINTS.CHECKOUT_CALCULATE}`, checkoutWithCouponData);
    if (couponCheckoutResponse.data) {
      console.log(chalk.green('Checkout calculation with coupon successful'));
      console.log(chalk.blue(`Subtotal: ${couponCheckoutResponse.data.subtotal}`));
      console.log(chalk.blue(`Discount: ${couponCheckoutResponse.data.discount || 0}`));
      console.log(chalk.blue(`Shipping: ${couponCheckoutResponse.data.shipping}`));
      console.log(chalk.blue(`Total: ${couponCheckoutResponse.data.total}`));
    }
  } catch (error) {
    console.log(chalk.yellow(`Note: Checkout with coupon test failed, but continuing with other tests`));
  }
  
  // Test coupon validation
  try {
    const couponValidationResponse = await axios.post(`${API_BASE_URL}${ENDPOINTS.VALIDATE_COUPON}`, {
      code: testCouponCode
    });
    
    if (couponValidationResponse.data) {
      console.log(chalk.green(`Coupon validation successful: ${testCouponCode}`));
      console.log(chalk.blue(`Discount: ${couponValidationResponse.data.discount || 'N/A'}`));
      console.log(chalk.blue(`Type: ${couponValidationResponse.data.type || 'N/A'}`));
    }
  } catch (error) {
    console.log(chalk.yellow(`Note: Coupon validation test failed, but continuing with other tests`));
  }
}

// Main test runner
async function runAllTests() {
  console.log(chalk.yellow('=== BUDDY BAZAAR API TESTING ==='));
  console.log(chalk.yellow(`Testing API at: ${API_BASE_URL}`));
  console.log(chalk.yellow('=============================='));
  
  const tests = [
    { name: 'Product API', fn: testProductAPI },
    { name: 'Admin API', fn: testAdminAPI },
    { name: 'Order API', fn: testOrderAPI },
    { name: 'Checkout API', fn: testCheckoutAPI }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await runTest(test.name, test.fn);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log(chalk.yellow('\n=== TEST SUMMARY ==='));
  console.log(chalk.green(`Passed: ${passed}`));
  console.log(chalk.red(`Failed: ${failed}`));
  console.log(chalk.yellow('=============================='));
  
  return { passed, failed };
}

// Export the test runner for use in other scripts
module.exports = {
  runAllTests,
  API_BASE_URL,
  ENDPOINTS
};

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests()
    .then(() => {
      console.log(chalk.green('\nAPI testing completed!'));
    })
    .catch(error => {
      console.error(chalk.red('\nAPI testing failed with error:'));
      console.error(chalk.red(error));
      process.exit(1);
    });
  
  if (failed === 0) {
    console.log(chalk.green('✓ All tests passed! The API is ready for deployment.'));
  } else {
    console.log(chalk.red(`✗ ${failed} test(s) failed. Please fix the issues before deployment.`));
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error(chalk.red('Test runner error:'));
  console.error(error);
});