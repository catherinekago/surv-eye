import { useState, useEffect } from 'react';
import CalibrationPoint from "./CalibrationPoint";



const Calibration = (props) => {

    // To enable multiple rounds of calibration and determine whether a round has started
    const [hasRoundStarted, setHasRoundStarted] = useState(false);

    // To determine the values that relate to the current validation point
    const [currentPoint, setCurrentPoint] = useState(0);
    const [currentPhase, setCurrentPhase] = useState("INACTIVE");
    const [currentValidationResult, setCurrentValidationResult] = useState(0);
    const [currentValidationCount, setCurrentValidationCount] = useState(0);
    const [validationTotal, setValidationTotal] = useState(0);

    // To determine state of calibration and validation process and change of steps 
    const [calibrationComplete, setCalibrationComplete] = useState(false);
    const [validationComplete, setValidationComplete] = useState(false);

    const pointReference = "calibrationPoint";
    const pointWidth = 50 + 50  // margin of point 
    const headerHeight = 0;
    const calibrationWindowMarginBottom = 80;

    const [introHeader, setIntroHeader] = useState("Welcome to SurvEye!");
    const [introText, setIntroText] = useState("To complete the calibration process, please follow the dot. 🟣")



    // Absolute positions of all points
    const pointPositions = [
        { x: window.innerWidth / 2 - 0.5 * pointWidth, y: window.innerHeight / 3 - headerHeight },
        { x: 0, y: headerHeight },
        { x: window.innerWidth / 2 - 0.5 * pointWidth, y: headerHeight },
        { x: window.innerWidth - pointWidth, y: headerHeight },
        { x: 0, y: window.innerHeight / 3 },
        { x: window.innerWidth / 2 - 0.5 * pointWidth, y: window.innerHeight / 3 },
        { x: window.innerWidth - pointWidth, y: window.innerHeight / 3 },
        { x: 0, y: window.innerHeight / 3 + window.innerHeight / 3 },
        { x: window.innerWidth / 2 - 0.5 * pointWidth, y: window.innerHeight / 3 + window.innerHeight / 3 },
        { x: window.innerWidth - pointWidth, y: window.innerHeight / 3 + window.innerHeight / 3 },
        { x: window.innerWidth / 2 - 0.5 * pointWidth, y: window.innerHeight / 3 - headerHeight }];

    // To allow timing length of phases, length of start sequence, and intervals of actions
    const [lastMovementTime, setLastMovementTime] = useState(new Date().getTime());
    const [lastActionTime, setLastActionTime] = useState(new Date().getTime());
    const [isTransitionOver, setIsTransitionOver] = useState(false);
    const movementInterval = 4000;
    const introTime = 10000;
    const actionInterval = 100;
    const transitionInterval = 2000;



    useEffect(() => {
        // Perform calibration until it is complete 
        if (!calibrationComplete) {
            performCycle("CALIBRATION");
        } else if (!validationComplete) {
            performCycle("VALIDATION");
        } else if (calibrationComplete && validationComplete && currentPoint === 0) {
            setCurrentPhase("INACTIVE");
        }

    });


    // Perform click calibration cycle for all given points.
    const performCycle = (type) => {


        if (!hasRoundStarted) {
            startRound(type);
        } else {
            // Check if point should move to next position 
            handlePointMovement(type);

            // Check if new action (click or check) has to be taken 
            if (type === "CALIBRATION") {
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
                    console.log("Total validation " + validationTotal);
                    console.log("# of points: " + pointPositions.length);
                    let result = Math.round(validationTotal / pointPositions.length);
                    setValidationTotal(Math.round(validationTotal / pointPositions.length));
                    setIntroHeader("You did it! 🎉");
                    setIntroText("Your (tweaked) validation result is: " + result + "%");
                }
                setCurrentPhase("INACTIVE");

            } else {
                setCurrentPoint(currentPoint + 1);
                setIsTransitionOver(false);
                if (currentPhase === "VALIDATION") {
                    setValidationTotal(validationTotal + (currentValidationResult / currentValidationCount)*100);
                    console.log(currentValidationResult + " out of " + currentValidationCount);
                    setCurrentValidationCount(0);
                    setCurrentValidationResult(0);
                }
            }

        }
    }


    // Perform simulated click on the coordiantes of the point 
    const clickOnPoint = () => {
        let currentTime = new Date().getTime();
        if (isTransitionOver && currentTime - lastActionTime >= actionInterval) {
            setLastActionTime(currentTime);
            let calibrationPoint = document.getElementById("calibrationPoint");
            let pointXCenter = calibrationPoint.getBoundingClientRect().left + calibrationPoint.getBoundingClientRect().width * 0.5;
            let pointYCenter = calibrationPoint.getBoundingClientRect().top + calibrationPoint.getBoundingClientRect().width * 0.5;
            click(pointXCenter, pointYCenter);
        }
    }

    // Simulate a mouse click at given x and y coordinates
    const click = (x, y) => {
        var ev = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'screenX': x,
            'screenY': y,
            'clientX': x,
            'clientY': y
        });

        var el = document.elementFromPoint(x, y);
        el.dispatchEvent(ev);
    }

    // Compare if gaze and point position match and handle 
    const handleGazeValidation = () => {
        let currentTime = new Date().getTime();
        if (isTransitionOver && currentTime - lastActionTime >= actionInterval) {
            setLastActionTime(currentTime);
            if (isGazeWithinPoint()) {
                clickOnPoint();
                setCurrentValidationResult(currentValidationResult + 1);
            }
            console.log("validated");
            setCurrentValidationCount(currentValidationCount + 1);
        }
    }


    // Determine whether current gaze points lie within boundaries of the calibration point. 
    const isGazeWithinPoint = () => {
        let currentGazeX = props.context.x;
        let currentGazeY = props.context.y;

        let calibrationPoint = document.getElementById("calibrationPoint");

        let pointMinX = calibrationPoint.getBoundingClientRect().left - 50;
        let pointMinY = calibrationPoint.getBoundingClientRect().top - 50;
        let pointMaxX = calibrationPoint.getBoundingClientRect().right + 50;
        let pointMaxY = calibrationPoint.getBoundingClientRect().bottom + 50;

        let isGazeWithinButton = currentGazeX >= pointMinX && currentGazeX < pointMaxX && currentGazeY >= pointMinY && currentGazeY < pointMaxY

        return isGazeWithinButton;

    }

    const determineIntroColor = () => {
        if (!calibrationComplete) {
            return "#4d194d";
        } else if (!validationComplete) {
            return "#006466";
        } else {
            return "#272640";
        }
    }


return (

    <div style={{
        display: hasRoundStarted ? "block" : "flex",
        "marginBottom": calibrationWindowMarginBottom,
        height: "80vh",
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