const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the project directory
app.use(express.static(path.join(__dirname)));

// Serve register.html as the default page for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Serve login.html for the /login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Fallback route for 404 errors
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Check if SSL certificates exist
const sslKeyPath = path.join(__dirname, 'ssl', 'key.pem');
const sslCertPath = path.join(__dirname, 'ssl', 'cert.pem');

if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    // HTTPS server
    const options = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
    };
    https.createServer(options, app).listen(PORT, () => {
        console.log(`Server running at https://localhost:${PORT}`);
    });
} else {
    // HTTP server
    http.createServer(app).listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log('To enable HTTPS, generate SSL certificates and place them in the "ssl" folder.');
    });
}
