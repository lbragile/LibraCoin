import React, { useState, useRef } from "react";

import SendUI from "./SendUI";
import SignUI from "./SignUI";

export default function TransactionUI(): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);

  const formDetails = useRef<{ to: string; from: string; amount: number; message: string }>({
    to: "",
    from: JSON.parse(localStorage.getItem("user") as string)?.publicKey ?? "",
    amount: 0,
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      formDetails.current.amount = +formValues[1];
      formDetails.current.message = formValues[2];

      setSigned(true);
    } else if (form.checkValidity()) {
      // signed the transaction and need to send now
      const prevTrans = JSON.parse(localStorage.getItem("transactions") as string) || [];
      localStorage.setItem("transactions", JSON.stringify([...prevTrans, formDetails.current]));
      setShow(false);
    }
  };

  return (
    <div>
      <button className="font-weight-bold btn btn-info p-3 my-5" onClick={() => setShow(true)}>
        Make Transaction
      </button>
      {!signed ? (
        <SignUI show={show} setShow={setShow} validated={validated} handleSubmit={handleSubmit} />
      ) : (
        <SendUI
          show={show}
          setShow={setShow}
          validated={validated}
          setValidated={setValidated}
          setSigned={setSigned}
          handleSubmit={handleSubmit}
          details={formDetails.current}
        />
      )}
    </div>
  );
}
