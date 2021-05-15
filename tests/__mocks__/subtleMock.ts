export {};

const algorithm = { name: "ECDSA", namedCurve: "P-256" };

const publicKey: CryptoKey = { type: "public", extractable: true, algorithm, usages: ["verify"] };
global.publicKey = publicKey;

const privateKey: CryptoKey = { type: "private", extractable: true, algorithm, usages: ["sign"] };
global.privateKey = privateKey;

global.generateKeyMock = jest.fn().mockReturnValue(new Promise((resolve) => resolve({ publicKey, privateKey })));

global.exportKeyMock = jest.fn().mockImplementation((format: string): Promise<ArrayBuffer> => {
  return new Promise((resolve) => resolve(Buffer.from(format === "spki" ? global.spki : global.pkcs8)));
});

const LibraCoinSHA = "0c76d1c0fd368a15e15438e0689a97d3e2b7b6a8d2254e4fe9ac89b0a51b5fbc";
global.LibraCoinSHA = LibraCoinSHA;
global.LibraCoinEncode = new Uint8Array([76, 105, 98, 114, 97, 67, 111, 105, 110]);

global.digestMock = jest.fn().mockReturnValueOnce(Buffer.from(LibraCoinSHA));

global.getRandomValuesMock = jest.fn().mockImplementation((len: number) => new Uint32Array(len));
