import React, { useState, useRef } from "react";
import { Form, Modal } from "react-bootstrap";

import "./BoxItemLineUI.css";

interface IUser {
  publicKey: string;
  balance: number;
  index?: number;
}

interface ITransaction {
  fromKey: string;
  toKey: string;
  amount: number;
  signature: string;
  index?: number;
}

export default function BoxItemLineUI({
  details,
  title,
}: {
  details: IUser[] | ITransaction[];
  title: string;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalText = useRef<IUser | ITransaction>({ index: 0, publicKey: "", balance: 0 });

  function showUserDetails(boxDetail: IUser | ITransaction, index: number): void {
    modalText.current = { ...boxDetail, index };
    setShow(true);
  }

  function copyPublicKey(e: React.FocusEvent<HTMLInputElement>): void {
    e.target.select();
    e.target.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setCopied(true);
  }

  return (
    <div>
      <div>
        <h3>
          <b>{title}:</b>
        </h3>
        <div id="user-list-background">
          {details.map((boxDetail: IUser | ITransaction, i: number) => {
            return (
              <div className="user-item ml-3 col-1" onClick={() => showUserDetails(boxDetail, i)} key={Math.random()}>
                <p className="user-item-index-text">
                  <b>{i}</b>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <Modal show={show} centered onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {title.toLowerCase().includes("user") ? "User" : "Verified Transaction"} #{modalText.current.index} Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {title.toLowerCase().includes("user") ? (
            <div>
              <Form.Group>
                <Form.Label>
                  <h5>Public Key:</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="text-truncate"
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => copyPublicKey(e)}
                  defaultValue={(modalText.current as IUser).publicKey}
                  isValid={copied}
                />
                <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  <h5>Balance:</h5>
                </Form.Label>
                <p>{(modalText.current as IUser).balance.toFixed(2)} LC</p>
              </Form.Group>
            </div>
          ) : (
            <div>
              <Form.Group>
                <Form.Label>
                  <h5>From:</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="text-truncate"
                  defaultValue={(modalText.current as ITransaction).fromKey}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  <h5>To:</h5>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="text-truncate"
                  defaultValue={(modalText.current as ITransaction).toKey}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  <h5>Amount:</h5>
                </Form.Label>
                <Form.Control
                  type="number"
                  className="text-truncate"
                  defaultValue={(modalText.current as ITransaction).amount}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  <h5>Signature:</h5>
                </Form.Label>
                <Form.Control
                  type="number"
                  className="text-truncate"
                  defaultValue={(modalText.current as ITransaction).signature}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

// for testing
// users = [
//   { publicKey: "a", balance: 0 },
//   { publicKey: "b", balance: 1 },
//   { publicKey: "c", balance: 2 },
//   { publicKey: "d", balance: 3 },
//   { publicKey: "e", balance: 4 },
//   { publicKey: "f", balance: 5 },
//   { publicKey: "g", balance: 6 },
//   { publicKey: "h", balance: 7 },
//   { publicKey: "i", balance: 8 },
//   { publicKey: "j", balance: 9 },
//   { publicKey: "k", balance: 10 },
//   { publicKey: "l", balance: 11 },
//   { publicKey: "m", balance: 12 },
//   { publicKey: "n", balance: 13 },
//   { publicKey: "o", balance: 14 },
// ];
