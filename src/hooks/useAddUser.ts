import { useEffect } from "react";
import { useAppContext } from "./useAppContext";
import { ACTIONS } from "../enums/AppDispatchActions";
import { CryptoKeyToHex } from "../utils/conversion";
import { IUser } from "../typings/AppTypes";

export function useAddUser(userSK: string, users: IUser[]): void {
  const { dispatch } = useAppContext();

  useEffect(() => {
    async function addUser(): Promise<void> {
      if (userSK === "") {
        const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
          { name: "ECDSA", namedCurve: "P-256" },
          true,
          ["sign", "verify"]
        );

        const publicKeyStr = await CryptoKeyToHex("spki", publicKey as CryptoKey);
        const privateKeyStr = await CryptoKeyToHex("pkcs8", privateKey as CryptoKey);

        const newUser = { publicKey: publicKeyStr, balance: "1000.00" };
        dispatch({ type: ACTIONS.SET_MAIN_USER, payload: { user: { ...newUser, privateKey: privateKeyStr } } });
        dispatch({ type: ACTIONS.UPDATE_USERS, payload: { users: [...users, newUser] } });
      }
    }

    addUser();
  }, [dispatch, userSK, users]);
}
