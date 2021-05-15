import { TextEncoder } from "text-encoding";

export function bufferToHex(hashBuffer: ArrayBuffer): string {
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
  return hashHex;
}

export async function CryptoKeyToHex(format: string, key: CryptoKey): Promise<string> {
  const buf = (await window.crypto.subtle.exportKey(format, key)) as ArrayBuffer;
  return bufferToHex(buf);
}

export async function digestMessage(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  return bufferToHex(hashBuffer);
}

export function randomHash(len: number): string {
  return bufferToHex(window.crypto.getRandomValues(new Uint32Array(len)));
}
