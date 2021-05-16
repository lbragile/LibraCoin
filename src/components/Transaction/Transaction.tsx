import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, ITransaction } from "../../typings/AppTypes";
import { digestMessage } from "../../utils/conversion";

import Send from "./Send";
import Sign from "./Sign";
import "./Transaction.css";

export default function Transaction(): JSX.Element {
  const { dispatch } = useContext(AppContext) as { dispatch: React.Dispatch<IAction> };

  const [validated, setValidated] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);

  const formDetails = useRef<ITransaction>({
    to: "",
    from: JSON.parse(localStorage.getItem("user") as string)?.publicKey ?? "",
    amount: undefined,
    message: "",
    signature: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity()) {
      if (!signed) {
        // haven't signed the transaction yet
        const formValues = Object.values({ ...form }).slice(1, 4).map((input) => input.value); // prettier-ignore
        [formDetails.current.to, formDetails.current.amount, formDetails.current.message] = formValues;

        const message = formDetails.current.to + formDetails.current.from + formDetails.current.message + formDetails.current.amount; // prettier-ignore
        formDetails.current.signature = await digestMessage(message);
      } else {
        // signed the transaction and need to send now
        dispatch({ type: ACTIONS.ADD_VERIFIED_TRANS, payload: { trans: formDetails.current } });
      }

      setValidated(!signed);
      setSigned(!signed);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center mx-auto row my-4">
      <Sign validated={validated} signed={signed} handleSubmit={handleSubmit} />
      <Send
        validated={validated}
        signed={signed}
        handleSubmit={handleSubmit}
        details={formDetails.current}
        setSigned={setSigned}
        setValidated={setValidated}
      />
    </div>
  );
}
