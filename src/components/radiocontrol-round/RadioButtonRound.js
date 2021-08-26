import { useEffect, useState } from "react";
import './radiobuttonround.css';
import { click } from "../../functions/click";
import { isGazeWithinElement } from '../../functions/isGazeWithinElement';
import { convertAngleToPx } from "../../functions/convertAngleToPx";

const RadioButton = (props) => {

  const [selectionCircleClass, setSelectionCircleClass] = useState(props.selected === props.value ? "radio-round-fill" : "radio-round-fill unselected-circle");
  const [outlineCircleClass, setOutlineCircleClass] = useState("radio-outline");
  const MINTARGETSIZE = convertAngleToPx(4.17);
  const [lastGazeDetected, setLastGazeDetected] = useState(0);
  const [isInspected, setIsInspected] = useState(false);
  const INSPECTIONTIME = 1000;

  const [eventListener, setEventListener] = useState(false);


  // eslint-disable-next-line
  useEffect(() => {
    if (props.isInspectionArea) {
      handleInspectionArea();
    } else {
      handleInteractionArea();
    }
    // This line makes the selected element disappear, but it throws an error when switching to slider element 
    //   return () => {
    //     if(document.getElementById(props.idSelectionCircle) !== null) {
    //     document.getElementById(props.idSelectionCircle).removeEventListener("transitionend", onTransitionEnd);
    //   }
    // }

  });

  // Handle adaptation of inspectiona area when input in interaction area has changed the selected value
  const handleInspectionArea = () => {
    if (props.selected === props.value) {
      setSelectionCircleClass("radio-round-fill");
    } else {
      setSelectionCircleClass("radio-round-fill unselected-circle");
    }
  }

  // Handle inspection and selection interaction within the area that is defined to be the interaction area
  const handleInteractionArea = () => {

    if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {

      handleInspection();
      handleSelection();

      // Remove all visual feedback when gaze is not detected within radio button and button is currently not selecgted
    } else {
      setOutlineCircleClass("radio-outline");
      setIsInspected(false);

      if (props.selected !== props.value) {
        setSelectionCircleClass("radio-round-fill unselected-circle transitioning");
      }

    }
  }


  // Provide visual feedback during inspection of interaction elements
  const handleInspection = () => {
    setOutlineCircleClass("radio-outline radio-outline-inspected transitioning");
    // Handle case of radio button being already inspected currently
    if (!isInspected) {
      setIsInspected(true);
      setLastGazeDetected(new Date().getTime());
    }
  }

  // Provide visual feedback when selection process had been triggered
  const handleSelection = () => {
    if (props.selected !== props.value) {
      if (!eventListener) {
        document.getElementById(props.idSelectionCircle).addEventListener("transitionend", onTransitionEnd, false);
        setEventListener(true);
      }
      let currentTime = new Date().getTime();
      if (isInspected && currentTime >= lastGazeDetected + INSPECTIONTIME) {
        setSelectionCircleClass("radio-round-fill transitioning");
        setLastGazeDetected(currentTime);
      }
    } else {
      if (props.value === props.selected) {
        setSelectionCircleClass("radio-round-fill");


      }

    }
  }

  const calculateRadioSize = () => {
    if (props.isInspectionArea) {
      let screenWidth = window.innerWidth * 0.6;
      let spacePerRadio = screenWidth / 7;
      let radioWithoutMargin = spacePerRadio * 0.7
      return radioWithoutMargin;
    } else {
      let screenWidth = window.innerWidth;
      let spacePerRadio = screenWidth / 7;
      let radioWithoutMargin = spacePerRadio * 0.9
      return radioWithoutMargin;
    }

  }


  // Handle fixation on scroll button
  const onTransitionEnd = (event) => {
    if (document.getElementById(props.idSelectionCircle).offsetHeight !== 0 && (event.propertyName === "height" || event.propertyName === "width")) {
      props.onFixation(props.value);

    }
    document.getElementById(props.idSelectionCircle).removeEventListener("transitionend", onTransitionEnd);
    setEventListener(false);
    console.log("REMOVED EVENTLISTENER");

  }

  return (
    <div className="radio-round-container">
      {props.isInspectionArea ? (<p className="radio-button-round-label"> {props.label} </p>) : null}

      <div style={{
        minWidth: props.isInspectionArea ? 0 : MINTARGETSIZE,
        minHeight: props.isInspectionArea ? 0 : MINTARGETSIZE,
        width: "100%",
        height: "100%"
      }} id={props.idTarget} className="total-target-area-round-radio">
        <div style={{
          minWidth: props.isInspectionArea ? 0 : MINTARGETSIZE,
          minHeight: props.isInspectionArea ? 0 : MINTARGETSIZE,
          width: calculateRadioSize(),
          height: calculateRadioSize()
        }} id={props.idOutlineCircle} className={outlineCircleClass}>
                <div id={props.idSelectionCircle} className={selectionCircleClass} />
        </div>
      </div>
    </div>
  );
}

export default RadioButton;