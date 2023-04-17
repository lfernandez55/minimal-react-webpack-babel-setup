import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const OrgFormModals = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = (e) => {
    e.preventDefault();
    console.log("In handleOpenModal")
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div>Begin....</div>
      <button onClick={handleOpenModal}>Open Modal</button>
      <Modal isOpen={isOpen} onRequestClose={handleCloseModal}>
        <h2>Example Modal</h2>
        <p>This is an example modal using react-modal!</p>
        <button onClick={handleCloseModal}>Close Modal</button>
      </Modal>
      <div>...End</div>
    </div>
  );
};

export default OrgFormModals;