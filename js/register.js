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

    const publicKey = {
        challenge,
        rp: { name: "Infocusp Innovations" },
        user: {
            id: Uint8Array.from(username, c => c.charCodeAt(0)),
            name: username,
            displayName: username,
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
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
