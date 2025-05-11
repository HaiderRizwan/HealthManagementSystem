const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy middleware configuration
  const proxyConfig = {
    target: 'http://localhost:5000',
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