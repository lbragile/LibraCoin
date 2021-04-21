import React, { useRef } from "react";
import { Form, Modal } from "react-bootstrap";

import "./BoxItemLineUI.css";

interface IUser {
  publicKey: string;
  balance: number;
  index?: number;
}

interface IUserLineProps {
  details: IUser[];
  title: string;
  show: boolean;
  setShow: (arg: boolean) => void;
  copied: boolean;
  showUserDetails: (boxDetail: IUser, index: number, modalText: React.MutableRefObject<IUser>) => void;
  copyPublicKey: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function UserLineUI({
  details,
  title,
  show,
  setShow,
  copied,
  showUserDetails,
  copyPublicKey,
}: IUserLineProps): JSX.Element {
  const modalText = useRef<IUser>({ index: 0, publicKey: "", balance: 0 });

  return (
    <div>
      <div>
        <h3>
          <b>{title}:</b>
        </h3>
        <div id="user-list-background">
          {details?.map((boxDetail: IUser, i: number) => {
            return (
              <div
                className="user-item ml-3 col-1"
                onClick={() => showUserDetails(boxDetail, i, modalText)}
                key={Math.random()}
              >
                <p className="user-item-index-text">
                  <b>{i}</b>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <Modal show={show} centered onHide={() => setShow(false)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {title} #{modalText.current.index} Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
    </div>
  );
}
