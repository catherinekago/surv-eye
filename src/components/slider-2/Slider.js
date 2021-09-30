import { isGazeWithinElement } from '../../functions/isGazeWithinElement';
import { useState, useEffect, useRef } from 'react';
import ArrowLeft from '../../assets/arrow-left.svg';
import ArrowRight from '../../assets/arrow-right.svg';
import "./slider.css";
import { POINT_CONVERSION_COMPRESSED } from 'constants';

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
    const movementRef = useRef(movement);
    movementRef.current = movement;
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

    const [currentKnobMarginLeft, setCurrentKnobMarginLeft] = useState(0);
    const currentKnobMarginLeftRef = useRef(currentKnobMarginLeft);
    currentKnobMarginLeftRef.current = currentKnobMarginLeft
    const MIN_MARGIN_KNOB = 16;

    const [resetTimerStarted, setResetTimerStarted] = useState(false);
    const resetTimerStartedRef = useRef(resetTimerStarted);
    resetTimerStartedRef.current = resetTimerStarted;
    const [resetTimer, setResetTimer] = useState(0);
    const resetTimerRef = useRef(resetTimer);
    resetTimerRef.current = resetTimer;
    const RESET_TIMER = 3000;


    useEffect(() => {
        if (props.id !== sliderID) {

            if (!isReset) {
                setIsReset(true);
                setMovement(null);
                if (sliderID === null || props.value === null) {
                    setKnobPosition(0.05 * window.innerWidth + document.getElementById("SCALE-SLIDER2").offsetWidth / 2);
                } else {
                    let SCALE_WIDTH = document.getElementById("SCALE-SLIDER2").offsetWidth;
                    let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;
                    let margin = Math.round(SCALE_UNIT * props.value + 0.05 * window.innerWidth);
                    setKnobPosition(margin);
                    setIsKnobLocked(true);
                }
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

    // Transate knob position if movement is triggered
    useEffect(() => {
        const interval = setInterval(() => {
            if (movement !== "none") {
                translateKnob();
            }
        }, 5);

        return () => clearInterval(interval);
    }, [])

    // Handle interaction with direction buttons: set triggered direction
    const handleGazeWithinDirectionButtons = () => {
        // Check if left gaze button exists and gaze is detected within left button 
        let isGazeWithinMarginAreaLeft = props.context.x <= 0.05 * window.innerWidth && props.context.y >= document.getElementById("MOVE-BUTTON-AREA").getBoundingClientRect().top && props.context.y <= document.getElementById("MOVE-BUTTON-AREA").getBoundingClientRect().bottom;
        let isGazeWithinMarginAreaRight = props.context.x >= window.innerWidth - 0.05 * window.innerWidth && props.context.y >= document.getElementById("MOVE-BUTTON-AREA").getBoundingClientRect().top && props.context.y <= document.getElementById("MOVE-BUTTON-AREA").getBoundingClientRect().bottom;

        if (movement !== "left") {
            if (document.getElementById("MOVE-BUTTON-LEFT") !== null && (isGazeWithinElement("MOVE-BUTTON-LEFT", 0, props.context.x, props.context.y) || isGazeWithinMarginAreaLeft)) {
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
            } else if (document.getElementById("MOVE-BUTTON-LEFT") !== null && !isGazeWithinElement("MOVE-BUTTON-LEFT", 0, props.context.x, props.context.y)) {
                // Set all concerned boolean values to false 
                // Set class to arrow-no-fill arrow-left arrow-transitioning
                setIsLeftInspected(false);
                setLeftArrowContainerClass("");
                setLeftArrowIndicatorClass("arrow-no-fill arrow-transitioning arrow-left");
            }
        }
        if (movement !== "right") {
            if (document.getElementById("MOVE-BUTTON-RIGHT") !== null && (isGazeWithinElement("MOVE-BUTTON-RIGHT", 0, props.context.x, props.context.y) || isGazeWithinMarginAreaRight)) {
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
            } else if (document.getElementById("MOVE-BUTTON-RIGHT") !== null && !(isGazeWithinElement("MOVE-BUTTON-RIGHT", 0, props.context.x, props.context.y) || isGazeWithinMarginAreaRight)) {
                // Set all concerned boolean values to false 
                // Set class to arrow-no-fill arrow-left arrow-transitioning
                setIsRightInspected(false);
                setRightArrowContainerClass("");
                setRightArrowIndicatorClass("arrow-no-fill arrow-transitioning");

            }
        }
    }

    // Handle interaction with stop area: trigger selection of a value
    const handleGazeWithinStopArea = () => {
        if (!eventListenerStop) {
            document.getElementById("STOP-GAZE-INDICATOR").addEventListener("transitionend", onTransitionEnd, false);
            setEventListenerStop(true);
        }

        // Handle gaze within area
        if (movement !== "none") {
            setIsKnobLocked(false);
            if (document.getElementById("STOP-COMPONENT") !== null && isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y) && !isKnobLocked) {
                if (!isKnobLocking && document.getElementById("STOP-MARKER-CONTAINER") !== null && document.getElementById("KNOB-SLIDER2") !== null) {
                    let currentValue = calculateCurrentValue();
                    let SCALE_WIDTH = document.getElementById("SCALE-SLIDER2").offsetWidth;
                    let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;
                    let margin = Math.round(SCALE_UNIT * currentValue - (document.getElementById("STOP-MARKER-CONTAINER").offsetWidth / 2 - 0.05 * window.innerWidth));
                    console.log(margin);
                    document.getElementById("STOP-MARKER-CONTAINER").style.marginLeft = margin + "px";
                    setIsLockingOn(currentValue);
                    setIsKnobLocking(true);
                    setStopAreaSelectionClass("stop-transitioning stop-area-fill")
                }
            } else if (document.getElementById("STOP-COMPONENT") !== null && !isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y)) {
                setStopAreaSelectionClass("stop-transitioning stop-area-no-fill");
                setIsKnobLocking(false);
                setIsLockingOn(null);
            }
        } else if (movement === "none") {
            setStopAreaSelectionClass("stop-transitioning stop-area-fill");
            setIsKnobLocking(false);
            setIsLockingOn(props.value);
            setIsKnobLocked(true);
        }

    }


    // Handlecompletion of stop transition 
    const onTransitionEnd = (event) => {
        if (event.target === document.getElementById("STOP-GAZE-INDICATOR")) {
            if (document.getElementById("STOP-GAZE-INDICATOR").offsetHeight !== 0 && (event.propertyName === "height")) {
                props.setItemValue(isLockingOnRef.current);
                setMovement("none");
                setKnobPosition(document.getElementById("STOP-MARKER-CONTAINER").offsetLeft + document.getElementById("STOP-MARKER-CONTAINER").offsetWidth / 2);
                setIsKnobLocking(false);
                setIsKnobLocked(true);
                setIsLockingOn(null);

            }
            document.getElementById("STOP-GAZE-INDICATOR").removeEventListener("transitionend", onTransitionEnd);
            setEventListenerStop(false);

        } else if (event.target === document.getElementById("ARROW-LEFT-INDICATOR")) {
            if (document.getElementById("ARROW-LEFT-INDICATOR").offsetWidth !== 0 && (event.propertyName === "width")) {
                setMovement("left");
                setLeftArrowIndicatorClass("arrow-no-fill arrow-left");
                setLeftArrowContainerClass("")
                setIsKnobLocked(false);

            }
            document.getElementById("ARROW-LEFT-INDICATOR").removeEventListener("transitionend", onTransitionEnd);
            setEventListenerLeft(false);

        } else if (event.target === document.getElementById("ARROW-RIGHT-INDICATOR")) {
            if (document.getElementById("ARROW-RIGHT-INDICATOR").offsetWidth !== 0 && (event.propertyName === "width")) {
                setMovement("right");
                setRightArrowIndicatorClass("arrow-no-fill");
                setRightArrowContainerClass("")
                setIsKnobLocked(false);

            }
            document.getElementById("ARROW-RIGHT-INDICATOR").removeEventListener("transitionend", onTransitionEnd);
            setEventListenerRight(false);
        }
    }


    // Manualla set position of knob to specified x coordinate
    const setKnobPosition = (xcoor) => {
        let knobWidth = document.getElementById("KNOB-SLIDER2").offsetWidth;
        let marginToTarget = xcoor - knobWidth / 2;

        setCurrentKnobMarginLeft(marginToTarget);
    }

    // Calculate current value according to scale dimensions and knob position
    const calculateCurrentValue = () => {
        if (props.value === null && movement === "none") {
            return props.measure === "" ? 50 : props.max / 2;
        } else if (document.getElementById("SCALE-SLIDER2") !== null) {
            let SCALE_WIDTH = document.getElementById("SCALE-SLIDER2").offsetWidth;
            let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;

            let positionOnScale = document.getElementById("KNOB-SLIDER2").offsetLeft + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05;
            let value = Math.round((positionOnScale) / SCALE_UNIT);
            return value;
        }
    }

    // Translate knob according to selected direction
    const translateKnob = () => {
        if (movementRef.current === "left") {
            if (currentKnobMarginLeftRef.current <= MIN_MARGIN_KNOB) {
                if (!resetTimerStartedRef.current) {
                    setResetTimerStarted(true);
                    setResetTimer(new Date().getTime());
                } else if (new Date().getTime() >= resetTimerRef.current + RESET_TIMER) {
                    setKnobPosition(0.05 * window.innerWidth + document.getElementById("SCALE-SLIDER2").offsetWidth / 2);
                    setResetTimerStarted(false);
                    setMovement(null);
                }

            } else if (currentKnobMarginLeftRef.current - 1 < MIN_MARGIN_KNOB) {
                setCurrentKnobMarginLeft(MIN_MARGIN_KNOB);
            } else {
                setCurrentKnobMarginLeft(prev => prev - 1);
            }
        } else if (movementRef.current === "right") {
            let maxPos = window.innerWidth - (MIN_MARGIN_KNOB + document.getElementById("KNOB-SLIDER2").offsetWidth);
            if (currentKnobMarginLeftRef.current >= maxPos) {
                if (!resetTimerStartedRef.current) {
                    setResetTimerStarted(true);
                    setResetTimer(new Date().getTime());
                } else if (new Date().getTime() >= resetTimerRef.current + RESET_TIMER) {
                    setKnobPosition(0.05 * window.innerWidth + document.getElementById("SCALE-SLIDER2").offsetWidth / 2);
                    setResetTimerStarted(false);
                    setMovement(null);
                }

            } else if (currentKnobMarginLeftRef.current + 1 > maxPos) {
                setCurrentKnobMarginLeft(maxPos);
            } else {
                setCurrentKnobMarginLeft(prev => prev + 1);
            }
        } else if (movementRef.current === "none") {

        }
    }


    const determineMarkerVisibility = () => {
        // only show marker during selection process, remove if gaze is removed from stop area or selection has been completed
        if (document.getElementById("STOP-COMPONENT") !== null && isGazeWithinElement("STOP-COMPONENT", 0, props.context.x, props.context.y) && isKnobLocking) {
            return ("block");
        } else {
            return ("none");
        }
    }


    return (
        <div id="SLIDER2-COMPONENT">

            <div id="MOVE-BUTTON-AREA">
                <div id="MOVE-BUTTON-LEFT" style={{ width: document.getElementById("KNOB-SLIDER2") !== null ? (Math.round(document.getElementById("KNOB-SLIDER2").getBoundingClientRect().left + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05)) + "px" : "0px" }}>
                    <div id="ARROW-LEFT-CONTAINER" className={leftArrowContainerClass}>
                        <div id="ARROW-LEFT-INDICATOR" className={leftArrowIndicatorClass}></div>
                        <img id="ARROW-LEFT" className="arrow-img" src={ArrowLeft} alt="Slider Arrow Left" />
                    </div>
                </div>

                <div id="MOVE-BUTTON-RIGHT" style={{ width: document.getElementById("KNOB-SLIDER2") !== null ? (Math.round(window.innerWidth - document.getElementById("KNOB-SLIDER2").getBoundingClientRect().right + document.getElementById("KNOB-SLIDER2").offsetWidth / 2 - window.innerWidth * 0.05)) + "px" : "0px" }}>
                    <div id="ARROW-RIGHT-CONTAINER" className={rightArrowContainerClass}>
                        <div id="ARROW-RIGHT-INDICATOR" className={rightArrowIndicatorClass}></div>
                        <img id="ARROW-RIGHT" className="arrow-img" src={ArrowRight} alt="Slider Arrow Right" />
                    </div>

                </div>
            </div>


            <div id="STOP-COMPONENT" >
                {!isKnobLocking && !isKnobLocked ? <p id="STOP-LABEL">STOP</p> : null}
                <div id="STOP-GAZE-INDICATOR" className={stopAreaSelectionClass}></div>

            </div>


            <div id="SCALE-COMPONENT-SLIDER2">
                <div id={"SCALE-SLIDER2"}></div>
                <div id={"KNOB-SLIDER2"} style={{ marginLeft: currentKnobMarginLeftRef.current + "px" }}>
                    {props.measure === "" ? null : <p id={"KNOB-SLIDER2-LABEL"}>{calculateCurrentValue() + props.measure}</p>}

                </div>
                <p id="SCALE-SLIDER2-MIN">{props.min + props.measure}</p>
                <p id="SCALE-SLIDER2-MAX">{props.max + props.measure}</p>


            </div>

            <div id="STOP-MARKER-CONTAINER">

                <div id="STOP-MARKER" style={{ display: determineMarkerVisibility() }}>  </div>
                {props.measure === "" ? null : <p id={"STOP-MARKER-LABEL"} style={{ display: determineMarkerVisibility() }}>{isLockingOn + props.measure}</p>}
            </div>



        </div>
    );
}

export default Slider;