const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

// Create HTTP server
const server = http.createServer((req, res) => {
    let filePath = './src' + req.url;
    if (filePath === './src/') {
        filePath = './src/index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Create WebSocket server for live reload
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    console.log('Client connected for live reload');
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    
    ws.on('error', (error) => {
        console.log('WebSocket error:', error.message);
    });
});

wss.on('error', (error) => {
    console.log('WebSocket server error:', error.message);
});

// Watch for file changes
const chokidar = require('chokidar');
const watcher = chokidar.watch(['src/**/*'], {
    ignored: /(^|[\/\\])\../,
    persistent: true
});

watcher.on('change', (path) => {
    console.log(`File ${path} has been changed`);
    // Notify all connected clients to reload
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send('reload');
            } catch (error) {
                console.log('Error sending reload message:', error.message);
            }
        }
    });
});

watcher.on('error', (error) => {
    console.log('File watcher error:', error.message);
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Development server running at http://localhost:${PORT}`);
    console.log(`�� WebSocket server running at ws://localhost:${WS_PORT}`);
    console.log(`🔄 Live reload enabled - changes will automatically refresh the browser`);
    console.log(`📁 Serving files from ./src/`);
    console.log(`\n💡 Open http://localhost:${PORT} in your browser`);
    console.log(`💡 Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    watcher.close();
    wss.close();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception:', error.message);
    console.log('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle port conflicts
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use`);
        console.log(`💡 Try running: lsof -i :${PORT} to see what's using the port`);
        console.log(`💡 Or kill the process and try again`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});
