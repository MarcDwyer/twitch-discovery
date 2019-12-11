import React from "react";
import { createPortal } from "react-dom";

import "./modal.scss";

type Props = {
  children: JSX.Element;
  shouldOpen: boolean;
  close(p: boolean): void;
};

const Modal = (props: Props) => {
  return (
    <React.Fragment>
      {props.shouldOpen && (
        <div
          className="modal"
          onClick={e => {
            //@ts-ignore
            if (e.target.classList.value !== "modal") return;
            props.close(false);
          }}
        ></div>
      )}
      {createPortal(
        props.children,
        //@ts-ignore
        document.querySelector("#root")
      )}
    </React.Fragment>
  );
};

export default Modal;
