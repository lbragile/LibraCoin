import React, { useState, useRef } from "react";
import { Form, Modal } from "react-bootstrap";

import "./User.css";

interface IUser {
  publicKey: string;
  balance: number;
  index?: number;
}

export default function UserUI({ users }: { users: IUser[] }): JSX.Element {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalText = useRef<IUser>({ index: 0, publicKey: "", balance: 0 });

  function showUserDetails(user: IUser, index: number): void {
    modalText.current = { ...user, index };
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
          <b>Users:</b>
        </h3>
        <div id="user-list-background">
          {users.map((user, i) => {
            return (
              <div className="user-item ml-3 col-1" onClick={() => showUserDetails(user, i)} key={Math.random()}>
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
          <Modal.Title>User {modalText.current.index} Details</Modal.Title>{" "}
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>Public Key:</h5>
            <Form.Control
              type="text"
              className="text-truncate"
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => copyPublicKey(e)}
              value={modalText.current.publicKey}
              isValid={copied}
            />
            <Form.Control.Feedback type="valid">Copied to clipboard</Form.Control.Feedback>
          </div>

          <div className="mt-4">
            <h5>Balance:</h5>
            {modalText.current.balance.toFixed(2)} LC
          </div>
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
