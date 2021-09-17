import { isGazeWithinElement } from '../../functions/isGazeWithinElement';

import { useState, useEffect } from 'react';
import "./slider.css";

const Slider = (props) => {

    // const [currentValue, setCurrentValue] = useState(props.min);
    const [knobAreaSelectionClass, setKnobAreaSelectionClass] = useState("knob-area-no-fill");
    const [lastGazeSelection, setLastGazeSelection] = useState(0);
    const [lastTransitionStart, setLastTransitionStart] = useState(0);
    const [isKnobInspected, setIsKnobInspected] = useState(false);
    const [isSideInspected, setIsSideInspected] = useState(false);
    const INSPECTIONTIME = 500;
    const [isKnobTransitioning, setIsKnobTransitioning] = useState(false);



    useEffect(() => {
        if (!props.isInspectionArea) {
            // If gaze stays on knob area long enough, log it in and update value with props.setItemValue
            if (props.value === calculateCurrentValue()) {
                handleInteractionUnlock();
            } else {
                handleGazeWithinKnobArea();
            }
        }
    });

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

                }
                // Trigger selection once transition has completed 
                if (isKnobTransitioning && currentTime >= lastTransitionStart + 800) {
                    console.log("transition done");

                    setKnobAreaSelectionClass("knob-area-fill");
                    setIsKnobTransitioning(false);
                    console.log(calculateCurrentValue())
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

    // Unlock interaction area left and right of dwell time has passed
    const handleInteractionUnlock = () => {
        if (props.value === calculateCurrentValue()) {
            let currentTime = new Date().getTime();
            // Perform unlock if gaze has been detected within one of the interaction sides
            if (isGazeWithinElement("INTERACTION-AREA-LEFT", 0, props.context.x, props.context.y) || isGazeWithinElement("INTERACTION-AREA-RIGHT", 0, props.context.x, props.context.y)) {
                // Start delay timer if side is currently not being inspected
                if (!isSideInspected) {
                    console.log("inspect")
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
                // Unlock knob once transformation has been completed by translating the knob in the corresponding direction
                if (isKnobTransitioning && currentTime >= lastTransitionStart + 800) {
                    setKnobAreaSelectionClass("knob-area-no-fill");
                    setIsKnobTransitioning(false);
                    setIsSideInspected(false);

                    // Translate knob: 
                    let SCALE_WIDTH = document.getElementById("SCALE-INTERACTION").offsetWidth;
                    let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;
                    let translateBy = 0;
                    if (isGazeWithinElement("INTERACTION-AREA-LEFT", 0, props.context.x, props.context.y)) {
                        if (document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left < SCALE_UNIT) {
                            translateBy = -1 * document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left
                        } else {
                            translateBy = (-1 * SCALE_UNIT);
                        }
                    } else if (isGazeWithinElement("INTERACTION-AREA-RIGHT", 0, props.context.x, props.context.y)) {
                        if (window.innerWidth - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right < SCALE_UNIT) {
                            translateBy = (window.innerWidth - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left)
                        } else {
                            translateBy = SCALE_UNIT;
                        }

                    }
                    document.getElementById("KNOB-AREA-INTERACTION").style.transform = "translate(" + translateBy + "px)"

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

            let positionOnScale = document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left;
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

    // Calculate position of knob within interaction area : only move if knob has not been blocked!
    const translateInteractionKnob = () => {
        if (document.getElementById("INTERACTION-AREA-LEFT") !== null || document.getElementById("INTERACTION-AREA-RIGHT") !== null) {
            if (calculateCurrentValue() !== props.value) {
                let SCALE_WIDTH = document.getElementById("SCALE-INTERACTION").offsetWidth;
                let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;
                // If gaze has been detected in left area, move to left by one unit
                if (isGazeWithinElement("INTERACTION-AREA-LEFT", 0, props.context.x, props.context.y)) {
                    if (document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left < SCALE_UNIT) {
                        return (-1 * document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left)
                    } else {
                        return (-1 * SCALE_UNIT);
                    }
                } else if (isGazeWithinElement("INTERACTION-AREA-RIGHT", 0, props.context.x, props.context.y)) {
                    // Else if gaze has been detected in right area, move to right by one unit
                    if (window.innerWidth - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right < SCALE_UNIT) {
                        return (window.innerWidth - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left)
                    } else {
                        return SCALE_UNIT;
                    }
                } else {
                    return 0;
                }
            }

        }
    }

    // Calculate position of knob within inspection area according to size of scale and given range
    const translateInspectionKnob = () => {
        if (document.getElementById("KNOB-AREA-INSPECTION") !== null || document.getElementById("") !== null) {
            let SCALE_WIDTH = document.getElementById("SCALE-INSPECTION").offsetWidth;
            let SCALE_UNIT = props.measure === "" ? SCALE_WIDTH / 100 : SCALE_WIDTH / props.max;
            let KNOB_AREA_WIDTH = document.getElementById("KNOB-AREA-INSPECTION").offsetWidth;
            let MARGIN_LEFT = (window.innerWidth - SCALE_WIDTH) / 2;
            let newPosition = 54 + (SCALE_UNIT * props.value - 0.5 * KNOB_AREA_WIDTH);
            return (newPosition);


        }
    }


    return (

        <div id="SLIDER-COMPONENT">

            <div id="INTERACTION-AREA">
                {!props.isInspectionArea ? <div id="INTERACTION-AREA-LEFT" style={{ width: document.getElementById("KNOB-AREA-INTERACTION") !== null ? document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().left + "px" : "0px" }}> </div> : null}


                <div id={!props.isInspectionArea ? "KNOB-AREA-INTERACTION" : "KNOB-AREA-INSPECTION"} style={{ transform: !props.isInspectionArea ? "translate(" + translateInteractionKnob() + "px)" : "translate(" + translateInspectionKnob() + "px)" }}>
                    <div id="KNOB-AREA-SELECTION" className={!props.isInspectionArea ? knobAreaSelectionClass : ""}> </div>
                    <div id={!props.isInspectionArea ? "KNOB-INTERACTION" : "KNOB-INSPECTION"}>
                    </div>
                    {props.measure === "" ? null : <p id={!props.isInspectionArea ? "KNOB-INTERACTION-LABEL" : "KNOB-INSPECTION-LABEL"}>{calculateCurrentValue() + props.measure}</p>}
                </div>
                {!props.isInspectionArea ? <div id="INTERACTION-AREA-RIGHT" style={{ width: document.getElementById("KNOB-AREA-INTERACTION") !== null ? window.innerWidth - document.getElementById("KNOB-AREA-INTERACTION").getBoundingClientRect().right + "px" : "0px" }}></div> : null}


            </div>

            <div id="SCALE-COMPONENT" style={{ marginTop: !props.isInspectionArea ? "2px" : "75px", width: !props.isInspectionArea ? "80%" : "89%" }}>

                <p id="SCALE-MIN">{props.min + props.measure}</p>

                <div id={!props.isInspectionArea ? "SCALE-INTERACTION" : "SCALE-INSPECTION"}>
                </div>

                <p id="SCALE-MAX">{props.max + props.measure}</p>

            </div>


        </div>


    );
}

export default Slider;