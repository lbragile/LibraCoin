import { useEffect } from "react";
import { ACTIONS } from "../enums/AppDispatchActions";
import { useAppContext } from "./useAppContext";

export function useResetTransactionDetails(userPK: string): void {
  const { dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: ACTIONS.SET_VALIDATED, payload: { validated: false } });
    dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: false, sent: false } });
    dispatch({
      type: ACTIONS.SET_DETAILS,
      payload: {
        details: { from: userPK, to: "", amount: "0.00", msg: "", signature: "" }
      }
    });
  }, [dispatch, userPK]);
}
