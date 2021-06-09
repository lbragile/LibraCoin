/**
 * @group utils
 */

import { bufferToHex, CryptoKeyToHex, digestMessage, randomHash } from "../../src/utils/conversion";

afterEach(() => {
  // if defined object property, need to clear (delete) it before next test
  if (window.crypto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-ignore */
    delete window.crypto;
  }
});

test("bufferToHex", () => {
  const { buffer } = new Uint8Array([4, 8, 12, 16]);
  expect(bufferToHex(buffer)).toEqual("04080c10");
});

test("CryptoKeyToHex", async () => {
  const { publicKey, privateKey, exportKeyMock } = global;

  Object.defineProperty(window, "crypto", { value: { subtle: { exportKey: exportKeyMock } }, configurable: true });

  const publicKeyStr = await CryptoKeyToHex("spki", publicKey);
  const privateKeyStr = await CryptoKeyToHex("pkcs8", privateKey);

  expect(exportKeyMock).toHaveBeenCalledTimes(2);
  expect(exportKeyMock).toHaveBeenCalledWith("spki", publicKey);
  expect(exportKeyMock).toHaveBeenCalledWith("pkcs8", privateKey);

  expect(publicKeyStr).toBe(global.spki_hex);
  expect(privateKeyStr).toBe(global.pkcs8_hex);
});

test("digestMessage", async () => {
  const { LibraCoinSHA, LibraCoinEncode, digestMock } = global;
  Object.defineProperty(window, "crypto", { value: { subtle: { digest: digestMock } }, configurable: true });

  expect(await digestMessage("LibraCoin")).toBe(bufferToHex(Buffer.from(LibraCoinSHA)));
  expect(digestMock).toHaveBeenCalledWith("SHA-256", LibraCoinEncode);
});

test("randomHash", () => {
  const { getRandomValuesMock } = global;
  Object.defineProperty(window, "crypto", { value: { getRandomValues: getRandomValuesMock }, configurable: true });

  // bufferToHex doubles the length since each byte is 2 hex bits max (due to padStart)
  expect(randomHash(10).length).toBe(20);
  expect(randomHash(5).length).toBe(10);
  expect(typeof randomHash(5)).toBe("string");
  expect(getRandomValuesMock).toHaveBeenCalledTimes(3);
});
