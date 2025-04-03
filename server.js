const { isRunningOnAws } = require('./utils/isAwsDeployment');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

async function configureApplication() {
  const isAws = await isRunningOnAws();
  
  if (isAws) {
    console.log('Application is running on AWS environment');
    // AWS-specific configurations
    // For example:
    // - Set up AWS CloudWatch logs
    // - Configure AWS-specific environment variables
    // - Use AWS-specific service endpoints
  } else {
    console.log('Application is running in a non-AWS environment');
    // Local or other cloud provider configurations
  }
}

// Initialize the server
async function startServer() {
  try {
    // Configure the application based on environment
    await configureApplication();
    
    // Basic route
    app.get('/', (req, res) => {
      res.send('Server is running correctly!');
    });
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Server URL: http://localhost:${PORT}`);
      console.log('Press Ctrl+C to terminate the server');
    });
  } catch (err) {
    console.error('Error during application startup:', err);
    process.exit(1);
  }
}

// Start the server
startServer();
