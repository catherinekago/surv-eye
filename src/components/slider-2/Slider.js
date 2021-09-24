import { isGazeWithinElement } from '../../functions/isGazeWithinElement';
import { useState, useEffect, useRef } from 'react';
import ArrowLeft from '../../assets/arrow-left.svg';
import ArrowRight from '../../assets/arrow-right.svg';
import "./slider.css";

// How to make a questionnaire item for this slider: 
// Without numeric scale
// { number: 0, type: "slider2", statement: "How much of an overthinker are you?", min: "low", max: "high", measure:"", input: null },
// With numeric scale
// { number: 1, type: "slider2", statement: "How much of an overthinker are you?", min: 0, max: 100, measure:"%", input: null },

// Where does it have to be added? --> Questionnaire, QuestionnaireItem

const Slider = (props) => {
    const [sliderID, setSliderID] = useState(null);
    const [isReset, setIsReset] = useState(false);
    const [lastGazeMoveRight, setLastGazeMoveRight] = useState(0);
    const [isRightInpected, setIsRightInspected] = useState(false);
    const [rightArrowIndicatorClass, setRightArrowIndicatorClass] = useState("arrow-no-fill")
    const [lastGazeMoveLeft, setLastGazeMoveLeft] = useState(0);
    const [movement, setMovement] = useState(null); // right and left set in handleGazeWithinDirectionButtons
    const [isLeftInspected, setIsLeftInspected] = useState(true);
    const [leftArrowIndicatorClass, setLeftArrowIndicatorClass] = useState("arrow-no-fill arrow-left")
    const [isKnobLocking, setIsKnobLocking] = useState(false);

    const [isLockingOn, setIsLockingOn] = useState(null);
    const isLockingOnRef = useRef(isLockingOn);
    isLockingOnRef.current = isLockingOn;

    const [isKnobLocked, setIsKnobLocked] = useState(false);
    const INSPECTIONTIME = 500;
    const [stopAreaSelectionClass, setStopAreaSelectionClass] = useState("stop-area-no-fill");

    const [eventListener, setEventListener] = useState(false);

    const [lastGazeSelection, setLastGazeSelection] = useState(0);
    const [lastTransitionStart, setLastTransitionStart] = useState(0);
    const [isKnobInspected, setIsKnobInspected] = useState(false);


    useEffect(() => {
        if (props.id !== sliderID) {

            if (!isReset) {
                setIsReset(true);
                    translateElementToPosition("KNOB-SLIDER2", document.getElementById("SCALE-SLIDER2").offsetWidth / 2);
            
            } else {
                setSliderID(props.id);
                setIsReset(false);
            }
        }

        // Determine if direction has been triggered / is going on
        handleGazeWithinDirectionButtons();
        // Determine if selection has been triggered / is going on
        handleGazeWithinStopArea();
    });

    // Handle interaction with direction buttons: set triggered direction
    const handleGazeWithinDirectionButtons = () => {
        // setMovement("right") and setMovement("left") and setMovement(null) as outcome
    }

    // Handle interaction with stop area: trigger selection of a value
    const handleGazeWithinStopArea = () => {
        if (!eventListener) {
            document.getElementById("STOP-GAZE-INDICATOR").addEventListener("transitionend", onTransitionEnd, false);
            setEventListener(true);
          }

        if (document.getElementById("STOP-COMPONENT") !== null && isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y)) {
            if (!isKnobLocking && document.getElementById("STOP-MARKER-CONTAINER") !== null && document.getElementById("KNOB-SLIDER2") !== null) {
                let currentValue = calculateCurrentValue();
                setIsLockingOn(currentValue);
                let currentKnobCenter = document.getElementById("KNOB-SLIDER2").getBoundingClientRect().left - document.getElementById("KNOB-SLIDER2").offsetWidth/2 + 2; 
                translateElementToPosition("STOP-MARKER-CONTAINER", currentKnobCenter);
                setIsKnobLocking(true);
                setStopAreaSelectionClass("stop-transitioning stop-area-fill")
                // Change class of gaze indicator 
            }
        } else if (document.getElementById("STOP-COMPONENT") !== null && !isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y)) {
            if (props.value !== isLockingOn) {
                setStopAreaSelectionClass("stop-transitioning stop-area-no-fill");
                setIsKnobLocking(false);
                setIsLockingOn(null);
            } else if (props.value === calculateCurrentValue()) {
                setStopAreaSelectionClass("stop-area-fill")
            }

        }

        // setIsKnobLocking(true) if gaze detected for first time, translate marker ONCE
        // > {(true) if selection was successful 
        // props.setItemValue() if selection was successful
    }

    const onTransitionEnd = (event) => {
        if (document.getElementById("STOP-GAZE-INDICATOR").offsetHeight !== 0 && (event.propertyName === "height")) {
          console.log("selected!")
          props.setItemValue(isLockingOnRef.current);
          console.log(isLockingOnRef.current);
          setIsKnobLocking(false);
          setIsLockingOn(null);
          translateElementToPosition("KNOB-SLIDER2", document.getElementById("SCALE-SLIDER2").offsetWidth / 2);
          setTimeout(() => setIsKnobLocked(true) , 400);

        }
        document.getElementById("STOP-GAZE-INDICATOR").removeEventListener("transitionend", onTransitionEnd);
        setEventListener(false);
        console.log("REMOVED EVENTLISTENER");
    
      }

    // Move element to a defined horizontal posiiton
    const translateElementToPosition = (element, targetPosition) => {
        let elementPosition = document.getElementById(element).getBoundingClientRect().left;
        let elementWidth = + document.getElementById(element).offsetWidth;
        let zero = elementPosition - elementWidth / 2 + 0.05 * window.innerWidth;
        document.getElementById(element).style.transform = "translate(" + (-1 * zero) + "px)"
        document.getElementById(element).style.transform = "translate(" + (targetPosition) + "px)"
    }

    // Calculate current value according to scale dimensions and knob position
    const calculateCurrentValue = () => {
        if (props.value === null) {
            return props.measure === "" ? 50 : props.max / 2;
        } else if (document.getElementById("SCALE-SLIDER2") !== null) {
            let SCALE_WIDTH = document.getElementById("SCALE-SLIDER2").offsetWidth;
            let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;

            let positionOnScale = document.getElementById("KNOB-SLIDER2").getBoundingClientRect().left + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05;
            let value = Math.round((positionOnScale) / SCALE_UNIT);
            return value;
        }
    }

    const translateKnob = () => {
        return 0;
    }

    // const translateMarker = (value) => {
    //     let MARKER_POS = document.getElementById("").getBoundingClientRect().left;
    //     let KNOB_WIDTH = + document.getElementById("KNOB-SLIDER2").offsetWidth;
    //     let MIDDLE = document.getElementById("SCALE-SLIDER2").offsetWidth / 2;
    //     let zero = KNOB_POS - KNOB_WIDTH / 2 + 0.05 * window.innerWidth
    //     document.getElementById("KNOB-SLIDER2").style.transform = "translate(" + (-1 * zero) + "px)"
    //     document.getElementById("KNOB-SLIDER2").style.transform = "translate(" + (MIDDLE) + "px)"
    // }

    const determineMarkerVisibility = () => {
        // only show marker during selection process, remove if gaze is removed from stop area or selection has been completed
        if (document.getElementById("STOP-COMPONENT") !== null && isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y) && !isKnobLocked) {
            return("block");
        } else {
            return("none");
        }
    }


    return (
        <div id="SLIDER2-COMPONENT">

            <div id="MOVE-BUTTON-AREA">
                <div id="MOVE-BUTTON-LEFT" style={{ width: document.getElementById("KNOB-SLIDER2") !== null ? (document.getElementById("KNOB-SLIDER2").getBoundingClientRect().left + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05) + "px" : "0px" }}>
                    <div id="ARROW-LEFT-CONTAINER" className="arrow-container">
                        <div id="ARROW-LEFT-INDICATOR" className={leftArrowIndicatorClass}></div>
                        <img id="ARROW-LEFT" className="arrow-img" src={ArrowLeft} alt="Slider Arrow Left" />
                    </div>
                </div>

                <div id="MOVE-BUTTON-RIGHT" style={{ width: document.getElementById("KNOB-SLIDER2") !== null ? (window.innerWidth - document.getElementById("KNOB-SLIDER2").getBoundingClientRect().right + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05) + "px" : "0px" }}>
                    <div id="ARROW-RIGHT-CONTAINER" className="arrow-container">
                        <div id="ARROW-RIGHT-INDICATOR" className={rightArrowIndicatorClass}></div>
                        <img id="ARROW-RIGHT" className="arrow-img" src={ArrowRight} alt="Slider Arrow Right" />
                    </div>

                </div>
            </div>

            <div id="SCALE-COMPONENT-SLIDER2">
                <div id={"SCALE-SLIDER2"}></div>
                <div id={"KNOB-SLIDER2"} style={{ transform: "translate(" + translateKnob() + "px)" }}>
                    {props.measure === "" ? null : <p id={"KNOB-SLIDER2-LABEL"}>{calculateCurrentValue() + props.measure}</p>}

                </div>
                <p id="SCALE-SLIDER2-MIN">{props.min + props.measure}</p>
                <p id="SCALE-SLIDER2-MAX">{props.max + props.measure}</p>


            </div>

            <div id="STOP-COMPONENT" >
                <div id="STOP-GAZE-INDICATOR" className={stopAreaSelectionClass}></div>
                {!isKnobLocked && !isKnobLocking? <p id="STOP-LABEL">STOP</p> : null}
            </div>

            <div id="STOP-MARKER-CONTAINER">

                <div id="STOP-MARKER" style={{display: determineMarkerVisibility() }}>  </div>
                {props.measure === "" ? null : <p id={"STOP-MARKER-LABEL"} style={{display: determineMarkerVisibility() }}>{isLockingOn + props.measure}</p>}
            </div>

        </div>
    );
}

export default Slider;