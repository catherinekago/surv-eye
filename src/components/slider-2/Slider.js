import { isGazeWithinElement } from '../../functions/isGazeWithinElement';
import { useState, useEffect } from 'react';
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
    const [knobLocked, setIsKnobLocked] = useState(false);
    const INSPECTIONTIME = 500;
    const [stopAreaSelectionClass, setStopAreaSelectionClass] = useState("stop-area-fill");

    // to do: change to stopAreaSelectionClass

    const [lastGazeSelection, setLastGazeSelection] = useState(0);
    const [lastTransitionStart, setLastTransitionStart] = useState(0);
    const [isKnobInspected, setIsKnobInspected] = useState(false);

    // ? 
    const [isKnobTransitioning, setIsKnobTransitioning] = useState(false);

    useEffect(() => {
        if (props.id !== sliderID) {

            if (!isReset) {
                setIsReset(true);
                resetKnob();

            } else {
                // document.getElementById("KNOB-SLIDER2").style.transform = "translate(0px)";
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

        // setIsKnobLocked(true) if selection was successful 
        // props.setItemValue() if selection was successful
    }

    // Move knob to middle
    const resetKnob = () => {
        let KNOB_POS = document.getElementById("KNOB-SLIDER2").getBoundingClientRect().left;
        let KNOB_WIDTH = + document.getElementById("KNOB-SLIDER2").offsetWidth;
        let MIDDLE = document.getElementById("SCALE-SLIDER2").offsetWidth / 2;
        let zero = KNOB_POS - KNOB_WIDTH/2 + 0.05 * window.innerWidth 
        document.getElementById("KNOB-SLIDER2").style.transform = "translate(" + (-1*zero) + "px)"
        document.getElementById("KNOB-SLIDER2").style.transform = "translate(" + (MIDDLE) + "px)"

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

            <div id="STOP-COMPONENT">

                <p id="STOP-LABEL">STOP</p>
                <div id="STOP-MARKER">
                {props.measure === "" ? null : <p id={"STOP-MARKER-LABEL"}>{calculateCurrentValue() + props.measure}</p>}
                </div>
                <div id="STOP-GAZE-INDICATOR" className={stopAreaSelectionClass}></div>


            </div>


        </div>
    );
}

export default Slider;