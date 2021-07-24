import { useEffect, useState } from "react";
import './radiobutton.css';
// import { click } from "../functions/click";
import { isGazeWithinElement } from '../../functions/isGazeWithinElement';
import { convertAngleToPx } from "../../functions/convertAngleToPx";

const RadioButton = (props) => {

  const [radioFillClass, setRadioFillClass] = useState(props.selected === props.value ? "radio-fill" : "radio-fill unselected");

  const MINTARGETSIZE = convertAngleToPx(4.17);

  const [eventListener, setEventListener] = useState(false);


  // eslint-disable-next-line
  useEffect(() => {

    // If this radio button is currently not selected
    if (props.selected !== props.value) {
      if(!eventListener)
    {
      document.getElementById(props.idFill).addEventListener("transitionend", onTransitionEnd, false);
      setEventListener(true);
    }

      if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {
        setRadioFillClass("radio-fill transitioning");
        document.getElementById(props.idFill).style.backgroundColor = props.color;
      } else {
        setRadioFillClass("radio-fill unselected transitioning");
        document.getElementById(props.idFill).style.backgroundColor = props.color;
      }
    } else if (props.selected === props.value && radioFillClass) {
      setRadioFillClass("radio-fill");
      document.getElementById(props.idFill).style.backgroundColor = props.color;
    }

  //   // This line makes the selected element disappear, but it throws an error when switching to slider element 
  //   return () => {

  //     if(document.getElementById(props.idFill) !== null) {
  //     console.log(document.getElementById(props.idFill))
  //     document.getElementById(props.idFill).removeEventListener("transitionend", onTransitionEnd);
  //   }
  // }

  });

  // Handle fixation on scroll button
  const onTransitionEnd = (event) => {
    // console.log(Math.round(MINTARGETSIZE * 0.9 *0.8));
    if (document.getElementById(props.idFill).offsetHeight > 0 && event.propertyName === "height") {
        props.onFixation(props.value);
        // click(props.idFill);

    }
    document.getElementById(props.idFill).removeEventListener("transitionend", onTransitionEnd);
    setEventListener(false);
  }

  return (
    <div className="radio-container">
      <p className="radio-button-label"> {props.label} </p>

      <div style={{
        minWidth: MINTARGETSIZE
        , minHeight: MINTARGETSIZE
      }} id={props.idTarget} className="total-target-area-radio">
          <div id={props.idFill} className={radioFillClass} >
            <p style={{ margin: "0", textAlign: "center", fontSize: "32px", color: "white", fontWeight: 800 }}>{props.icon}</p>
        </div>
      </div>
    </div>
  );
}

export default RadioButton;