import crypto from 'crypto';

const AES_ALGORITHM = 'aes-256-gcm';

/**
 * Retrieves and validates the 32-byte secret key from environment variables.
 */
function getSecretKey(): Buffer {
  const secret = process.env.DATABASE_CRYPTO_KEY;
  if (!secret) {
    throw new Error('CRITICAL: DATABASE_CRYPTO_KEY environment variable is undefined or missing.');
  }

  // Parse key from hex string first if possible, otherwise assume utf8 encoding
  const key = Buffer.from(secret, 'hex');
  if (key.length !== 32) {
    const utf8Key = Buffer.from(secret, 'utf8');
    if (utf8Key.length !== 32) {
      throw new Error(
        'CRITICAL: DATABASE_CRYPTO_KEY must be a 32-byte string or 64-character hex string for aes-256-gcm.'
      );
    }
    return utf8Key;
  }
  return key;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
}

/**
 * Encrypts a plaintext string using aes-256-gcm.
 * 
 * @param text The plaintext string to encrypt.
 * @returns Object containing the hex ciphertext, hex iv, and hex auth tag.
 */
export function encryptData(text: string): { ciphertext: string; iv: string; tag: string } {
  const key = getSecretKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    tag: authTag.toString('hex'),
  };
}

/**
 * Decrypts a ciphertext string using aes-256-gcm.
 * 
 * @param ciphertext The hex ciphertext to decrypt.
 * @param iv The hex initialization vector (iv) used during encryption.
 * @param tag The hex authentication tag (tag) used during encryption.
 * @returns The decrypted plaintext string.
 */
export function decryptData(ciphertext: string, iv: string, tag: string): string {
  const key = getSecretKey();
  const ivBuffer = Buffer.from(iv, 'hex');
  const tagBuffer = Buffer.from(tag, 'hex');

  const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(tagBuffer);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
