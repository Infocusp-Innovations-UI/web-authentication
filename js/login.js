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

    // Step 1: Get user information
    const username = document.getElementById('username').value;
    
    // Step 2: Check for stored credentials
    const credentialId = localStorage.getItem('credentialId');
    if (!credentialId) {
        document.getElementById('message').textContent = 'No credentials found. Please register first.';
        return;
    }

    // Step 3: Prepare authentication options
    const challenge = generateRandomChallenge();
    const publicKey = {
        challenge,
        allowCredentials: [{
            id: base64ToBuffer(credentialId),
            type: "public-key",
        }],
        userVerification: "preferred",
    };

    try {
        // Step 4: Verify credentials
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
