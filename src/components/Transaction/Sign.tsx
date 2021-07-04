import React from "react";

import { Formik, ErrorMessage, Field } from "formik";
import { Form, Button, InputGroup } from "react-bootstrap";

import { useAppContext } from "../../hooks/useAppContext";
import { useResetTransactionDetails } from "../../hooks/useResetTransactionDetails";
import { ACTIONS } from "../../enums/AppDispatchActions";
import { SignSchema } from "../../schema/SignSchema";
import { digestMessage } from "../../utils/conversion";

export default function Sign(): JSX.Element {
  const { state, dispatch } = useAppContext();

  useResetTransactionDetails(state.user.publicKey);

  const TextAreaFormControl = (props: unknown): JSX.Element => {
    return <Form.Control as="textarea" {...props} />;
  };

  return (
    <Formik
      validationSchema={SignSchema(state.user.publicKey.length, state.user.balance)}
      onSubmit={async (data, { setSubmitting }) => {
        setSubmitting(true);
        const message = Object.values(data).reduce((total, curr) => total + curr, "");
        const currentDetails = { ...data, from: state.user.publicKey, signature: await digestMessage(message) };

        dispatch({ type: ACTIONS.SET_SIGNED, payload: { signed: true } });
        dispatch({ type: ACTIONS.SET_DETAILS, payload: { details: currentDetails } });
        setSubmitting(false);
      }}
      initialValues={{ to: "", amount: "", msg: "" }}
    >
      {({ handleSubmit, isSubmitting, touched, errors }) => (
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
              value={state.user.publicKey}
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
              aria-label="Receiver PK"
              name="to"
              className="text-truncate rounded-right"
              type="text"
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
              as={TextAreaFormControl}
              aria-label="Sign Message"
              name="msg"
              rows={2}
              placeholder="optional message..."
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
              value={state.user.privateKey}
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
