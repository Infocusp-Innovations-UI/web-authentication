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
    
    // Step 1: Get user information
    const username = document.getElementById('username').value;
    const challenge = generateRandomChallenge();

    // Step 2: Prepare registration options
    const publicKey = {
        challenge,
        rp: { name: "Infocusp Innovations" },
        user: {
            id: Uint8Array.from(username, c => c.charCodeAt(0)),
            name: username,
            displayName: username,
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256 algorithm
    };

    try {
        // Step 3: Create credentials
        const credential = await navigator.credentials.create({ publicKey });
        
        // Step 4: Store credential ID
        localStorage.setItem('credentialId', bufferToBase64(credential.rawId));
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
