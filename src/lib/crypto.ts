// ==============================================================================
// WebCrypto PBKDF2 Password / PIN Hashing & Key Derivation
// ==============================================================================

/**
 * Converts ArrayBuffer to Hex String
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let hexString = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    hexString += byteArray[i].toString(16).padStart(2, '0');
  }
  return hexString;
}

/**
 * Generates a cryptographically secure random salt in hex
 */
export function generateSalt(length = 16): string {
  const randomBytes = new Uint8Array(length);
  window.crypto.getRandomValues(randomBytes);
  return bufferToHex(randomBytes.buffer);
}

/**
 * Derives a PBKDF2 SHA-256 hash from a PIN and Salt with 100,000 iterations
 */
export async function hashPin(pin: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const pinBuffer = enc.encode(pin);
  const saltBuffer = enc.encode(saltHex);

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    pinBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    256 // 32 bytes
  );

  return bufferToHex(derivedKey);
}

/**
 * Validates a PIN against stored salt and hash
 */
export async function verifyPin(pin: string, saltHex: string, expectedHashHex: string): Promise<boolean> {
  try {
    const computedHash = await hashPin(pin, saltHex);
    return computedHash === expectedHashHex;
  } catch (err) {
    console.error('PIN verification error:', err);
    return false;
  }
}
