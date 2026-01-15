// Simple mock backend server for Psygo AI Camera
// No external dependencies required
// Run with: node mock-backend-simple.js

const http = require('http');

// Configuration
const PORT = 8080;
const HOST = '0.0.0.0';

// Simple API responses
const responses = {
  '/health': {
    status: 'healthy',
    service: 'ai-camera-api',
    timestamp: () => Date.now() / 1000,
    version: '1.0.0'
  },
  '/api/v1/health/': {
    status: 'healthy',
    service: 'ai-camera-api',
    timestamp: () => Date.now() / 1000,
    version: '1.0.0'
  },
  '/api/v1/health/detailed': {
    status: 'healthy',
    components: {
      api: 'operational',
      database: 'connected',
      ai_model: 'loaded',
      websocket: 'ready'
    },
    timestamp: () => Date.now() / 1000
  },
  '/': {
    message: 'Psygo AI Camera API',
    version: '1.0.0',
    docs: '/docs',
    status: 'running'
  },
  '/api/v1/docs': {
    title: 'Psygo AI Camera API',
    version: '1.0.0',
    endpoints: [
      { path: '/health', method: 'GET', description: 'Health check' },
      { path: '/api/v1/images/enhance', method: 'POST', description: 'Enhance image' },
      { path: '/api/v1/users', method: 'POST', description: 'Create user' }
    ]
  }
};

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Handle POST requests
  if (req.method === 'POST') {
    if (req.url === '/api/v1/images/enhance') {
      handlePostImageEnhance(req, res);
      return;
    } else if (req.url === '/api/v1/users') {
      handlePostCreateUser(req, res);
      return;
    }
  }
  
  // Handle GET requests
  const path = req.url;
  let responseData = responses[path];
  
  // If no exact match, check without trailing slash
  if (!responseData && path.endsWith('/')) {
    responseData = responses[path.slice(0, -1)];
  }
  
  if (responseData) {
    // Process dynamic values
    const processedResponse = JSON.parse(JSON.stringify(responseData));
    if (typeof processedResponse.timestamp === 'function') {
      processedResponse.timestamp = processedResponse.timestamp();
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(processedResponse));
  } else {
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `Endpoint ${req.url} not found`,
      timestamp: Date.now() / 1000
    }));
  }
});

// Handle image enhancement POST request
function handlePostImageEnhance(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    // Parse form data (simplified)
    const params = new URLSearchParams(body);
    const zoomLevel = parseFloat(params.get('zoom_level') || '1.5');
    const enhancementLevel = params.get('enhancement_level') || 'medium';
    
    // Simulate processing delay
    setTimeout(() => {
      const response = {
        id: `img_${Date.now()}`,
        original_size: 1024 * 1024, // 1MB
        zoom_level: zoomLevel,
        enhancement_level: enhancementLevel,
        processing_time_ms: Math.floor(Math.random() * 100) + 50,
        quality_score: 0.85 + (zoomLevel * 0.05),
        enhanced_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        timestamp: Date.now() / 1000,
        user_id: params.get('user_id') || 'demo_user'
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    }, 100);
  });
}

// Handle create user POST request
function handlePostCreateUser(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    const params = new URLSearchParams(body);
    const username = params.get('username') || 'demo_user';
    
    const response = {
      id: `user_${Date.now()}`,
      username: username,
      email: params.get('email') || `${username}@example.com`,
      created_at: Date.now() / 1000,
      settings: {
        default_zoom: parseFloat(params.get('default_zoom') || '1.0'),
        enhancement_level: params.get('enhancement_level') || 'medium',
        auto_save: params.get('auto_save') === 'true' || true
      },
      is_active: true
    };
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  });
}

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Simple mock backend server running at http://${HOST}:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api/v1/docs`);
  console.log('\nAvailable endpoints:');
  console.log('  GET  /health                 - Health check');
  console.log('  GET  /api/v1/health/detailed - Detailed health');
  console.log('  GET  /                       - API root');
  console.log('  GET  /api/v1/docs            - API documentation');
  console.log('  POST /api/v1/images/enhance  - Image enhancement (simulated)');
  console.log('  POST /api/v1/users           - Create user');
  console.log('\nFrontend proxy should be configured to: http://localhost:8080');
  console.log('Press Ctrl+C to stop');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down mock backend server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});