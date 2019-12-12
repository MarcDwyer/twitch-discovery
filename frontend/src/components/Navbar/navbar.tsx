import React, { useState } from "react";
import { FaMoon, FaHamburger } from "react-icons/fa";
import { useSelector, shallowEqual } from "react-redux";

import Modal from "../Modal/modal";
import CreateOffset from "../Offset-Change/change-offset";
import Timer from "../Timer/timer";
import Diagnostic from "../Diagnostic/diag";

import { ReduxStore } from "../../reducers/reducer";

import "./navbar.scss";

const Navbar = React.memo(() => {
  const view = useSelector((state: ReduxStore) =>
    state.streamData.view
    , shallowEqual);
  const [showOffset, setShowOffset] = useState<boolean>(false);
  const [showDiag, setShowDiag] = useState<boolean>(false);
  console.log("navbar ran")
  return (
    <div
      className="navbar"
      style={
        view ? { backgroundColor: "black" } : { backgroundColor: "#262626" }
      }
    >
      <FaHamburger
        className="show-diag"
        onClick={() => setShowDiag(!showDiag)}
      />
      <Modal
        children={<Diagnostic showDiag={showDiag} setShowDiag={setShowDiag} />}
        shouldOpen={showDiag}
        close={setShowDiag}
      />
      <div className="timer-or-viewing">
        {view ? <span>Currently viewing {view.channel.name}</span> : <Timer />}
      </div>
      <FaMoon
        className="offset-trigger buttons"
        onClick={() => setShowOffset(!showOffset)}
      />
      <Modal
        children={
          <CreateOffset showOffset={showOffset} setShowOffset={setShowOffset} />
        }
        shouldOpen={showOffset}
        close={setShowOffset}
      />
    </div>
  );
});

export default Navbar;
