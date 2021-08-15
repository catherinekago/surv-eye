import { useState, useEffect, useRef } from 'react';
import CalibrationPoint from "./CalibrationPoint";
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';
import { convertAngleToPx } from './functions/convertAngleToPx';

const Calibration = (props) => {

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
    const [introText, setIntroText] = useState("");
    // const [introText, setIntroText] = useState("To complete the calibration process, please follow the dot. 🟢")

    // Different steps of target sizes to be tested
    const targetS = 100;
    const targetM = targetSize; // 168px , calculated min size required
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

    // const [currentValidationCount, setCurrentValidationCount] = useState(0);
    const currentValidationCount = useRef(0);
    // currentValidationCount.current = currentValidationCount;

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
    const TIMEOUT_INTRO = 2000;
    const INTERVAL_MEASUREMENT = 100;
    const TIMEOUT_TRANSITION = 1000;

    const [movementTimeout, setMovementTimeout] = useState(false);
    const [phaseStartedTimeout, setPhaseStartedTimeout] = useState(false);
    const [measurementInterval, setMeasurementInterval] = useState(false);



    useEffect(() => {
        // Perform calibration until it is complete 

        // Determine if a phase has already been started or has to be initialized
        if (!hasPhaseStarted) {
            if (!phaseStartedTimeout) {
                setPhaseStartedTimeout(true);
                setTimeout(() => {
                    let type = !calibrationComplete ? "CALIBRATION" : (!validationComplete ? "VALIDATION" : "QUESTIONNAIRE");
                    startPhase(type);
                    setPhaseStartedTimeout(false);
                }, TIMEOUT_INTRO);
            }

        } else {

            // Make sure to start click / measurement trigger only after transition of point has been completed
            if (!measurementInterval) {
                setMeasurementInterval(true);
                setTimeout(() => {
                    const measureInterval = setInterval(() => {
                        if (currentPhase === "CALIBRATION") {
                            click("calibrationPointCenter");
                        } else if (currentPhase === "VALIDATION") {
                            // Not working properly since refactoring of calibration structure
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
            // Start calibration or validation phase
        } else {
            setPointPositions(randomizePointPositions(pointPositions));
            setCurrentPhase(type);
            setHasPhaseStarted(true);
        }
        props.onPhaseChange(type);
    }

    // Move point to designated position and handle end of sequence 
    const handlePointMovement = () => {
        if (currentPoint + 1 === pointPositions.length) {
            handlePhaseEnd();

        } else {

            if (currentPhase === "VALIDATION") {

                updateAccuracyPerPoint();

                // console.log(currentValidationResultS + " out of " + currentValidationCount);
                // console.log(currentValidationResultM + " out of " + currentValidationCount);
                // console.log(currentValidationResultL + " out of " + currentValidationCount);
                console.log(currentValidationResultXL.current + " out of " + currentValidationCount.current);

                // setCurrentValidationCount(0);
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
            setIntroHeader("One more time! 💪")
            // setIntroText("Let's do this again one more time to validate the calibration. 🟢 ");

        } else if (currentPhase === "VALIDATION") {
            setValidationComplete(true);
            setIntroHeader("You did it! 🎉");
            setIntroText("");
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
    }

    // Compare if gaze and point position match and handle 
    const handleGazeValidation = () => {
        // Check if gaze lies within the target area (= targetSize - pointWidth)
        console.log("is anyone there?");

        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetS - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
            currentValidationResultS.current++;
        }

        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetM - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
            currentValidationResultM.current++;

        }

        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetL - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
            currentValidationResultL.current++;
        }


        // 0.5 targetSize - 0.25 point width == padding 
        if (isGazeWithinElement("calibrationPoint", 0.5 * targetXL - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
            console.log("FOUND ONE");
            currentValidationResultXL.current++;
        }
        currentValidationCount.current++;
    }



    const determineIntroColor = () => {
        if (!calibrationComplete) {
            return "#28666e";
        } else if (!validationComplete) {
            return "#28666e";
        } else {
            return "#28666e";
        }
    }


    return (

        <div id="calibration-container" style={{
            display: hasPhaseStarted ? "block" : "flex",
            "marginBottom": 0,
            "marginTop": 0,
            height: "100%",

        }}>
            <CalibrationPoint
                id={pointReference}
                phase={currentPhase}
                reference={pointReference}
                position={pointPositions[currentPoint]}
            />

            <div id="INTRO"
                style={{
                    display: hasPhaseStarted ? "none" : "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    padding: 40,
                    backgroundColor: determineIntroColor(),
                    height: "25%",
                    width: "60%",
                    margin: "auto",
                    borderRadius: 25,
                    boxShadow: "0 0 100px 3px rgba(136, 123, 153, 1.0)"
                }}>

                <p style={{
                    "textAlign": "center",
                    color: "#ffffff",
                    fontSize: 40,
                    lineHeight: 2,
                    fontWeight: "bold",
                    margin: 0
                }}>

                    {introHeader} </p>
                <p style={{
                    "textAlign": "center",
                    color: "#ffffff",
                    fontSize: 24,
                    lineHeight: 2,
                    fontWeight: "bold"
                }}>
                    {introText} </p>


            </div>

        </div>
    );

}

export default Calibration;