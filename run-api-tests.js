/**
 * API Test Runner Script
 * 
 * This script loads test environment variables and runs the API tests
 */

// Load test environment variables
require('dotenv').config({ path: './.env.test' });

// Import the test runner
const { runAllTests } = require('./test-api-endpoints');

console.log('Running API tests with test environment configuration...');

// Run the tests
runAllTests()
  .then(({ passed, failed }) => {
    console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
      console.log('\nSome tests failed. Please check the logs above for details.');
      process.exit(1);
    } else {
      console.log('\nAll tests passed successfully!');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('\nTest execution failed with error:');
    console.error(error);
    process.exit(1);
  });