import { bufferToHex, CryptoKeyToHex, digestMessage, randomHash } from "../../../src/utils/conversion";

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
  const algorithm = { name: "ECDSA", namedCurve: "P-256" };
  const privateKey: CryptoKey = { type: "private", extractable: true, algorithm, usages: ["sign"] };
  const publicKey: CryptoKey = { type: "public", extractable: true, algorithm, usages: ["verify"] };

  const exportKeyMock = jest.fn().mockImplementation((format: string): Promise<ArrayBuffer> => {
    return new Promise((resolve) => resolve(Buffer.from(format === "spki" ? global.spki : global.pkcs8)));
  });

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
  const LibraCoinEncode = new Uint8Array([76, 105, 98, 114, 97, 67, 111, 105, 110]);
  const LibraCoinSHA = "0c76d1c0fd368a15e15438e0689a97d3e2b7b6a8d2254e4fe9ac89b0a51b5fbc";
  const digestMock = jest.fn().mockImplementationOnce(() => Buffer.from(LibraCoinSHA));
  Object.defineProperty(window, "crypto", { value: { subtle: { digest: digestMock } }, configurable: true });

  expect(await digestMessage("LibraCoin")).toBe(bufferToHex(Buffer.from(LibraCoinSHA)));
  expect(digestMock).toHaveBeenCalledWith("SHA-256", LibraCoinEncode);
});

test("randomHash", () => {
  const getRandomValuesMock = jest.fn().mockImplementation((len: number) => new Uint32Array(len));
  Object.defineProperty(window, "crypto", { value: { getRandomValues: getRandomValuesMock }, configurable: true });

  // bufferToHex doubles the length since each byte is 2 hex bits max (due to padStart)
  expect(randomHash(10).length).toBe(20);
  expect(randomHash(5).length).toBe(10);
  expect(typeof randomHash(5)).toBe("string");
  expect(getRandomValuesMock).toHaveBeenCalledTimes(3);
});
