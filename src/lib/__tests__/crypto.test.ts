import { describe, expect, it } from 'vitest';
import { encryptData, decryptData } from '@/src/lib/crypto';

describe('crypto', () => {
  it('should round-trip encrypt and decrypt a string', () => {
    const plaintext = 'Hello, World!';
    const { ciphertext, iv, tag } = encryptData(plaintext);
    const decrypted = decryptData(ciphertext, iv, tag);
    expect(decrypted).toBe(plaintext);
  });

  it('should produce different ciphertexts for the same plaintext (random IV)', () => {
    const plaintext = 'test';
    const a = encryptData(plaintext);
    const b = encryptData(plaintext);
    expect(a.ciphertext).not.toBe(b.ciphertext);
    expect(a.iv).not.toBe(b.iv);
  });

  it('should handle long strings', () => {
    const plaintext = 'A'.repeat(10000);
    const { ciphertext, iv, tag } = encryptData(plaintext);
    const decrypted = decryptData(ciphertext, iv, tag);
    expect(decrypted).toBe(plaintext);
  });

  it('should handle unicode characters', () => {
    const plaintext = 'Jazakallahu Khairan — جزاك الله خيرًا 🌙';
    const { ciphertext, iv, tag } = encryptData(plaintext);
    const decrypted = decryptData(ciphertext, iv, tag);
    expect(decrypted).toBe(plaintext);
  });

  it('should throw on wrong auth tag', () => {
    const plaintext = 'secret';
    const { ciphertext, iv } = encryptData(plaintext);
    expect(() => decryptData(ciphertext, iv, 'deadbeefdeadbeefdeadbeefdeadbeef')).toThrow();
  });
});
