export declare global {
  namespace NodeJS {
    interface Global {
      state: IState;
      dispatch: React.Dispatch<IAction>;
      spki: string;
      spki_hex: string;
      pkcs8: string;
      pkcs8_hex: string;
    }
  }
}
