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
        console.log('Credential:', credential);
        document.getElementById('message').textContent = 'Registration successful!';
        localStorage.setItem('credentialId', bufferToBase64(credential.rawId));
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('message').textContent = 'Registration failed.';
    }
});

document.getElementById('clear-keys').addEventListener('click', () => {
    localStorage.removeItem('credentialId');
    document.getElementById('message').textContent = 'Attached keys cleared!';
});
