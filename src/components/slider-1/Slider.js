import { isGazeWithinElement } from '../../functions/isGazeWithinElement';

import { useState, useEffect, useRef } from 'react';
import "./slider.css";

// How to make a questionnaire item for this slider: 
// Without numeric scale
// { number: 0, type: "slider1", statement: "How much of an overthinker are you?", min: "low", max: "high", measure:"", input: null },
// With numeric scale
// { number: 1, type: "slider1", statement: "How much of an overthinker are you?", min: 0, max: 100, measure:"%", input: null },

// Where does it have to be added? --> Questionnaire, QuestionnaireItem, InspectionComponent

const Slider = (props) => {
    const [sliderID, setSliderID] = useState(props.id);
    const [isReset, setIsReset] = useState(false);
    const [knobAreaSelectionClass, setKnobAreaSelectionClass] = useState("knob-area-no-fill");
    const [lastGazeSelection, setLastGazeSelection] = useState(0);
    const [lastTransitionStart, setLastTransitionStart] = useState(0);
    const [isKnobInspected, setIsKnobInspected] = useState(false);
    const [isSideInspected, setIsSideInspected] = useState(false);
    const INSPECTIONTIME = 500;
    const [isKnobTransitioning, setIsKnobTransitioning] = useState(false);
    const [movement, setMovement] = useState(null); // right and left set in handleGazeWithinDirectionButtons
    const movementRef = useRef(movement);
    movementRef.current = movement;
    const [translateKnobTo, setTranslateKnobTo] = useState(0);

    useEffect(() => {
        if (!props.isInspectionArea) {
            if (props.id !== sliderID) {
                if (!isReset) {
                    resetKnob();
                } else {
                    document.getElementById("KNOB-AREA-INTERACTION").style.transform = "translate(0px)";
                    setSliderID(props.id);
                    setIsReset(false);
                }
            }
            // If gaze stays on knob area long enough, log it in and update value with props.setItemValue
            if (props.value === calculateCurrentValue()) {
                handleInteractionUnlock();
            } else {
                handleGazeWithingMoveButtons();
                handleGazeWithinKnobArea();
            }
        }
    });

    // Transate knob position if movement is triggered
    useEffect(() => {
        const interval = setInterval(() => {
            // Determine movement only if knob is not locked or in the process of being locked
            if (movement !== "none") {
                translateInteractionKnob();
            }
        }, 5);

        return () => clearInterval(interval);
    }, [])

    // Move interaction knob to min value
    const resetKnob = () => {
        let KNOB_POS = document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left;
        console.log("left is at " + KNOB_POS)
        let translateBy = KNOB_POS - 0.05 * window.innerWidth;
        console.log("reset Knob by " + translateBy);
        document.getElementById("KNOB-AREA-INTERACTION").style.transform = "translate(" + (-1 * translateBy) + "px)"
        setIsReset(true);
        // document.getElementById("INTERACTION-AREA-LEFT").style.offsetWidth = "0px";
        // document.getElementById("INTERACTION-AREA-RIGHT").style.offsetWidth = (window.innerWidth - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right) + "px";
    }

    // Handle gaze detection within knob area: when to trigger dwell time, when to trigger selection, when to remove selection
    const handleGazeWithinKnobArea = () => {
        if (document.getElementById("KNOB-AREA-INTERACTION") !== null && document.getElementById("KNOB-AREA-SELECTION") !== null) {
            if (isGazeWithinElement("KNOB-AREA-INTERACTION", 0, props.context.x, props.context.y)) {

                let currentTime = new Date().getTime();
                // Start clock for selection delay
                if (props.value !== calculateCurrentValue() && !isKnobInspected) {
                    setIsKnobInspected(true);
                    setLastGazeSelection(currentTime);
                }
                // Start transition once selection delay has passed
                if (isKnobInspected && !isKnobTransitioning && currentTime >= lastGazeSelection + INSPECTIONTIME) {
                    setKnobAreaSelectionClass("knob-area-fill knob-transitioning");
                    setLastGazeSelection(currentTime);
                    setIsKnobTransitioning(true);
                    setLastTransitionStart(currentTime);
                    setLastGazeSelection(currentTime);
                    setMovement("none");

                }
                // Trigger selection once transition has completed 
                if (isKnobTransitioning && currentTime >= lastTransitionStart + 800) {
                    setKnobAreaSelectionClass("knob-area-fill");
                    setIsKnobTransitioning(false);
                    props.setItemValue(calculateCurrentValue());
                }

            } else {
                // Handle no gaze on knob area
                setIsKnobInspected(false);
                // Set background of knob area if value has been selected
                if (props.value === calculateCurrentValue()) {
                    setKnobAreaSelectionClass("knob-area-fill");
                } else {
                    // Remove background from knob area if value has not been locked
                    setKnobAreaSelectionClass("knob-area-no-fill knob-transitioning");
                    if (document.getElementById("KNOB-AREA-SELECTION").offsetHeight === 0) {
                        setIsKnobTransitioning(false);

                    }

                }
            }
        }
    }

    // Unlock interaction area left and right once dwell time has passed
    const handleInteractionUnlock = () => {
        if (props.value === calculateCurrentValue()) {
            let currentTime = new Date().getTime();
            // Perform unlock if gaze has been detected within one of the interaction sides
            if (isGazeWithinElement("INTERACTION-AREA-LEFT", 0, props.context.x, props.context.y) || isGazeWithinElement("INTERACTION-AREA-RIGHT", 0, props.context.x, props.context.y) || (props.context.x < window.innerWidth * 0.05 && props.context.y >= document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().top) || (props.context.x > window.innerWidth - window.innerWidth * 0.05 && props.context.y >= document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().top)) {
                // Start delay timer if side is currently not being inspected
                if (!isSideInspected) {
                    setIsSideInspected(true);
                    setLastGazeSelection(currentTime);
                }
                // Start transition once delay timer has finished
                if (isSideInspected && !isKnobTransitioning && currentTime >= lastGazeSelection + INSPECTIONTIME) {
                    setIsKnobTransitioning(true);
                    setLastGazeSelection(currentTime);
                    setLastTransitionStart(currentTime);
                    setKnobAreaSelectionClass("knob-area-no-fill knob-transitioning");
                }
                // Reset knob appearance once transition is completed
                if (isKnobTransitioning && currentTime >= lastTransitionStart + 800) {
                    setKnobAreaSelectionClass("knob-area-no-fill");
                    setIsKnobTransitioning(false);
                    setIsSideInspected(false);
                    handleGazeWithingMoveButtons();
                }

            } else {
                // If no side is inspected, reset to default 
                setIsSideInspected(false);
                setIsKnobTransitioning(false);
                setKnobAreaSelectionClass("knob-area-fill knob-transitioning");
            }
        }
    }

    // Calculate position of knob area according to scale 
    const calculateCurrentValue = () => {
        if (!props.isInspectionArea && (document.getElementById("SCALE-INTERACTION") !== null || document.getElementById("KNOB-AREA-INTERACTION") !== null)) {
            let SCALE_WIDTH = document.getElementById("SCALE-INTERACTION").offsetWidth;
            let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;

            let positionOnScale = document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left - window.innerWidth * 0.05;
            let value = Math.round((positionOnScale) / SCALE_UNIT);
            return value;
        } else {
            if (props.value === null) {
                return props.measure === "" ? 0 : props.min;
            } else {
                return props.value;
            }

        }
    }

    // Determine if gaze is detected within gaze buttons and set movement variable accordingly
    const handleGazeWithingMoveButtons = () => {

        // If gaze has been detected in left area, move to left by one unit
        if (isGazeWithinElement("INTERACTION-AREA-LEFT", 0, props.context.x, props.context.y) || (props.context.x < window.innerWidth * 0.05 && props.context.y >= document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().top)) {
            setMovement("left");
        } else if (isGazeWithinElement("INTERACTION-AREA-RIGHT", 0, props.context.x, props.context.y) || (props.context.x > window.innerWidth - window.innerWidth * 0.05 && props.context.y >= document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().top)) {
            setMovement("right");
        } else {
            setMovement("none");
        }
    }

        // Calculate position of knob within interaction area : only move if knob has not been blocked!
        const translateInteractionKnob = () => {
            if (movementRef.current === "left" && document.getElementById("INTERACTION-AREA-LEFT") !== null) {
                // If border has been reached, stop movement
                    if (document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left - window.innerWidth * 0.05 <= 0) {
                        setTranslateKnobTo(0);
                        setMovement("none");
                        // If remaining space is smaller than 1, move by that available space
                    } else if (document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left - window.innerWidth * 0.05 < 1) {
                        setTranslateKnobTo(prev => prev - (-1 * (document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left - window.innerWidth * 0.05)));
                    // Move by 1 otherwise
                    } else {
                        setTranslateKnobTo(prev => prev - 1);
                    }
                } else if (movementRef.current === "right" && document.getElementById("INTERACTION-AREA-RIGHT") !== null) {
                    if (window.innerWidth - window.innerWidth * 0.05 - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right <= 0) {
                        setTranslateKnobTo(0);
                        setMovement("none");
                    } else if (window.innerWidth - window.innerWidth * 0.05 - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right < SCALE_UNIT) {
                        setTranslateKnobTo(prev => prev + (window.innerWidth - window.innerWidth * 0.05 - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right)); 
                    } else {
                        setTranslateKnobTo(prev => prev + 1);
                    }
                }
            }

        // Calculate position of knob within inspection area according to size of scale and given range
        const translateInspectionKnob = () => {
            if (document.getElementById("KNOB-AREA-INSPECTION") !== null && document.getElementById("SCALE-INSPECTION") !== null) {
                let SCALE_WIDTH = document.getElementById("SCALE-INSPECTION").offsetWidth;
                let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;
                let KNOB_AREA_WIDTH = document.getElementById("KNOB-AREA-INSPECTION").offsetWidth;
                let MARGIN_LEFT = (window.innerWidth - SCALE_WIDTH) / 2;
                let newPosition = (SCALE_UNIT * props.value - 0.5 * KNOB_AREA_WIDTH);
                return (newPosition);
            }

        }


        return (

            <div id="SLIDER-COMPONENT">

                <div id="INTERACTION-AREA">
                    {!props.isInspectionArea ? <div id="INTERACTION-AREA-LEFT" style={{ width: document.getElementById("KNOB-AREA-INTERACTION") !== null ? (document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left - window.innerWidth * 0.05) + "px" : "0px" }}> </div> : null}


                    <div id={!props.isInspectionArea ? "KNOB-AREA-INTERACTION" : "KNOB-AREA-INSPECTION"} style={{ transform: !props.isInspectionArea ? "translate(" + translateKnobTo + "px)" : "translate(" + translateInspectionKnob() + "px)" }}>
                        <div id="KNOB-AREA-SELECTION" className={!props.isInspectionArea ? knobAreaSelectionClass : ""}> </div>
                        <div id={!props.isInspectionArea ? "KNOB-INTERACTION" : "KNOB-INSPECTION"}>
                        </div>
                        {props.measure === "" ? null : <p id={!props.isInspectionArea ? "KNOB-INTERACTION-LABEL" : "KNOB-INSPECTION-LABEL"}>{calculateCurrentValue() + props.measure}</p>}
                    </div>
                    {!props.isInspectionArea ? <div id="INTERACTION-AREA-RIGHT" style={{ width: document.getElementById("KNOB-AREA-INTERACTION") !== null ? (window.innerWidth - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right - window.innerWidth * 0.05) + "px" : "0px" }}></div> : null}


                </div>

                <div id="SCALE-COMPONENT" style={{ marginTop: !props.isInspectionArea ? "2px" : "75px", width: !props.isInspectionArea ? "72%" : "90%" }}>

                    <p id="SCALE-MIN">{props.min + props.measure}</p>

                    <div id={!props.isInspectionArea ? "SCALE-INTERACTION" : "SCALE-INSPECTION"}>
                    </div>

                    <p id="SCALE-MAX">{props.max + props.measure}</p>

                </div>


            </div>


        );
    }

    export default Slider;