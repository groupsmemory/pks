import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { encryptData, decryptData } from '@/src/lib/crypto';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('encryptData / decryptData round-trip', () => {
  it('should encrypt and decrypt a basic string', () => {
    const plaintext = 'Hello, World!';
    const { ciphertext, iv, tag } = encryptData(plaintext);
    const decrypted = decryptData(ciphertext, iv, tag);
    expect(decrypted).toBe(plaintext);
  });

  it('should handle empty string', () => {
    const plaintext = '';
    const { ciphertext, iv, tag } = encryptData(plaintext);
    const decrypted = decryptData(ciphertext, iv, tag);
    expect(decrypted).toBe(plaintext);
  });

  it('should handle unicode and emoji characters', () => {
    const plaintext = 'Hello — こんにちは 🌍';
    const { ciphertext, iv, tag } = encryptData(plaintext);
    const decrypted = decryptData(ciphertext, iv, tag);
    expect(decrypted).toBe(plaintext);
  });

  it('should handle long strings', () => {
    const plaintext = 'A'.repeat(10000);
    const { ciphertext, iv, tag } = encryptData(plaintext);
    const decrypted = decryptData(ciphertext, iv, tag);
    expect(decrypted).toBe(plaintext);
  });
});

describe('invalid key', () => {
  it('should throw when DATABASE_CRYPTO_KEY is missing', () => {
    vi.stubEnv('DATABASE_CRYPTO_KEY', '');
    expect(() => encryptData('test')).toThrow('DATABASE_CRYPTO_KEY');
  });

  it('should throw when DATABASE_CRYPTO_KEY is undefined', () => {
    const original = process.env.DATABASE_CRYPTO_KEY;
    delete process.env.DATABASE_CRYPTO_KEY;
    expect(() => encryptData('test')).toThrow('DATABASE_CRYPTO_KEY');
    process.env.DATABASE_CRYPTO_KEY = original;
  });

  it('should throw when key is not 32 bytes (hex too short)', () => {
    vi.stubEnv('DATABASE_CRYPTO_KEY', 'aabb');
    expect(() => encryptData('test')).toThrow('32-byte');
  });

  it('should throw when key is not 32 bytes (utf8 too short)', () => {
    vi.stubEnv('DATABASE_CRYPTO_KEY', 'short');
    expect(() => encryptData('test')).toThrow('32-byte');
  });
});

describe('invalid ciphertext', () => {
  let valid: { ciphertext: string; iv: string; tag: string };

  beforeEach(() => {
    valid = encryptData('my secret data');
  });

  it('should throw on tampered ciphertext', () => {
    const bad = 'ff' + valid.ciphertext.slice(2);
    expect(() => decryptData(bad, valid.iv, valid.tag)).toThrow();
  });

  it('should throw on invalid hex ciphertext', () => {
    expect(() => decryptData('zzzz', valid.iv, valid.tag)).toThrow();
  });

  it('should throw on invalid hex iv', () => {
    expect(() => decryptData(valid.ciphertext, 'gggg', valid.tag)).toThrow();
  });

  it('should throw on invalid hex tag', () => {
    expect(() => decryptData(valid.ciphertext, valid.iv, 'xxxx')).toThrow();
  });

  it('should throw on empty ciphertext', () => {
    expect(() => decryptData('', valid.iv, valid.tag)).toThrow();
  });
});
