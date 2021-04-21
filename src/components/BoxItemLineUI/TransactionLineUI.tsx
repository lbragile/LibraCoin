import React, { useRef } from "react";
import { Form, Modal } from "react-bootstrap";

import "./BoxItemLineUI.css";

interface ITransaction {
  to: string;
  from: string;
  amount: number;
  message: string;
  signature?: string;
  index?: number;
}

interface ITransactionLineProps {
  details: ITransaction[];
  title: string;
  show: boolean;
  setShow: (arg: boolean) => void;
  showUserDetails: (boxDetail: ITransaction, index: number, modalText: React.MutableRefObject<ITransaction>) => void;
}

export default function BoxItemLineUI({
  details,
  title,
  show,
  setShow,
  showUserDetails,
}: ITransactionLineProps): JSX.Element {
  const modalText = useRef<ITransaction>({ index: 0, to: "", from: "", amount: 0, message: "", signature: "" });

  return (
    <div>
      <div>
        <h3>
          <b>{title}:</b>
        </h3>
        <div id="user-list-background">
          {details?.map((boxDetail: ITransaction, i: number) => {
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
                <h5>From:</h5>
              </Form.Label>
              <Form.Control type="text" className="text-truncate" defaultValue={modalText.current.from} />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <h5>To:</h5>
              </Form.Label>
              <Form.Control type="text" className="text-truncate" defaultValue={modalText.current.to} />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <h5>Message:</h5>
              </Form.Label>
              <Form.Control as="textarea" className="text-truncate" defaultValue={modalText.current.message} />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <h5>Amount:</h5>
              </Form.Label>
              <Form.Control type="number" className="text-truncate" defaultValue={modalText.current.amount} />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <h5>Signature:</h5>
              </Form.Label>
              <Form.Control type="text" className="text-truncate" defaultValue={modalText.current.signature} />
            </Form.Group>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
