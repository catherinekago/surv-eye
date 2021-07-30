

// import { click } from "../functions/click";
// import { isGazeWithinElement } from '../functions/isGazeWithinElement';
import { convertAngleToPx } from "../../functions/convertAngleToPx";

import { useState, useEffect } from 'react';
import "./slider.css";

const Slider = (props) => {

    const [currentValue, setCurrentValue] = useState(props.value);

    const [isKnobMoving, setIsKnobMoving] = useState(false);
    const [movementDirection, setMovementDirection] = useState("right");
    const [fill, setFill] = useState(0);
    const [knobTransform, setKnobTransform] = useState("");


    const MINTARGETSIZE = convertAngleToPx(4.17);
    let MOVEMENTINTERVAL = props.max * 0.5;
    // const MOVEMENTINTERVAL = 5;

    useEffect(() => {
        if (isKnobMoving) {
        
        setCurrentValue(determineValueAccordingToPosition());
        let knobCenter = document.getElementById("target-area-knob").getBoundingClientRect().left - 0.5*MINTARGETSIZE;
        setFill(knobCenter);
    
        // Change direction if an endpoint of the slider has been reached 
        if (movementDirection === "right" && document.getElementById("target-area-knob").getBoundingClientRect().right === document.getElementById("slider-bar").getBoundingClientRect().right) {
            setMovementDirection("left");
            let movementTarget = 0;
            setKnobTransform("translateX(" + movementTarget + "px)");
        } else if (movementDirection === "left" && document.getElementById("target-area-knob").getBoundingClientRect().left === document.getElementById("slider-bar").getBoundingClientRect().left) {
            setMovementDirection("right");
            let movementTarget = document.getElementById("slider-bar").getBoundingClientRect().width - MINTARGETSIZE;
            setIsKnobMoving(true);
            setKnobTransform("translateX(" + movementTarget + "px)")
        }

    }
    });

    // Initialize movement of the knob
    const startMovement = (direction) => {
        setIsKnobMoving(true);
        if (direction === "right") {
            let movementTarget = document.getElementById("slider-bar").getBoundingClientRect().width - MINTARGETSIZE;
            setKnobTransform("translateX(" + movementTarget + "px)");
        } else {
            let movementTarget = 0;
            setKnobTransform("translateX(" + movementTarget + "px)");  
        }

    }

    // Determine the step width according the the range of the slider
    const determineStepWidth = () => {
        let minPosition = document.getElementById("slider-bar").getBoundingClientRect().left;
        let maxPosition = document.getElementById("slider-bar").getBoundingClientRect().right - MINTARGETSIZE;

        let distance = maxPosition - minPosition;
        let step = distance / props.max;
        return step;
    }

    // Calculate the current value of the slider according to the knob position
    const determineValueAccordingToPosition = () => {
        let stepwidth = determineStepWidth();
        let currentPosition = document.getElementById("target-area-knob").getBoundingClientRect().left - document.getElementById("slider-bar").getBoundingClientRect().left;
        return Math.round(currentPosition / stepwidth);
    }

    return (

        <div id="slider-component">
            <p onClick={() => startMovement("right")} id="slider-min" className="slider-label">{props.min + " " + props.measure}</p>
            <div id="slider-container">

                <div id="slider-bar" />
                <div style={{ width: fill + "px" }} id="slider-bar-fill" />
                <div style={{ transitionDuration: MOVEMENTINTERVAL + "s", transform: knobTransform, width: MINTARGETSIZE, height: MINTARGETSIZE }} id="target-area-knob">
                    <div id="slider-knob">
                        <p style={{ margin: "0", textAlign: "center", fontSize: "32px", color: "white", fontWeight: 800 }}>{currentValue + " " + props.measure}</p>
                    </div>
                </div>
            </div>

            <p onClick={() => setIsKnobMoving(false)} id="slider-max" className="slider-label">{props.max + " " + props.measure}</p>
        </div>

    );
}

export default Slider;