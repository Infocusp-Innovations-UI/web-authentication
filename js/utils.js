/**
 * Utility Functions for WebAuthn Operations
 * These functions handle data conversion and challenge generation
 * for authentication flows
 */

/**
 * Converts ArrayBuffer to Base64 string
 * Used for storing credential IDs
 */
export function bufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

/**
 * Converts Base64 string back to ArrayBuffer
 * Used when retrieving stored credentials
 */
export function base64ToBuffer(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
}

/**
 * Generates cryptographically secure random challenge
 * Used in both registration and authentication
 */
export function generateRandomChallenge(length = 32) {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return randomBytes;
}
