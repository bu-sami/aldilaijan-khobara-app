/**
 * Utility to check if the application is running on AWS
 */
const https = require('https');
const os = require('os');
const dns = require('dns');

/**
 * Checks if the application is running on AWS
 * @returns {Promise<boolean>} True if running on AWS, false otherwise
 */
async function isRunningOnAws() {
  try {
    // Method 1: Check for AWS instance metadata service
    const instanceDataPromise = new Promise((resolve, reject) => {
      const req = https.request({
        hostname: '169.254.169.254',
        port: 443,
        path: '/latest/meta-data/',
        method: 'GET',
        timeout: 1000
      }, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    });
    
    // Method 2: Check for AWS environment variables
    const hasAwsEnvVars = 
      process.env.AWS_REGION || 
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.ECS_CONTAINER_METADATA_URI;
    
    // Method 3: Check hostname pattern
    const hostname = os.hostname();
    const hasAwsHostname = 
      hostname.includes('ec2') || 
      hostname.includes('compute.amazonaws.com') ||
      hostname.endsWith('.aws');
    
    // Method 4: Check for AWS IP ranges
    const ipPromise = new Promise((resolve) => {
      dns.lookup(os.hostname(), (err, address) => {
        if (err || !address) {
          resolve(false);
          return;
        }
        
        // AWS IP prefixes (simplified check for common ranges)
        const awsRanges = ['52.', '54.', '18.', '35.', '13.'];
        resolve(awsRanges.some(prefix => address.startsWith(prefix)));
      });
    });

    // Combine results
    const [isInstanceData, isAwsIp] = await Promise.all([instanceDataPromise, ipPromise]);
    
    return isInstanceData || hasAwsEnvVars || hasAwsHostname || isAwsIp;
  } catch (error) {
    console.error('Error checking AWS deployment:', error);
    return false;
  }
}

module.exports = {
  isRunningOnAws
};
