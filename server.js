/**
 * Main Server Configuration
 * Flow:
 * 1. Initialize Express server
 * 2. Set up static file serving
 * 3. Configure routes
 * 4. Start HTTPS/HTTP server based on SSL availability
 */

const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db/db');

const app = express();
const PORT = 3000;

// Initialize Express middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// API Endpoints
app.post('/api/register', (req, res) => {
    const { username, credential } = req.body;
    
    if (db.findUser(username)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    db.saveUser({ username, credential });
    res.json({ success: true });
});

app.post('/api/login', (req, res) => {
    const { username } = req.body;
    const user = db.findUser(username);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
        success: true, 
        credential: user.credential 
    });
});

// Route Handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Error handling
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Server initialization with SSL check
const sslKeyPath = path.join(__dirname, 'ssl', 'key.pem');
const sslCertPath = path.join(__dirname, 'ssl', 'cert.pem');

// Start server with appropriate protocol
if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const options = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
    };
    https.createServer(options, app).listen(PORT, () => {
        console.log(`Secure server running at https://localhost:${PORT}`);
    });
} else {
    http.createServer(app).listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log('Warning: HTTPS recommended for security. Generate SSL certificates using npm run generate-cert');
    });
}
