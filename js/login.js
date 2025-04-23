import { base64ToBuffer, generateRandomChallenge } from './utils.js';

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const credentialId = localStorage.getItem('credentialId');
    if (!credentialId) {
        document.getElementById('message').textContent = 'No credentials found. Please register first.';
        return;
    }

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
        const assertion = await navigator.credentials.get({ publicKey });
        console.log('Assertion:', assertion);
        document.getElementById('message').textContent = 'Login successful!';
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('message').textContent = 'Login failed.';
    }
});

document.getElementById('clear-keys').addEventListener('click', () => {
    localStorage.removeItem('credentialId');
    document.getElementById('message').textContent = 'Attached keys cleared!';
});
