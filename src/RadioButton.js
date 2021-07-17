import { useEffect, useState } from "react";
import './css/radiobutton.css';
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';
import { convertAngleToPx } from "./functions/convertAngleToPx";

const RadioButton = (props) => {

  const [selectionCircleClass, setSelectionCircleClass] = useState(props.selected === props.value ? "radio-inner-circle" : "radio-inner-circle unselected-circle");

  const MINTARGETSIZE = convertAngleToPx(4.17);

  // eslint-disable-next-line
  useEffect(() => {
    document.getElementById(props.idSelectionCircle).addEventListener("transitionend", onTransitionEnd, false);
    // If this radio button is currently not selected
    if (props.selected !== props.value) {
      if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {
        setSelectionCircleClass("radio-inner-circle transitioning");
        document.getElementById(props.idSelectionCircle).style.backgroundColor = props.color;
        document.getElementById(props.idOutlineCircle).style.borderColor = props.color;
      } else {
        setSelectionCircleClass("radio-inner-circle unselected-circle transitioning");
        document.getElementById(props.idSelectionCircle).style.backgroundColor = props.color;
        document.getElementById(props.idOutlineCircle).style.borderColor = props.color;
      }
    } else if (props.selected === props.value && selectionCircleClass) {
      setSelectionCircleClass("radio-inner-circle");
      document.getElementById(props.idSelectionCircle).style.backgroundColor = props.color;
      document.getElementById(props.idOutlineCircle).style.borderColor = props.color;
    }

    return () => {
      document.getElementById(props.idSelectionCircle).removeEventListener("transitionend", onTransitionEnd);
    }

  });

  // Handle fixation on scroll button
  const onTransitionEnd = () => {
    if (document.getElementById(props.idSelectionCircle).offsetHeight !== 0) {
      props.onFixation(props.value);
      click(props.idSelectionCircle);
    }

  }

  return (
    <div className="radio-container">
      <p className="radio-button-label"> {props.label} </p>

      <div style={{
        minWidth: MINTARGETSIZE
        , minHeight: MINTARGETSIZE, 
        width: MINTARGETSIZE,
        height: MINTARGETSIZE
      }} id={props.idTarget} className="total-target-area-radio">
        <div id={props.idOutlineCircle} className={`radio-outer-circle`}>
          <div id={props.idSelectionCircle} className={selectionCircleClass} >
            <p style={{ margin: "0", textAlign: "center", fontSize: "40px", color: "white", fontWeight: 800 }}>{props.icon}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RadioButton;