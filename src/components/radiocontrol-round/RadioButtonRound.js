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

      if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {
        
        handleInspection();
        handleSelection(); 
  
          // Remove all visual feedback when gaze is not detected within radio button and button is currently not selecgted
         } else {
          setOutlineCircleClass("radio-outline");
          setIsInspected(false);
  
          if (props.selected !== props.value) {
            setSelectionCircleClass("radio-fill-round unselected-circle transitioning");
          }
  
        }
        // This line makes the selected element disappear, but it throws an error when switching to slider element 
  //   return () => {
  //     if(document.getElementById(props.idSelectionCircle) !== null) {
  //     document.getElementById(props.idSelectionCircle).removeEventListener("transitionend", onTransitionEnd);
  //   }
  // }
  
    });


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
const handleSelection= () => {
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
    }  else {
      if (props.value === props.selected) {
      setSelectionCircleClass("radio-round-fill");

        
      }
      
    }
}

const calculateRadioSize = () => {
  let screenWidth = window.innerWidth;
  let spacePerRadio = screenWidth/7;
  let radioWithoutMargin = spacePerRadio * 0.9
  return radioWithoutMargin;
}


  // Handle fixation on scroll button
  const onTransitionEnd = (event) => {
    // console.log(document.getElementById(props.idSelectionCircle).offsetHeight);
    // console.log(Math.round(MINTARGETSIZE * 0.9 *0.8));
    console.log(props.idSelectionCircle);
    if (document.getElementById(props.idSelectionCircle).offsetHeight !== 0 && (event.propertyName === "height" || event.propertyName === "width")) {
        props.onFixation(props.value);
        click(props.idSelectionCircle);

    }
    document.getElementById(props.idSelectionCircle).removeEventListener("transitionend", onTransitionEnd);
    setEventListener(false);
    console.log("REMOVED EVENTLISTENER");

  }

  return (
    <div className="radio-round-container">
      {props.isSelectionArea ? (<p className="radio-button-round-label"> {props.label} </p>) : null}

      <div style={{
        minWidth: MINTARGETSIZE
        , minHeight: MINTARGETSIZE, 
        width: "100%",
        height: "100%"
      }} id={props.idTarget} className="total-target-area-round-radio">
        <div style={{
          minWidth: MINTARGETSIZE,
          minHeight: MINTARGETSIZE, 
          width: calculateRadioSize(),
        height: calculateRadioSize()
      }}id={props.idOutlineCircle} className={outlineCircleClass}>
          <div id={props.idSelectionCircle} className={selectionCircleClass} >
          </div>
        </div>
      </div>
    </div>
  );
}

export default RadioButton;