// Mock backend server for Psygo AI Camera
// Run with: node mock-backend.js

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 8080;
const HOST = '0.0.0.0';

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // API routing
  if (req.method === 'GET') {
    if (req.url === '/health' || req.url === '/api/v1/health/') {
      handleHealth(req, res);
    } else if (req.url === '/api/v1/health/detailed') {
      handleDetailedHealth(req, res);
    } else if (req.url === '/') {
      handleRoot(req, res);
    } else if (req.url === '/api/v1/docs') {
      handleDocs(req, res);
    } else {
      handleNotFound(req, res);
    }
  } else if (req.method === 'POST') {
    if (req.url === '/api/v1/images/enhance') {
      handleImageEnhance(req, res);
    } else if (req.url === '/api/v1/users') {
      handleCreateUser(req, res);
    } else {
      handleNotFound(req, res);
    }
  } else {
    handleNotFound(req, res);
  }
});

// Health check endpoint
function handleHealth(req, res) {
  const response = {
    status: 'healthy',
    service: 'ai-camera-api',
    timestamp: Date.now() / 1000,
    version: '1.0.0'
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}

// Detailed health check
function handleDetailedHealth(req, res) {
  const response = {
    status: 'healthy',
    components: {
      api: 'operational',
      database: 'connected',
      ai_model: 'loaded',
      websocket: 'ready'
    },
    timestamp: Date.now() / 1000
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}

// Root endpoint
function handleRoot(req, res) {
  const response = {
    message: 'Psygo AI Camera API',
    version: '1.0.0',
    docs: '/docs',
    status: 'running'
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}

// Image enhancement endpoint (simulated)
function handleImageEnhance(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    // Simulate processing delay
    setTimeout(() => {
      const response = {
        id: `img_${Date.now()}`,
        original_size: 1024 * 1024, // 1MB
        zoom_level: 1.5,
        enhancement_level: 'medium',
        processing_time_ms: 150,
        quality_score: 0.92,
        enhanced_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA...', // Placeholder
        timestamp: Date.now() / 1000,
        user_id: 'demo_user'
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    }, 100);
  });
}

// Create user endpoint
function handleCreateUser(req, res) {
  const response = {
    id: `user_${Date.now()}`,
    username: 'demo_user',
    email: 'demo@example.com',
    created_at: Date.now() / 1000,
    settings: {
      default_zoom: 1.0,
      enhancement_level: 'medium',
      auto_save: true
    },
    is_active: true
  };
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}

// API docs endpoint
function handleDocs(req, res) {
  const response = {
    title: 'Psygo AI Camera API',
    version: '1.0.0',
    endpoints: [
      { path: '/health', method: 'GET', description: 'Health check' },
      { path: '/api/v1/images/enhance', method: 'POST', description: 'Enhance image' },
      { path: '/api/v1/users', method: 'POST', description: 'Create user' }
    ]
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
}

// 404 handler
function handleNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    message: `Endpoint ${req.url} not found`,
    timestamp: Date.now() / 1000
  }));
}

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('WebSocket message:', data);
      
      // Echo back with some processing simulation
      if (data.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: Date.now(),
          server_time: Date.now()
        }));
      } else if (data.type === 'image_frame') {
        // Simulate processing
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'processing_result',
            status: 'processing',
            frame_id: data.frame_id,
            progress: 50
          }));
          
          setTimeout(() => {
            ws.send(JSON.stringify({
              type: 'enhanced_image',
              frame_id: data.frame_id,
              enhanced_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA...',
              processing_time_ms: 200,
              quality_score: 0.89,
              zoom_level: data.zoom_level || 1.0,
              enhancement_level: 'medium'
            }));
          }, 300);
        }, 100);
      }
    } catch (err) {
      console.error('WebSocket error:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Mock backend server running at http://${HOST}:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api/v1/docs`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down mock backend server...');
  wss.close(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});