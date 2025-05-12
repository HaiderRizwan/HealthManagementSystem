const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get target from localStorage or use production URL as default
  const getProxyTarget = () => {
    // In development environment only
    if (process.env.NODE_ENV === 'development') {
      // Default to production in deployed environments
      return 'https://healthmanagementsystem-9wbb.onrender.com';
    }
    return 'https://healthmanagementsystem-9wbb.onrender.com';
  };

  // Proxy middleware configuration
  const proxyConfig = {
    target: getProxyTarget(),
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
  };
  
  // Proxy all API requests
  app.use('/api', createProxyMiddleware(proxyConfig));
  
  // Proxy auth-related endpoints
  app.use('/signup', createProxyMiddleware(proxyConfig));
  app.use('/login', createProxyMiddleware(proxyConfig));
}; 