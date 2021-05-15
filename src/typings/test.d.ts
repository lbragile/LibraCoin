export declare global {
  namespace NodeJS {
    interface Global {
      state: IState;
      dispatch: React.Dispatch<IAction>;
    }
  }
}
