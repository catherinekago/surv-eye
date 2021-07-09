import { useEffect, useState } from "react";
import './css/radiobutton.css';
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';

const RadioButton = ( props ) => {

  const [selectionCircleClass, setSelectionCircleClass] = useState(props.selected === props.value ? "radio-inner-circle" : "radio-inner-circle unselected-circle");

  useEffect(() => {
    document.getElementById(props.idSelectionCircle).addEventListener("transitionend", onTransitionEnd, false);
    // If this radio button is currently not selected
      if (props.selected !== props.value) {
        if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {
          setSelectionCircleClass("radio-inner-circle transitioning");
      } else {

          setSelectionCircleClass("radio-inner-circle unselected-circle transitioning");
      }
    } else if (props.selected === props.value && selectionCircleClass) {
      setSelectionCircleClass("radio-inner-circle");
    }

    return () => {
      document.getElementById(props.idSelectionCircle).removeEventListener("transitionend", onTransitionEnd);
    }

});

  // Handle fixation on scroll button
    const onTransitionEnd = () => {
          if (document.getElementById(props.idSelectionCircle).offsetHeight !== 0){
            props.onFixation(props.value);
            click(props.idSelectionCircle);
        }

  }

  return (
    <div className="radio-container">
      <p className="radio-button-label"> {props.label} </p>

      <div id ={props.idTarget} className="total-target-area-radio">
      <div className={`radio-outer-circle`}>
        <div id={props.idSelectionCircle} className={selectionCircleClass} />
      </div>
      </div>
    </div>
  );
}

export default RadioButton; 