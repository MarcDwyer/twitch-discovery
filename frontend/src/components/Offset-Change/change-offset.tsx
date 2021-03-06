import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { animated, useSpring } from "react-spring";

import "./change-offset.scss";

type Props = {
  showOffset: boolean;
  setShowOffset(param: boolean): void;
};

const URL = () =>
  document.location.hostname.startsWith("localhost")
    ? "http://localhost:5010"
    : `https://${document.location.hostname}`;
//TODO
// Make a modal component
// re-use it
const ChangeOffset = React.memo((props: Props) => {
  const [secret, setSecret] = useState<string>("");
  const [offset, setOffset] = useState<string>("");

  const offsetAnim = useSpring({
    opacity: 1,
    transform: "translateX(0)",
    from: { opacity: 0, transform: "translateX(100%)" },
    reverse: !props.showOffset
  });

  return createPortal(
    <animated.div className="offset" style={offsetAnim}>
      <form
        className="inner-offset"
        onSubmit={async e => {
          e.preventDefault();

          const sendThis = await fetch(`${URL()}/set-offset/${offset}`, {});
        }}
      >
        <input
          type="number"
          value={offset}
          placeholder="It gives a number..."
          onChange={e => setOffset(e.target.value)}
        />
        <input
          type="password"
          value={secret}
          placeholder="It gives a riddle..."
          onChange={e => setSecret(e.target.value)}
        />
        <button type="submit">Try</button>
      </form>
      <button className="go-back" onClick={() => props.setShowOffset(false)}>
        Go back
      </button>
    </animated.div>,
    //@ts-ignore
    document.querySelector("#root")
  );
});

export default ChangeOffset;
