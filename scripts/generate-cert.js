const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sslDir = path.join(__dirname, '..', 'ssl');
const keyPath = path.join(sslDir, 'key.pem');
const certPath = path.join(sslDir, 'cert.pem');

// Ensure the ssl directory exists
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir);
}

// Generate SSL certificate if it doesn't already exist
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    try {
        execSync(
            `openssl req -nodes -new -x509 -keyout ${keyPath} -out ${certPath} -days 365 -subj "/CN=localhost"`,
            { stdio: 'inherit' }
        );
        console.log('SSL certificate generated successfully.');
    } catch (error) {
        console.error('Error generating SSL certificate:', error.message);
    }
} else {
    console.log('SSL certificate already exists.');
}
