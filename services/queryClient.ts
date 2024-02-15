
'use client'


import * as CryptoJS from 'crypto-js';



export function encryptAES(inputString: string, passphrase: string): string {
    // Encrypt with AES using the passphrase
    const encrypted = CryptoJS.AES.encrypt(inputString, passphrase).toString();
    return encrypted;
}

export function decryptAES(encryptedString: string, passphrase: string): string {
    // Decrypt the encrypted string using the passphrase
    const decrypted = CryptoJS.AES.decrypt(encryptedString, passphrase).toString(CryptoJS.enc.Utf8);
    return decrypted;
}



export enum DialogStatus {
    Off = -1,
    Create = 0,
    Update = 1,
    Delete = 2
  }