import React, { useState } from "react";
import { FaMoon, FaHamburger } from "react-icons/fa";
import { useSelector, shallowEqual } from "react-redux";

import Modal from "../Modal/modal";
import Timer from "../Timer/timer";
import Diagnostic from "../Diagnostic/diag";

import { ReduxStore } from "../../reducers/reducer";

import { useTimer } from "../../hooks";

import "./navbar.scss";

const Navbar = React.memo(() => {
  const [view, nextRefresh] = useSelector(
    (state: ReduxStore) => [
      state.streamData.view,
      state.streamData.nextRefresh
    ],
    shallowEqual
  );
  const [showOffset, setShowOffset] = useState<boolean>(false);
  const [showDiag, setShowDiag] = useState<boolean>(false);

  const timer = useTimer(nextRefresh);
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
        children={
          <Diagnostic
            timer={timer}
            showDiag={showDiag}
            setShowDiag={setShowDiag}
          />
        }
        shouldOpen={showDiag}
        close={setShowDiag}
      />
      <div className="timer-or-viewing">
        {!view && timer && (
          <Timer headline="Next update in:" minutes={timer.minutes} seconds={timer.seconds} />
        )}
        {view && <span>Currently viewing {view.channel.name}</span>}
      </div>
      <FaMoon
        className="offset-trigger buttons"
        onClick={() => setShowOffset(!showOffset)}
      />
      {/* <Modal
        children={
          <CreateOffset showOffset={showOffset} setShowOffset={setShowOffset} />
        }
        shouldOpen={showOffset}
        close={setShowOffset}
      /> */}
    </div>
  );
});

export default Navbar;
