import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState, ITransaction } from "../../typings/AppTypes";
import { digestMessage } from "../../utils/conversion";

import SendUI from "./SendUI";
import SignUI from "./SignUI";
import "./Transaction.css";

export default function Transaction(): JSX.Element {
  const { dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const [validated, setValidated] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);

  const formDetails = useRef<ITransaction>({
    to: "",
    from: JSON.parse(localStorage.getItem("user") as string)?.publicKey ?? "",
    amount: undefined,
    message: "",
    signature: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() && !signed) {
      // haven't signed the transaction yet
      const formInputs = { ...form };
      const formValues = Object.values(formInputs)
        .slice(1, 4)
        .map((input) => input.value);

      formDetails.current.to = formValues[0];
      formDetails.current.amount = formValues[1];
      formDetails.current.message = formValues[2];
      formDetails.current.signature = await digestMessage(JSON.stringify(formDetails.current));

      setSigned(true);
    } else if (form.checkValidity()) {
      // signed the transaction and need to send now
      dispatch({ type: ACTIONS.ADD_VERIFIED_TRANS, payload: { trans: formDetails.current } });
      setSigned(false);
      setValidated(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center mx-auto row my-4">
      <SignUI validated={validated} signed={signed} handleSubmit={handleSubmit} />
      <SendUI
        validated={validated}
        setValidated={setValidated}
        signed={signed}
        setSigned={setSigned}
        handleSubmit={handleSubmit}
        details={formDetails.current}
      />
    </div>
  );
}
