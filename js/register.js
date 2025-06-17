/**
 * WebAuthn Registration Flow
 * 1. User submits username
 * 2. Generate registration options
 * 3. Create credentials
 * 4. Store credential ID
 */

import { bufferToBase64, generateRandomChallenge } from './utils.js';

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const challenge = generateRandomChallenge();
    console.log('challenge by register:', challenge);

    const publicKey = {
        challenge,
        rp: { name: "Infocusp Innovations", id: "localhost" },
        user: {
            id: new TextEncoder().encode(crypto.randomUUID()),
            name: username,
            displayName: username,
        },
        pubKeyCredParams: [
            { type: "public-key", alg: -7 },   // ES256 (Elliptic Curve - most common)
            { type: "public-key", alg: -257 }, // RS256 (RSA with SHA-256)
            { type: "public-key", alg: -37 },  // PS256 (RSA-PSS with SHA-256)
            { type: "public-key", alg: -35 },  // ES384 (ECDSA with P-384 curve)
            { type: "public-key", alg: -36 },  // ES512 (ECDSA with P-521 curve)
        ],
    };

    try {
        const credential = await navigator.credentials.create({ publicKey });
        const credentialId = bufferToBase64(credential.rawId);
        
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username, 
                credential: credentialId 
            })
        });

        if (!response.ok) throw new Error('Registration failed');
        
        document.getElementById('message').textContent = 'Registration successful!';
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('message').textContent = 'Registration failed.';
    }
});

// Cleanup function
document.getElementById('clear-keys').addEventListener('click', () => {
    localStorage.removeItem('credentialId');
    document.getElementById('message').textContent = 'Attached keys cleared!';
});
