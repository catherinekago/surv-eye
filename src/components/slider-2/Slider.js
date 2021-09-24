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
    const INSPECTIONTIME = 500;

    const [inspectRightTime, setInspectRightTime] = useState(0);
    const [isRightInspected, setIsRightInspected] = useState(false);
    const [rightArrowIndicatorClass, setRightArrowIndicatorClass] = useState("arrow-no-fill")
    const [rightArrowContainerClass, setRightArrowContainerClass] = useState("")

    const [inspectLeftTime, setInspectLeftTime] = useState(0);
    const [movement, setMovement] = useState(null); // right and left set in handleGazeWithinDirectionButtons
    const [isLeftInspected, setIsLeftInspected] = useState(false);
    const [leftArrowIndicatorClass, setLeftArrowIndicatorClass] = useState("arrow-no-fill arrow-left")
    const [leftArrowContainerClass, setLeftArrowContainerClass] = useState("")

    const [isKnobLocking, setIsKnobLocking] = useState(false);
    const [isLockingOn, setIsLockingOn] = useState(null);
    const isLockingOnRef = useRef(isLockingOn);
    isLockingOnRef.current = isLockingOn;
    const [isKnobLocked, setIsKnobLocked] = useState(false);

    const [stopAreaSelectionClass, setStopAreaSelectionClass] = useState("stop-area-no-fill");

    const [eventListenerStop, setEventListenerStop] = useState(false);
    const [eventListenerLeft, setEventListenerLeft] = useState(false);
    const [eventListenerRight, setEventListenerRight] = useState(false);




    useEffect(() => {
        if (props.id !== sliderID) {

            if (!isReset) {
                setIsReset(true);
                setMovement(null);
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

        // Check if left gaze button exists and gaze is detected within left button 
        if (movement !== "left" && document.getElementById("MOVE-BUTTON-LEFT") !== null && isGazeWithinElement("MOVE-BUTTON-LEFT", 0, props.context.x, props.context.y)) {
            // Initialize eventlistener if not already there
            if (!eventListenerLeft) {
                document.getElementById("ARROW-LEFT-INDICATOR").addEventListener("transitionend", onTransitionEnd, false);
                setEventListenerLeft(true);
            }
            // Check if it is there for first time (isLeftInspected === false )
            // If so, show visual indicator for inspection, start timer 
            if (!isLeftInspected) {
                setIsLeftInspected(true);
                let currentTime = new Date().getTime();
                setInspectLeftTime(currentTime);
                setLeftArrowContainerClass("arrow-inspected");
            }
            // If left is inspected and required time has passed, start selection process by setting class to arrow-fill arrow-transitioning arrow-left
            if (isLeftInspected && new Date().getTime() >= inspectLeftTime + INSPECTIONTIME) {
                setLeftArrowIndicatorClass("arrow-fill arrow-transitioning arrow-left");
            }
            // Check if left gaze button exists and gaze is NOT detected within left button 
        } else if (document.getElementById("MOVE-BUTTON-LEFT") !== null && isGazeWithinElement("MOVE-BUTTON-LEFT", 0, props.context.x, props.context.y)) {
            // Set all concerned boolean values to false 
            // Set class to arrow-no-fill arrow-left arrow-transitioning
            setIsLeftInspected(false);
            setLeftArrowContainerClass("");
            setLeftArrowIndicatorClass("arrow-no-fill arrow-transitioning arrow-left");

        } else if (movement !== "right" && document.getElementById("MOVE-BUTTON-RIGHT") !== null && isGazeWithinElement("MOVE-BUTTON-RIGHT", 0, props.context.x, props.context.y)) {
            // Initialize eventlistener if not already there
            if (!eventListenerRight) {
                document.getElementById("ARROW-RIGHT-INDICATOR").addEventListener("transitionend", onTransitionEnd, false);
                setEventListenerRight(true);
            }
            // Check if it is there for first time (isRightInspected === false )
            // If so, show visual indicator for inspection, start timer 
            if (!isRightInspected) {
                setIsRightInspected(true);
                let currentTime = new Date().getTime();
                setInspectRightTime(currentTime);
                setRightArrowContainerClass("arrow-inspected");
            }
            // If right is inspected and required time has passed, start selection process by setting class to arrow-fill arrow-transitioning
            if (isRightInspected && new Date().getTime() >= inspectRightTime + INSPECTIONTIME) {
                setRightArrowIndicatorClass("arrow-fill arrow-transitioning");
            }
            // Check if right gaze button exists and gaze is NOT detected within right button 
        } else if (document.getElementById("MOVE-BUTTON-RIGHT") !== null && isGazeWithinElement("MOVE-BUTTON-RIGHT", 0, props.context.x, props.context.y)) {
            // Set all concerned boolean values to false 
            // Set class to arrow-no-fill arrow-left arrow-transitioning
            setIsRightInspected(false);
            setRightArrowContainerClass("");
            setRightArrowIndicatorClass("arrow-no-fill arrow-transitioning");

        }
    }

    // Handle interaction with stop area: trigger selection of a value
    const handleGazeWithinStopArea = () => {
        if (!eventListenerStop) {
            document.getElementById("STOP-GAZE-INDICATOR").addEventListener("transitionend", onTransitionEnd, false);
            setEventListenerStop(true);
        }

        // Handle gaze within area
        if (document.getElementById("STOP-COMPONENT") !== null && isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y)) {
            if (!isKnobLocking && document.getElementById("STOP-MARKER-CONTAINER") !== null && document.getElementById("KNOB-SLIDER2") !== null) {
                let currentValue = calculateCurrentValue();
                setIsLockingOn(currentValue);
                let currentKnobCenter = document.getElementById("KNOB-SLIDER2").getBoundingClientRect().left - document.getElementById("KNOB-SLIDER2").offsetWidth / 2 + 2;
                translateElementToPosition("STOP-MARKER-CONTAINER", currentKnobCenter);
                setIsKnobLocking(true);
                setStopAreaSelectionClass("stop-transitioning stop-area-fill")
                // Change class of gaze indicator 
            }

            // Handle gaze removed from area
        } else if (document.getElementById("STOP-COMPONENT") !== null && !isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y)) {
            if (props.value !== isLockingOn) {
                setStopAreaSelectionClass("stop-transitioning stop-area-no-fill");
                setIsKnobLocking(false);
                setIsLockingOn(null);
            } else if (props.value === calculateCurrentValue()) {
                setStopAreaSelectionClass("stop-area-fill")
            }
        }
    }


    // Handlecompletion of stop transition 
    const onTransitionEnd = (event) => {
        console.log(event.target)
        if (event.target === document.getElementById("STOP-GAZE-INDICATOR")) {
            if (document.getElementById("STOP-GAZE-INDICATOR").offsetHeight !== 0 && (event.propertyName === "height")) {
                props.setItemValue(isLockingOnRef.current);
                setIsKnobLocking(false);
                setIsLockingOn(null);
                setMovement(null);
                translateElementToPosition("KNOB-SLIDER2", document.getElementById("SCALE-SLIDER2").offsetWidth / 2);
                setTimeout(() => setIsKnobLocked(true), 400);

            }
            document.getElementById("STOP-GAZE-INDICATOR").removeEventListener("transitionend", onTransitionEnd);
            setEventListenerStop(false);

        } else if (event.target === document.getElementById("ARROW-LEFT-INDICATOR")) {
            if (document.getElementById("ARROW-LEFT-INDICATOR").offsetWidth !== 0 && (event.propertyName === "width")) {
                setMovement("left");
                setLeftArrowIndicatorClass("arrow-no-fill arrow-left");
                setLeftArrowContainerClass("")

            }
            document.getElementById("ARROW-LEFT-INDICATOR").removeEventListener("transitionend", onTransitionEnd);
            setEventListenerLeft(false);

        } else if (event.target === document.getElementById("ARROW-RIGHT-INDICATOR")) {
            if (document.getElementById("ARROW-RIGHT-INDICATOR").offsetWidth !== 0 && (event.propertyName === "width")) {
                setMovement("right");
                setRightArrowIndicatorClass("arrow-no-fill");
                setRightArrowContainerClass("")

            }
            document.getElementById("ARROW-RIGHT-INDICATOR").removeEventListener("transitionend", onTransitionEnd);
            setEventListenerRight(false);
        }
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

    const determineMarkerVisibility = () => {
        // only show marker during selection process, remove if gaze is removed from stop area or selection has been completed
        if (document.getElementById("STOP-COMPONENT") !== null && isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y) && !isKnobLocked) {
            return ("block");
        } else {
            return ("none");
        }
    }


    return (
        <div id="SLIDER2-COMPONENT">

            <div id="MOVE-BUTTON-AREA">
                <div id="MOVE-BUTTON-LEFT" style={{ width: document.getElementById("KNOB-SLIDER2") !== null ? (document.getElementById("KNOB-SLIDER2").getBoundingClientRect().left + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05) + "px" : "0px" }}>
                    <div id="ARROW-LEFT-CONTAINER" className={leftArrowContainerClass}>
                        <div id="ARROW-LEFT-INDICATOR" className={leftArrowIndicatorClass}></div>
                        <img id="ARROW-LEFT" className="arrow-img" src={ArrowLeft} alt="Slider Arrow Left" />
                    </div>
                </div>

                <div id="MOVE-BUTTON-RIGHT" style={{ width: document.getElementById("KNOB-SLIDER2") !== null ? (window.innerWidth - document.getElementById("KNOB-SLIDER2").getBoundingClientRect().right + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05) + "px" : "0px" }}>
                    <div id="ARROW-RIGHT-CONTAINER" className={rightArrowContainerClass}>
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
                {!isKnobLocked && !isKnobLocking ? <p id="STOP-LABEL">STOP</p> : null}
            </div>

            <div id="STOP-MARKER-CONTAINER">

                <div id="STOP-MARKER" style={{ display: determineMarkerVisibility() }}>  </div>
                {props.measure === "" ? null : <p id={"STOP-MARKER-LABEL"} style={{ display: determineMarkerVisibility() }}>{isLockingOn + props.measure}</p>}
            </div>

        </div>
    );
}

export default Slider;