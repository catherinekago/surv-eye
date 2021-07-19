import { useEffect, useState } from "react";
import '../css/switchbutton.css';
import { click } from "../functions/click";
import { isGazeWithinElement } from '../functions/isGazeWithinElement';
import { convertAngleToPx } from "../functions/convertAngleToPx";

const RadioButton = (props) => {

  const [selectionFillClass, setSelectionFillClass] = useState(props.selected === props.value ? "button-inner-fill" : "button-inner-fill unselected-button");
  const [eventListener, setEventListener] = useState(false);


  const MINTARGETSIZE = convertAngleToPx(4.17);

  // eslint-disable-next-line
  useEffect(() => {


    // If this radio button is currently not selected
    if (props.selected !== props.value) {
      if (!eventListener) {
        document.getElementById(props.idFill).addEventListener("transitionend", onTransitionEnd, false);
        setEventListener(true);
      }
      if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {
        setSelectionFillClass("button-inner-fill transitioning");
        document.getElementById(props.idFill).style.backgroundColor = props.color;
      } else {
        setSelectionFillClass("button-inner-fill unselected-button transitioning");
        document.getElementById(props.idFill).style.backgroundColor = props.color;
      }
    } else if (props.selected === props.value && selectionFillClass) {
      setSelectionFillClass("button-inner-fill");
      document.getElementById(props.idFill).style.backgroundColor = props.color;
    }

    // This line makes the selected element disappear, but it throws an error when switching to slider element 
    return () => {
      if (document.getElementById(props.idFill) !== null) {
        document.getElementById(props.idFill).removeEventListener("transitionend", onTransitionEnd);
        setEventListener(false);
      }
    }

  },[props.context]);

  // Handle fixation on scroll button
  const onTransitionEnd = () => {
    if (document.getElementById(props.idFill).offsetHeight >0) {
      props.onFixation(props.value);
      click(props.idFill);
    }

  }

  return (
    <div className="switch-container">
      <p className="switch-button-label"> {props.label} </p>

      <div style={{
        minWidth: MINTARGETSIZE * 1.25,
        minHeight: MINTARGETSIZE,
        width: MINTARGETSIZE * 1.25,
        height: MINTARGETSIZE
      }} id={props.idTarget} className="total-target-area-switch">
        <div style={{backgroundColor: props.color}} id={props.idFill} className={selectionFillClass} >
          <img className="button-icon" src={props.icon} alt="Nav Icon" />
        </div>
      </div>
    </div>
  );
}

export default RadioButton;