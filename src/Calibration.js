import { useState, useEffect, useRef } from 'react';
import CalibrationPoint from "./CalibrationPoint";
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';
import { convertAngleToPx } from './functions/convertAngleToPx';
import "./css/calibration.css";

const Calibration = (props) => {

    const contextRef = useRef(props.context);
    contextRef.current = props.context;

    // To determine whether a phase has started
    const [hasPhaseStarted, setHasPhaseStarted] = useState(false);

    // To determine the values that relate to the current validation point
    const [currentPoint, setCurrentPoint] = useState(0);
    const [currentPhase, setCurrentPhase] = useState("INACTIVE");

    // To determine state of calibration and validation process and change of steps 
    const [calibrationComplete, setCalibrationComplete] = useState(false);
    const [validationComplete, setValidationComplete] = useState(false);

    const pointReference = "calibrationPoint";
    const pointWidth = 50 + 50  // margin of point 
    const targetSize = convertAngleToPx(4.17);

    const [introHeader, setIntroHeader] = useState("Welcome to SurvEye!");
    const [introText, setIntroText] = useState("To complete the calibration, please follow the moving dot 🟢. Please try not to move your head or blink too often.");

    // Different steps of target sizes to be tested, for validation phase
    const targetS = 100;
    const targetM = targetSize; // calculated min size required
    const targetL = 200;
    const targetXL = 300;
    const currentValidationResultS = useRef(0);
    const validationTotalS = useRef(0);
    const currentValidationResultM = useRef(0);
    const validationTotalM = useRef(0);
    const currentValidationResultL = useRef(0);
    const validationTotalL = useRef(0);
    const currentValidationResultXL = useRef(0);
    const validationTotalXL = useRef(0);

    const currentValidationCount = useRef(0);

    // Format: {x: , y: , accuracyS: , accuracyM: , accuracyL: , accuracyXL: }
    const [accuracyPerPoint, setAccuracyPerPoint] = useState([]);

    // 3x3 Calibration Grid
    // const [pointPositions, setPointPositions] = useState([
    //     { x: 0, y: 0 },  
    //     { x: window.innerWidth * 0.5 - 0.5 * pointWidth, y: 0 },
    //     { x: window.innerWidth - pointWidth, y: 0},

    //     { x: 0, y: window.innerHeight * 0.5 - 0.5 * pointWidth },  
    //     { x: window.innerWidth * 0.5 - 0.5 * pointWidth, y: window.innerHeight * 0.5 - 0.5 * pointWidth },
    //     { x: window.innerWidth - pointWidth, y: window.innerHeight * 0.5 - 0.5 * pointWidth},

    //     { x: 0, y: window.innerHeight - pointWidth },  
    //     { x: window.innerWidth * 0.5 - 0.5 * pointWidth, y: window.innerHeight - pointWidth },
    //     { x: window.innerWidth - pointWidth, y: window.innerHeight - pointWidth}
    // ]);

    // 4x4 calibration Grid
    const [pointPositions, setPointPositions] = useState([
        { x: 0, y: 0 },
        { x: window.innerWidth * (1 / 3) - 0.5 * pointWidth, y: 0 },
        { x: window.innerWidth * (2 / 3) - 0.5 * pointWidth, y: 0 },
        { x: window.innerWidth - pointWidth, y: 0 },

        { x: 0, y: window.innerHeight * (1 / 3) - 0.5 * pointWidth },
        { x: window.innerWidth * (1 / 3) - 0.5 * pointWidth, y: window.innerHeight * (1 / 3) - 0.5 * pointWidth },
        { x: window.innerWidth * (2 / 3) - 0.5 * pointWidth, y: window.innerHeight * (1 / 3) - 0.5 * pointWidth },
        { x: window.innerWidth - pointWidth, y: window.innerHeight * (1 / 3) - 0.5 * pointWidth },

        { x: 0, y: window.innerHeight * (2 / 3) - 0.5 * pointWidth },
        { x: window.innerWidth * (1 / 3) - 0.5 * pointWidth, y: window.innerHeight * (2 / 3) - 0.5 * pointWidth },
        { x: window.innerWidth * (2 / 3) - 0.5 * pointWidth, y: window.innerHeight * (2 / 3) - 0.5 * pointWidth },
        { x: window.innerWidth - pointWidth, y: window.innerHeight * (2 / 3) - 0.5 * pointWidth },

        { x: 0, y: window.innerHeight - pointWidth },
        { x: window.innerWidth * (1 / 3) - 0.5 * pointWidth, y: window.innerHeight - pointWidth },
        { x: window.innerWidth * (2 / 3) - 0.5 * pointWidth, y: window.innerHeight - pointWidth },
        { x: window.innerWidth - pointWidth, y: window.innerHeight - pointWidth },

    ]);

    // To allow timing length of phases, length of start sequence, and intervals of actions
    const TIMEOUT_SEQUENCE = 3000;
    const TIMEOUT_INTRO = 5000;
    const INTERVAL_MEASUREMENT = 100;
    const TIMEOUT_TRANSITION = 1000;

    const [movementTimeout, setMovementTimeout] = useState(false);
    const [phaseStartedTimeout, setPhaseStartedTimeout] = useState(false);
    const [measurementInterval, setMeasurementInterval] = useState(false);
    const [introProgressClass, setIntroProgressClass] = useState("progress-no-fill");



    useEffect(() => {
        // Perform calibration until it is complete 

        // Determine if a phase has already been started or has to be initialized
        if (!hasPhaseStarted) {
            setIntroProgressClass("progress-fill");
            if (!phaseStartedTimeout) {
                setPhaseStartedTimeout(true);
                setTimeout(() => {
                    // If a validation phase is needed
                    if (props.performValidation) {
                        let type = !calibrationComplete ? "CALIBRATION" : (!validationComplete ? "VALIDATION" : "QUESTIONNAIRE");
                        startPhase(type);
                    } else {
                        let type = !calibrationComplete ? "CALIBRATION" : "QUESTIONNAIRE";
                        startPhase(type);
                    }
                    setPhaseStartedTimeout(false);
                }, TIMEOUT_INTRO);
            }

        } else {
            setIntroProgressClass("progress-no-fill");
            // Make sure to start click / measurement trigger only after transition of point has been completed
            if (!measurementInterval) {
                setMeasurementInterval(true);
                setTimeout(() => {
                    const measureInterval = setInterval(() => {
                        if (currentPhase === "CALIBRATION") {
                            click("calibrationPointCenter");
                        } else if (props.performValidation && currentPhase === "VALIDATION") {
                            handleGazeValidation();
                        }
                    }, INTERVAL_MEASUREMENT);

                    // Kill measure interval after dedicated measure time 
                    setTimeout(() => {
                        clearInterval(measureInterval);
                        setMeasurementInterval(false);
                    }, TIMEOUT_SEQUENCE - TIMEOUT_TRANSITION);

                }, TIMEOUT_TRANSITION);

            }

            // Change point position / displayed content after XXXX ms
            if (!movementTimeout) {
                setMovementTimeout(true);
                setTimeout(() => {
                    handlePointMovement();
                    setMovementTimeout(false);
                }, TIMEOUT_SEQUENCE)
            }

        }

    });

    // Randomize calibration points so user cannot predict positions and show anticipated behavior
    const randomizePointPositions = (array) => {
        let newArray = array;
        for (var i = newArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = newArray[i];
            newArray[i] = newArray[j];
            newArray[j] = temp;
        }
        return newArray;
    }


    // Start phase 
    const startPhase = (type) => {
        // End calibraiton-validation and switch to questionnaire 
        if (type === "QUESTIONNAIRE") {
            props.onCalibrationComplete(false);
            props.retrieveData(accuracyPerPoint);
            // Start calibration or validation phase
        } else {
            setPointPositions(randomizePointPositions(pointPositions));
            setCurrentPhase(type);
            setHasPhaseStarted(true);

        }
    }

    // Move point to designated position and handle end of sequence 
    const handlePointMovement = () => {
        if (currentPoint + 1 === pointPositions.length) {
            handlePhaseEnd();

        } else {

            if (props.performValidation && currentPhase === "VALIDATION") {

                updateAccuracyPerPoint();

                currentValidationCount.current = 0;

                currentValidationResultS.current = 0;
                currentValidationResultM.current = 0;
                currentValidationResultL.current = 0;
                currentValidationResultXL.current = 0;
            }

            setCurrentPoint(currentPoint + 1);
        }

    }

    // Add new accuracy measurements to data set 
    const updateAccuracyPerPoint = () => {
        // add for each point percentage of accuracy to array
        let newAccuracyArray = accuracyPerPoint;
        newAccuracyArray.push({ x: pointPositions[currentPoint].x, y: pointPositions[currentPoint].y, accuracyS: currentValidationResultS.current / currentValidationCount.current, accuracyM: currentValidationResultM.current / currentValidationCount.current, accuarcyL: currentValidationResultL.current / currentValidationCount.current, accuracyXL: currentValidationResultXL.current / currentValidationCount.current });
        setAccuracyPerPoint(newAccuracyArray);

        validationTotalS.current = validationTotalS.current + (currentValidationResultS.current / currentValidationCount.current) * 100;
        validationTotalM.current = validationTotalM.current + (currentValidationResultM.current / currentValidationCount.current) * 100;
        validationTotalL.current = validationTotalL.current + (currentValidationResultL.current / currentValidationCount.current) * 100;
        validationTotalXL.current = validationTotalXL.current + (currentValidationResultXL.current / currentValidationCount.current) * 100;
    }

    // Handle end of a phase by resetting the current point and determine what should be displayed next
    const handlePhaseEnd = () => {
        if (currentPhase === "CALIBRATION") {
            setCalibrationComplete(true);
            if (props.performValidation) {
                setIntroHeader("One more time! 💪")
                setIntroText("Let's do this again one more time to validate the calibration. 🟢 ");
                props.onPhaseChange("VALIDATION")
            } else {
                props.onPhaseChange("QUESTIONNAIRE");
                // setCalibrationComplete(true);
                setIntroHeader("You did it! 🎉");
                setIntroText("You will be directed to the questionnaire immediately.");
            }

        } else if (currentPhase === "VALIDATION") {
            setValidationComplete(true);
            setIntroHeader("You did it! 🎉");
            setIntroText("You will be directed to the questionnaire immediately.");
            // setIntroText("Your validation result is: " + resultM + "%");

            updateAccuracyPerPoint();
            validationTotalS.current = Math.round(validationTotalS.current / pointPositions.length);
            validationTotalM.current = Math.round(validationTotalM.current / pointPositions.length);
            validationTotalL.current = Math.round(validationTotalL.current / pointPositions.length);
            validationTotalXL.current = Math.round(validationTotalXL.current / pointPositions.length);

            // add final percentage of accuracy to array
            let newAccuracyArray = accuracyPerPoint;
            // Format: {x: , y: , accuracyS: , accuracyM: , accuracyL: , accuracyXL: }
            newAccuracyArray.push({ x: "TOTAL", y: "TOTAL", accuracyS: validationTotalS.current / 100, accuracyM: validationTotalM.current / 100, accuarcyL: validationTotalL.current / 100, accuracyXL: validationTotalXL.current / 100 });
            setAccuracyPerPoint(newAccuracyArray);

            props.retrieveData(accuracyPerPoint);
            props.onPhaseChange("QUESTIONNAIRE");
        }
        setCurrentPhase("INACTIVE");
        setCurrentPoint(0);
        setHasPhaseStarted(false);
        setIntroProgressClass("progress-fill");
    }

    const handleGazeValidation = () => {
        // Check if gaze lies within the target area (= targetSize - pointWidth)

        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetS - 0.5 * 0.5 * pointWidth, contextRef.current.x, contextRef.current.y)) {
            currentValidationResultS.current++;
        }

        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetM - 0.5 * 0.5 * pointWidth, contextRef.current.x, contextRef.current.y)) {
            currentValidationResultM.current++;
        }

        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetL - 0.5 * 0.5 * pointWidth, contextRef.current.x, contextRef.current.y)) {
            currentValidationResultL.current++;
        }

        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetXL - 0.5 * 0.5 * pointWidth, contextRef.current.x, contextRef.current.y)) {
            currentValidationResultXL.current++;
        }

        currentValidationCount.current++;
    }

    return (

        <div id="CALIBRATION-CONTAINER" style={{ display: hasPhaseStarted ? "block" : "flex" }}
        >
            <CalibrationPoint
                id={pointReference}
                phase={currentPhase}
                reference={pointReference}
                position={pointPositions[currentPoint]}
            />

            <div id="INTRO" style={{ opacity: hasPhaseStarted ? 0 : 1 }}>
            <div id="PROGRESS-BAR" className= {introProgressClass} style={{transitionDuration: TIMEOUT_INTRO + "ms" }} />
                <div id="INTRO-TEXT-BLOCK">
                    <p id="INTRO-HEADER">{introHeader} </p>
                    <p id="INTRO-TEXT">{introText} </p>
                </div>
            </div>
        </div>
    );

}

export default Calibration;