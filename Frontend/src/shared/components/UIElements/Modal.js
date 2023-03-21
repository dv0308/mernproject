import React from "react";
import "./Modal.css";
import { createPortal } from "react-dom";
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";

const ModalOverlay = (props) => {
  const content = (
    <div className="modal">
      <header className="modal_header">
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className="modal_content">{props.children}</div>
        <footer className="modal_footer">{props.footer}</footer>
      </form>
    </div>
  );
  return createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
