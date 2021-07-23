import { useState, useEffect } from 'react';
import CalibrationPoint from "./CalibrationPoint";
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';
import { convertAngleToPx } from './functions/convertAngleToPx';

const Calibration = (props) => {

    // To enable multiple rounds of calibration and determine whether a round has started
    const [hasRoundStarted, setHasRoundStarted] = useState(false);

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
    const [introText, setIntroText] = useState("To complete the calibration process, please follow the dot. 🟢")

    // Different steps of target sizes to be tested
    const targetS = 100;
    const targetM = targetSize; // 168px , calculated min size required
    const targetL = 200;
    const targetXL = 300;

    const [currentValidationResultS, setCurrentValidationResultS] = useState(0);
    const [validationTotalS, setValidationTotalS] = useState(0);

    const [currentValidationResultM, setCurrentValidationResultM] = useState(0);
    const [validationTotalM, setValidationTotalM] = useState(0);

    const [currentValidationResultL, setCurrentValidationResultL] = useState(0);
    const [validationTotalL, setValidationTotalL] = useState(0);

    const [currentValidationResultXL, setCurrentValidationResultXL] = useState(0);
    const [validationTotalXL, setValidationTotalXL] = useState(0);

    const [currentValidationCount, setCurrentValidationCount] = useState(0);

    // Format: {x: , y: , accuracyS: , accuracyM: , accuracyL: , accuracyXL: }
    const [accuracyPerPoint, setAccuracyPerPoint] = useState([]);



    //     // Absolute positions of all points, relative positioning according to screen width and height 
    //     const [pointPositions, setPointPositions] = useState([
    //         { x: 0, y: 0 },
    //         { x: window.innerWidth * 0.25 - 0.5 * pointWidth, y: 0 },    
    //         { x: window.innerWidth * 0.5 - 0.5 * pointWidth, y: 0 },
    //         { x: window.innerWidth * 0.75 - 0.5 * pointWidth, y: 0 }, 
    //         { x: window.innerWidth - pointWidth, y: 0},

    //         { x: 0, y: window.innerHeight * (3/9) - 0.5 * pointWidth},
    //         { x: window.innerWidth * 0.25 - 0.5 * pointWidth, y: window.innerHeight * (3/9) - 0.5 * pointWidth },  
    //         { x: window.innerWidth * 0.5 - 0.5 * pointWidth, y: window.innerHeight * (3/9) - 0.5 * pointWidth},
    //         { x: window.innerWidth * 0.75 - 0.5 * pointWidth, y: window.innerHeight * (3/9) - 0.5 * pointWidth}, 
    //         { x: window.innerWidth - pointWidth, y: window.innerHeight * (3/9) - 0.5 * pointWidth},

    //         { x: 0, y: window.innerHeight * (5/9) - 0.5 * pointWidth},
    //         { x: window.innerWidth * 0.25 - 0.5 * pointWidth, y: window.innerHeight * (5/9) - 0.5 * pointWidth },  
    //         { x: window.innerWidth * 0.5 - 0.5 * pointWidth, y: window.innerHeight * (5/9) - 0.5 * pointWidth},
    //         { x: window.innerWidth * 0.75 - 0.5 * pointWidth, y: window.innerHeight * (5/9) - 0.5 * pointWidth}, 
    //         { x: window.innerWidth - pointWidth, y: window.innerHeight * (5/9) - 0.5 * pointWidth},

    //         { x: 0, y: window.innerHeight - pointWidth}, 
    //         { x: window.innerWidth * 0.25 - 0.5 * pointWidth, y: window.innerHeight - pointWidth}, 
    //         { x: window.innerWidth * 0.5 - 0.5 * pointWidth, y: window.innerHeight  - pointWidth},
    //         { x: window.innerWidth * 0.75 - 0.5 * pointWidth, y: window.innerHeight  - pointWidth}, 
    //         { x: window.innerWidth - pointWidth, y: window.innerHeight - pointWidth},
    // ]);


    // // 9x9 Calibration Grid
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

    // 16x16 calibration Grid
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
    const [lastMovementTime, setLastMovementTime] = useState(new Date().getTime());
    const [lastActionTime, setLastActionTime] = useState(new Date().getTime());
    const [isTransitionOver, setIsTransitionOver] = useState(false);
    const movementInterval = 3000;
    const introTime = 2000;
    const actionInterval = 100;
    const transitionInterval = 1000;



    useEffect(() => {
        // Perform calibration until it is complete 
        if (!calibrationComplete) {
            performCycle("CALIBRATION");
        } else if (!validationComplete) {
            performCycle("VALIDATION");
        } else if (calibrationComplete && validationComplete && currentPoint === 0) {
            handleSwitchToQuestionnaire();
        }

    });

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

    // Perform click calibration cycle for all given points.
    const performCycle = (type) => {


        if (!hasRoundStarted) {
            startRound(type);
        } else {
            // Check if point should move to next position 
            handlePointMovement(type);

            // Check if new action (click or check) has to be taken 
            if (type === "CALIBRATION") {
                // console.log(pointPositions[currentPoint]);
                clickOnPoint();
            } else if (type === "VALIDATION") {
                handleGazeValidation();
            }
        }
    }

    // Start cycle 
    const startRound = (type) => {
        let currentTime = new Date().getTime();
        if (currentTime - lastMovementTime >= introTime) {
            setPointPositions(randomizePointPositions(pointPositions));
            setLastMovementTime(currentTime);
            setCurrentPhase(type);
            setHasRoundStarted(true);
        }


    }


    // Move point to designated position and handle end of sequence 
    const handlePointMovement = () => {
        let currentTime = new Date().getTime();
        if (currentTime - lastMovementTime >= transitionInterval) {
            setIsTransitionOver(true);
        }
        if (currentTime - lastMovementTime >= movementInterval) {
            setLastMovementTime(currentTime);
            if (currentPoint + 1 === pointPositions.length) {
                setCurrentPoint(0);
                setHasRoundStarted(false);
                if (currentPhase === "CALIBRATION") {
                    setCalibrationComplete(true);
                    setIntroHeader("Good job! 💪")
                    setIntroText("Let's do this again one more time to validate the calibration. 🟢 ");
                } else if (currentPhase === "VALIDATION") {
                    setValidationComplete(true);
                    // console.log("Total validation " + validationTotalL);
                    // console.log("# of points: " + pointPositions.length);

                    let resultS = Math.round(validationTotalS / pointPositions.length);
                    let resultM = Math.round(validationTotalM / pointPositions.length);
                    let resultL = Math.round(validationTotalL / pointPositions.length);
                    let resultXL = Math.round(validationTotalXL / pointPositions.length);

                    setValidationTotalS(resultS);
                    setValidationTotalM(resultM);
                    setValidationTotalL(resultL);
                    setValidationTotalL(resultXL);

                    // add final percentage of accuracy to array
                    let newAccuracyArray = accuracyPerPoint;
                    // Format: {x: , y: , accuracyS: , accuracyM: , accuracyL: , accuracyXL: }
                    newAccuracyArray.push({ x: "TOTAL", y: "TOTAL", accuracyS: resultS / 100, accuracyM: resultM / 100, accuarcyL: resultL / 100, accuracyXL: resultXL / 100 });
                    setAccuracyPerPoint(newAccuracyArray);

                    setIntroHeader("You did it! 🎉");
                    setIntroText("Your validation result is: " + resultM + "%");
                    setLastMovementTime(currentTime);

                    // log calibration data to console to copy out 
                    console.log(accuracyPerPoint);

                }
                setCurrentPhase("INACTIVE");
            } else {

                if (currentPhase === "VALIDATION") {

                    // add for each point percentage of accuracy to array
                    let newAccuracyArray = accuracyPerPoint;
                    newAccuracyArray.push({ x: pointPositions[currentPoint].x, y: pointPositions[currentPoint].y, accuracyS: currentValidationResultS / currentValidationCount, accuracyM: currentValidationResultM / currentValidationCount, accuarcyL: currentValidationResultL / currentValidationCount, accuracyXL: currentValidationResultXL / currentValidationCount });
                    setAccuracyPerPoint(newAccuracyArray);

                    setValidationTotalS(validationTotalS + (currentValidationResultS / currentValidationCount) * 100);
                    setValidationTotalM(validationTotalM + (currentValidationResultM / currentValidationCount) * 100);
                    setValidationTotalL(validationTotalL + (currentValidationResultL / currentValidationCount) * 100);
                    setValidationTotalXL(validationTotalXL + (currentValidationResultXL / currentValidationCount) * 100);

                    console.log(currentValidationResultM + " out of " + currentValidationCount);

                    setCurrentValidationCount(0);

                    setCurrentValidationResultS(0);
                    setCurrentValidationResultM(0);
                    setCurrentValidationResultL(0);
                    setCurrentValidationResultXL(0);
                }

                setCurrentPoint(currentPoint + 1);
                setIsTransitionOver(false);
            }

        }
    }


    // Perform simulated click on the coordiantes of the point 
    const clickOnPoint = () => {
        let currentTime = new Date().getTime();
        if (isTransitionOver && currentTime - lastActionTime >= actionInterval) {
            setLastActionTime(currentTime);
            click("calibrationPointCenter");
        }
    }

    // Compare if gaze and point position match and handle 
    const handleGazeValidation = () => {
        let currentTime = new Date().getTime();
        if (isTransitionOver && currentTime - lastActionTime >= actionInterval) {
            setLastActionTime(currentTime);
            // Check if gaze lies within the target area (= targetSize - pointWidth)

            // 0.5 targetSize - 0.25 point width == padding 
            if (isGazeWithinElement("calibrationPoint", 0.5 * targetS - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
                setCurrentValidationResultS(currentValidationResultS + 1);
            }

            // 0.5 targetSize - 0.25 point width == padding 
            if (isGazeWithinElement("calibrationPoint", 0.5 * targetM - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
                setCurrentValidationResultM(currentValidationResultM + 1);
            }

            // 0.5 targetSize - 0.25 point width == padding 
            if (isGazeWithinElement("calibrationPoint", 0.5 * targetL - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
                setCurrentValidationResultL(currentValidationResultL + 1);
            }

            // 0.5 targetSize - 0.25 point width == padding 
            if (isGazeWithinElement("calibrationPoint", 0.5 * targetXL - 0.5 * 0.5 * pointWidth, props.context.x, props.context.y)) {
                setCurrentValidationResultXL(currentValidationResultXL + 1);
            }
            setCurrentValidationCount(currentValidationCount + 1);
        }
    }

    const handleSwitchToQuestionnaire = () => {
        let currentTime = new Date().getTime();
        if (currentTime - lastMovementTime >= introTime) {
            props.onCalibrationComplete(false);
        }

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
            display: hasRoundStarted ? "block" : "flex",
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
                    display: hasRoundStarted ? "none" : "flex",
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