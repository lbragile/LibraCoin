export declare global {
  namespace NodeJS {
    interface Global {
      state: IState;
      dispatch: React.Dispatch<IAction>;
      spki: string;
      spki_hex: string;
      pkcs8: string;
      pkcs8_hex: string;
      privateKey: CryptoKey;
      publicKey: CryptoKey;
      LibraCoinSHA: string;
      LibraCoinEncode: Uint8Array;
      generateKeyMock: jest.Mock;
      exportKeyMock: jest.Mock;
      digestMock: jest.Mock;
      getRandomValuesMock: jest.Mock;
    }
  }
}
