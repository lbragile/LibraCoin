import { IState } from "./AppTypes";

declare global {
  namespace NodeJS {
    interface Global {
      initialState: IState;
      spki: string;
      spki_hex: string;
      pkcs8: string;
      pkcs8_hex: string;
      privateKey: CryptoKey;
      publicKey: CryptoKey;
      LibraCoinSHA: string;
      LibraCoinEncode: Uint8Array;
      generateKeyMock: jest.Mock<Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }>>;
      exportKeyMock: jest.Mock<(format: string) => Promise<ArrayBuffer>>;
      digestMock: jest.Mock<ArrayBuffer>;
      getRandomValuesMock: jest.Mock<(len: number) => Uint32Array>;
    }
  }
}
