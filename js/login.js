/**
 * WebAuthn Authentication Flow
 * 1. User submits username
 * 2. Retrieve stored credential ID
 * 3. Generate authentication options
 * 4. Verify credentials
 */

import { base64ToBuffer, generateRandomChallenge } from './utils.js';

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        if (!response.ok) throw new Error('Login failed');
        
        const { credential } = await response.json();
        if (!credential) {
            document.getElementById('message').textContent = 'No credentials found. Please register first.';
            return;
        }

        const challenge = generateRandomChallenge();
        console.log('challenge by login:', challenge);
        const publicKey = {
            challenge,
            allowCredentials: [{
                id: base64ToBuffer(credential),
                type: "public-key",
            }],
            userVerification: "preferred",
        };

        const assertion = await navigator.credentials.get({ publicKey });
        document.getElementById('message').textContent = 'Login successful!';
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('message').textContent = 'Login failed.';
    }
});

// Cleanup function
document.getElementById('clear-keys').addEventListener('click', () => {
    localStorage.removeItem('credentialId');
    document.getElementById('message').textContent = 'Attached keys cleared!';
});
