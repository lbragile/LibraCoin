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

  // Obtained values from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
  const spki = `-----BEGIN PUBLIC KEY-----
                MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3j+HgSHUnc7F6XzvEbD0
                r3M5JNy+/kabiJVu8IU1ERAl3Osi38VgiMzjDBDOrFxVzNNzl+SXAHwXIV5BHiXL
                CQ6qhwYsDgH6OqgKIwiALra/wNH4UHxj1Or/iyAkjHRR/kGhUtjyVCjzvaQaDpJW
                2G+syd1ui0B6kJov2CRUWiPwpff8hBfVWv8q9Yc2yD5hCnykVL0iAiyn+SDAk/rv
                8dC5eIlzCI4efUCbyG4c9O88Qz7bS14DxSfaPTy8P/TWoihVVjLaDF743LgM/JLq
                CDPUBUA3HLsZUhKm3BbSkd7Q9Ngkjv3+yByo4/fL+fkYRa8j9Ypa2N0Iw53LFb3B
                gQIDAQAB
                -----END PUBLIC KEY-----`;

  const spki_hex = `2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a20202020202020202020202
                    0202020204d494942496a414e42676b71686b6947397730424151454641414f43415138414d49
                    494243674b4341514541336a2b48675348556e63374636587a76456244300a202020202020202
                    0202020202020202072334d354a4e792b2f6b6162694a5675384955314552416c334f73693338
                    5667694d7a6a4442444f724678567a4e4e7a6c2b535841487758495635424869584c0a2020202
                    02020202020202020202020204351367168775973446748364f71674b497769414c72612f774e
                    48345548786a314f722f6979416b6a4852522f6b476855746a7956436a7a7661516144704a570
                    a2020202020202020202020202020202032472b7379643175693042366b4a6f76324352555769
                    50777066663868426656577638713959633279443568436e796b564c30694169796e2b5344416
                    b2f72760a202020202020202020202020202020203864433565496c7a43493465665543627947
                    3463394f3838517a3762533134447853666150547938502f54576f696856566a4c61444637343
                    34c674d2f4a4c710a202020202020202020202020202020204344505542554133484c735a5568
                    4b6d334262536b643751394e676b6a76332b7942796f342f664c2b666b595261386a395970613
                    24e30497735334c466233420a2020202020202020202020202020202067514944415141420a20
                    2020202020202020202020202020202d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d`;

  const pkcs8 = `-----BEGIN PRIVATE KEY-----
                MIG2AgEAMBAGByqGSM49AgEGBSuBBAAiBIGeMIGbAgEBBDAU9BD0jxDfF5OV380z
                9VIEUN2W5kJDZ3hbuaDenCxLiAMsoquKTfFaou71eLdN0TShZANiAARMUhCee/cp
                xmjGc1roj0D0k6VlUqtA+JVCWigXcIAukOeTHCngZDKCrD4PkXDBvbciJdZKvO+l
                ml2FIkoovZh/8yeTKmjUMb804g6OmjUc9vVojCRV0YdaSmYkkJMJbLg=
                -----END PRIVATE KEY-----`;

  const pkcs8_hex = `2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0a202020202020202020202
                     020202020204d494732416745414d42414742797147534d343941674547425375424241416942
                     4947654d4947624167454242444155394244306a78446646354f563338307a0a2020202020202
                     020202020202020202039564945554e3257356b4a445a336862756144656e43784c69414d736f
                     71754b546646616f753731654c644e305453685a414e694141524d55684365652f63700a20202
                     020202020202020202020202020786d6a476331726f6a3044306b36566c557174412b4a564357
                     696758634941756b4f655448436e675a444b43724434506b584442766263694a645a4b764f2b6
                     c0a202020202020202020202020202020206d6c3246496b6f6f765a682f387965544b6d6a554d
                     6238303467364f6d6a55633976566f6a43525630596461536d596b6b4a4d4a624c673d0a20202
                     0202020202020202020202020202d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d`;

  const exportKeyMock = jest.fn().mockImplementation((format: string): Promise<ArrayBuffer> => {
    return new Promise((resolve) => resolve(Buffer.from(format === "spki" ? spki : pkcs8)));
  });

  Object.defineProperty(window, "crypto", { value: { subtle: { exportKey: exportKeyMock } }, configurable: true });

  const publicKeyStr = await CryptoKeyToHex("spki", publicKey);
  const privateKeyStr = await CryptoKeyToHex("pkcs8", privateKey);

  expect(exportKeyMock).toHaveBeenCalledTimes(2);
  expect(exportKeyMock).toHaveBeenCalledWith("spki", publicKey);
  expect(exportKeyMock).toHaveBeenCalledWith("pkcs8", privateKey);

  expect(publicKeyStr).toBe(spki_hex.replace(/\r?\n|\r|\s/g, ""));
  expect(privateKeyStr).toBe(pkcs8_hex.replace(/\r?\n|\r|\s/g, ""));
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
