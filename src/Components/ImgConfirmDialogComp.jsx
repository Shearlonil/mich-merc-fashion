// ConfirmModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import ImageComponent from "./ImageComponent";

const ImgConfirmDialogComp = ({
  show,
  handleClose,
  handleConfirm,
  message,
  img,
  onlineFetch,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
        {onlineFetch && (
          <ImageComponent image={img} width={"100%"} height={"100%"} />
        )}
        {!onlineFetch && (
          <img className="prev_img" height={"100%"} src={img} width={"100%"} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImgConfirmDialogComp;
