import { useEffect, useState } from "react";
import './radiobuttonrect.css';
import { isGazeWithinElement } from '../../functions/isGazeWithinElement';
import { convertAngleToPx } from "../../functions/convertAngleToPx";


const RadioButton = (props) => {

  const [radioFillClass, setRadioFillClass] = useState(props.selected === props.value ? "radio-rect-fill" : "radio-rect-fill unselected-rect");
  const [totalTargetClass, setTotalTargetClass] = useState("total-target-area-radio-rect");
  const [labelClass, setLabelClass] = useState("radio-button-rect-label");
  const [lastGazeDetected, setLastGazeDetected] = useState(0);
  const [isInspected, setIsInspected] = useState(false);
  const INSPECTIONTIME = 400;
  const MINTARGETSIZE = convertAngleToPx(4.17);

  const [eventListener, setEventListener] = useState(false);


  // eslint-disable-next-line
  useEffect(() => {

    if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {
      
      handleInspection();
      handleSelection(); 

        // Remove all visual feedback when gaze is not detected within radio button and button is currently not selecgted
       } else {
        setTotalTargetClass("total-target-area-radio-rect");
        setLabelClass("radio-button-rect-label");
        setIsInspected(false);

        if (props.selected !== props.value) {
          setRadioFillClass("radio-rect-fill unselected-rect transitioning");
        }

      }

  });

  // Provide visual feedback during inspection of interaction elements
  const handleInspection = () => {
    setTotalTargetClass("total-target-area-radio-rect total-target-inspected transitioning");
    setLabelClass("radio-button-rect-label label-rect-inspected transitioning");
    // Handle case of radio button being already inspected currently
    if (!isInspected) {
      setIsInspected(true);
      setLastGazeDetected(new Date().getTime());
  }
}

// Provide visual feedback when selection process had been triggered
const handleSelection= () => {
  if (props.selected !== props.value) {
    if (!eventListener) {
      document.getElementById(props.idFill).addEventListener("transitionend", onTransitionEnd, false);
      setEventListener(true);
    }
      let currentTime = new Date().getTime();
      if (isInspected && currentTime >= lastGazeDetected + INSPECTIONTIME) {
        setRadioFillClass("radio-rect-fill transitioning");
        setLastGazeDetected(currentTime);
      }
    }  else {
      if (props.value === props.selected) {
      setRadioFillClass("radio-rect-fill");

        
      }
      
    }
}


  // Handle fixation on scroll button
  const onTransitionEnd = (event) => {
    if (document.getElementById(props.idFill).offsetHeight > 0) {
      console.log("TRIGGER")
      props.onFixation(props.value);

    }
    document.getElementById(props.idFill).removeEventListener("transitionend", onTransitionEnd);
    setEventListener(false);
  }

  return (
    <div className="radio-rect-container">


      <div style={{
        minWidth: MINTARGETSIZE
        , minHeight: MINTARGETSIZE
      }} id={props.idTarget} className={totalTargetClass}>
        <p id={props.idLabel} className={labelClass}> {props.label} </p>

        <div id={props.idFill} className={radioFillClass} >
          {/* <p style={{ margin: "0", textAlign: "center", fontSize: "32px", color: "white", fontWeight: 800 }}>{props.icon}</p> */}
        </div>
      </div>
    </div>
  );
}

export default RadioButton;