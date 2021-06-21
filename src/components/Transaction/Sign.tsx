import React, { useContext, useEffect, useRef } from "react";

import { Formik, ErrorMessage, Field } from "formik";
import { Form, Button, InputGroup } from "react-bootstrap";

import { AppContext } from "../../context/AppContext";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { IAction, IState } from "../../typings/AppTypes";
import { digestMessage } from "../../utils/conversion";
import { SignSchema } from "../../schema/SignSchema";

export default function Sign(): JSX.Element {
  const { state, dispatch } = useContext(AppContext) as { state: IState; dispatch: React.Dispatch<IAction> };

  const initialValues = useRef({
    from: state.user.publicKey,
    to: "",
    amount: "",
    msg: "",
    fromSK: state.user.privateKey
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.SET_VALIDATED, payload: { validated: false } });
    dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: false, sent: false } });
    dispatch({
      type: ACTIONS.SET_DETAILS,
      payload: {
        details: { from: state.user.publicKey, to: "", amount: Number(0).toFixed(2), msg: "", signature: "" }
      }
    });
  }, [dispatch, state.user.publicKey]);

  return (
    <Formik
      validationSchema={SignSchema(state.user.publicKey.length, state.user.balance)}
      onSubmit={async (data, { setSubmitting }) => {
        setSubmitting(true);
        const message = Object.values(data).reduce((total, curr) => total + curr, "");
        const currentDetails = { ...data, signature: await digestMessage(message) };

        dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: true } });
        dispatch({ type: ACTIONS.SET_DETAILS, payload: { details: currentDetails } });
        setSubmitting(false);
      }}
      initialValues={initialValues.current}
    >
      {({ handleSubmit, isSubmitting, values, touched, errors }) => (
        <Form aria-label="Sign Form" noValidate className="col-12 col-lg-5 trans-form" onSubmit={handleSubmit}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Sender Public Key</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              aria-label="Sender Public Key"
              name="from"
              className="text-truncate rounded-right"
              type="text"
              value={values.from}
              readOnly
            />
          </InputGroup>

          <Form.Text className="text-muted">Used to verify transaction was signed using your private key</Form.Text>

          <InputGroup className="my-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Receiver Public Key</InputGroup.Text>
            </InputGroup.Prepend>
            <Field
              as={Form.Control}
              aria-label="Receiver Public Key"
              name="to"
              className="text-truncate rounded-right"
              type="text"
              value={values.to}
              required
              readOnly={state.wallet.signed}
              isInvalid={!!touched.to && !!errors.to}
              isValid={!!touched.to && !errors.to}
            />

            <ErrorMessage
              name="to"
              render={(errorMessage) => (
                <Form.Control.Feedback
                  className="font-weight-bold"
                  type="invalid"
                  role="alert"
                  aria-label="Receiver PK Feedback"
                >
                  {errorMessage}
                </Form.Control.Feedback>
              )}
            />
          </InputGroup>

          <InputGroup className="mb-2">
            <Field
              as={Form.Control}
              aria-label="Sign Amount"
              name="amount"
              type="number"
              step="any"
              placeholder={(1).toFixed(2)}
              value={values.amount}
              required
              readOnly={state.wallet.signed}
              isInvalid={!!touched.amount && !!errors.amount}
              isValid={!!touched.amount && !errors.amount}
            />

            <InputGroup.Append>
              <InputGroup.Text className="rounded-right border-left-0">LC</InputGroup.Text>
            </InputGroup.Append>

            <ErrorMessage
              name="amount"
              render={(errorMessage) => (
                <Form.Control.Feedback
                  className="font-weight-bold"
                  type="invalid"
                  role="alert"
                  aria-label="Amount Feedback"
                >
                  {errorMessage}
                </Form.Control.Feedback>
              )}
            />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Message</InputGroup.Text>
            </InputGroup.Prepend>
            <Field
              as={Form.Control}
              aria-label="Sign Message"
              name="msg"
              rows={2}
              placeholder="optional message..."
              value={values.msg}
              readOnly={state.wallet.signed}
              isValid={!!touched.msg && !errors.msg}
            />
          </InputGroup>

          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Sender Private Key</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              aria-label="Sender Private Key"
              name="fromSK"
              className="text-truncate"
              type="text"
              value={values.fromSK}
              readOnly
            />
          </InputGroup>

          <Form.Text className="text-muted">Not shared with anyone, keep this secret!</Form.Text>

          <Button
            aria-label="Sign Button"
            className="mt-2"
            variant={state.wallet.signed ? "success" : "primary"}
            type="submit"
            disabled={state.wallet.signed || isSubmitting}
            block
          >
            <b>{state.wallet.signed ? "Signed" : "Sign"}</b>
          </Button>
        </Form>
      )}
    </Formik>
  );
}
