import { useState, useEffect } from 'react';
import CalibrationPoint from "./CalibrationPoint";



const Calibration = (props) => {

    // To enable multiple rounds of calibration and determine whether a round has started
    const [currentRound, setCurrentRound] = useState(2);
    const [hasRoundStarted, setHasRoundStarted] = useState(false);

    // To determine the values that relate to the current validation point
    const [currentPoint, setCurrentPoint] = useState(0);
    const [currentPhase, setCurrentPhase] = useState("INACTIVE");
    const [currentValidationResult, setCurrentValidationResult] = useState(0);
    const [currentClickCount, setCurrentClickCount] = useState(0);
    const requiredClickCount = 100;
    const [currentValidationCount, setCurrentValidationCount] = useState(0);
    const [validationTotal, setValidationTotal] = useState(0);

    // To determine state of calibration and validation process and change of steps 
    const [changePhase, setChangePhase] = useState("false");
    const [calibrationComplete, setCalibrationComplete] = useState(false);
    const [validationComplete, setValidationComplete] = useState(false);

    const pointReference = "calibrationPoint";


    // Justify content (row) and align items (column): flex-start, center, flex-end
    const pointPositions = [
        { justifyContent: "center", alignItems: "center" },
        { justifyContent: "flex-start", alignItems: "flex-start" },
        { justifyContent: "center", alignItems: "flex-start" },
        { justifyContent: "flex-end", alignItems: "flex-start" },
        { justifyContent: "flex-start", alignItems: "center" },
        { justifyContent: "center", alignItems: "center" },
        { justifyContent: "flex-end", alignItems: "center" },
        { justifyContent: "flex-start", alignItems: "flex-end" },
        { justifyContent: "center", alignItems: "flex-end" },
        { justifyContent: "flex-end", alignItems: "flex-end" }];

    const [pointLabel, setPointLabel] = useState("Please look at the emerging points until they disappear. 👀");


    // To allow timing length of phases, length of start sequence, and intervals of validation 
    const [lastTimePhase, setLastTimePhase] = useState(new Date().getTime());
    const [lastTimeValidation, setLastTimeValidation] = useState(new Date().getTime());
    const phaseInterval = 2000;
    const startInterval = 5000;
    const validationInterval = 10; 





    useEffect(() => {
        // Perform calibration until it is complete 
        if (!calibrationComplete) {
            performCalibration();
        } else if (calibrationComplete && !validationComplete) {
            performValidation();
        }

    });


    // Perform click calibration cycle for all given points.
    const performCalibration = () => {

        let currentTime = new Date().getTime();
        let interval;

        // If calibration has not started yet, apply longer interval to give user time to look at point. 
        if (currentPoint === 0 && !hasRoundStarted) {
            interval = startInterval;
        } else {
            interval = phaseInterval;
        }

        // If required interval has passed, set change indicator to true
        if (currentTime - lastTimePhase >= interval) {
            setHasRoundStarted(true);
            setLastTimePhase(currentTime);
            setPointLabel("");
            setChangePhase(true);
            // Change phase to click-click if it was inactive 
            if (currentPhase === "INACTIVE") {
                setCurrentPhase("CLICK-CLICK");
                setPointLabel("CALIBRATING")
                // Change phase to inactive if it was click-click
            } else {
                setCurrentPhase("INACTIVE");
                setPointLabel("PREPARE");
                setCurrentClickCount(0);
                // Stop calibration process if last point has been reached.
                if (currentPoint + 1 === pointPositions.length) {
                    setCurrentPoint(0);
                    if (currentRound == 2) {
                        setCalibrationComplete(true);
                        setPointLabel("🎉 CALIBRATION COMPLETE  🎉");
                        setHasRoundStarted(false);
                        setCurrentRound(1);
                    } else {
                        setCurrentRound(2);
                    }

                } else {
                    setCurrentPoint(currentPoint + 1);
                }
            }

            // If change indicator is true and new phase is click-click, perform simulated click at the calibration point's position
        } else if (currentPhase === "CLICK-CLICK") {
            // If change indicator indicates recent change to click-click, set change indicator to false
            if (changePhase) {
                setChangePhase(false);
                // To do: set counter for 100 ms to pass for gaze transition buffer 
            }
            // Only perform click if required click number has not yet been reached
            if (currentClickCount < requiredClickCount) {
                clickOnPoint(); 
                setCurrentClickCount(currentClickCount + 1);
            }

        }
    }

    const clickOnPoint = () => {
        let calibrationPoint = document.getElementById("calibrationPoint");
        let pointXCenter = calibrationPoint.getBoundingClientRect().left + calibrationPoint.getBoundingClientRect().width * 0.5;
        let pointYCenter = calibrationPoint.getBoundingClientRect().top + calibrationPoint.getBoundingClientRect().width * 0.5;
        click(pointXCenter, pointYCenter);
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
        //   console.log(el);
        el.dispatchEvent(ev);
    }

    const performValidation = () => {

        let currentTime = new Date().getTime();
        let interval;

        // If calibration has not started yet, apply longer interval to give user time to look at point. 
        if (currentPoint === 0 && !hasRoundStarted) {
            interval = startInterval;
            setPointLabel("Please look at the points again until they turn green 👀💚");
        } else {
            interval = phaseInterval;
        }

        // If required interval has passed, set change indicator to true
        if (currentTime - lastTimePhase >= interval) {
            setHasRoundStarted(true);
            setLastTimePhase(currentTime);
            setPointLabel("");
            setChangePhase(true);
            // Change phase to look-look if it was inactive 
            if (currentPhase === "INACTIVE") {
                setCurrentPhase("LOOK-LOOK");
                setPointLabel("VALIDATING");
                // Change phase to accuracy-result if it was look-look
            } else if (currentPhase === "LOOK-LOOK") {
                setCurrentPhase("ACCURACY-RESULT");
                setPointLabel("Accuracy: " + currentValidationResult + " of "  + currentValidationCount )
                setValidationTotal(validationTotal + (currentValidationResult / currentValidationCount * 100));
                console.log("Total counts: "+ currentValidationCount);
                console.log("New total result: " + validationTotal);
                // Change phase to inactive if it was accuracy-result
            } else {
                setCurrentPhase("INACTIVE");
                setPointLabel("PREPARE");
                setCurrentValidationResult(0);
                setCurrentValidationCount(0);
                // Stop calibration process if last point has been reached.
            if (currentPoint + 1 === pointPositions.length) {

                setValidationComplete(true);
                setPointLabel("🎉 Validation COMPLETE  🎉");
                setCurrentPoint(0);
                setCurrentPhase("INACTIVE");
                setValidationTotal(Math.round(( validationTotal / pointPositions.length + Number.EPSILON ) * 100 ) / 100);
            } else {
                setCurrentPoint(currentPoint + 1);
            }
            }


            // If change indicator is true and new phase is look-look, perform validation
        } else if (currentPhase === "LOOK-LOOK") {
            // If change indicator indicates recent change to look-look, set change indicator to false
            if (changePhase) {
                setChangePhase(false);
                // To do: set counter for 100 ms to pass for gaze transition buffer 
            }
            // Only perform click if required click number has not yet been reached
            let currentTime = new Date().getTime();
            if (currentTime - lastTimeValidation >= validationInterval) {
                setLastTimeValidation(currentTime);
                if (isGazeWithinPoint()) {
                    clickOnPoint(); 
                    setCurrentValidationResult(currentValidationResult+1);
                } 
                setCurrentValidationCount(currentValidationCount + 1);
            }
        }
    }

    // Determine whether current gaze points lie within boundaries of the calibration point. 
    const isGazeWithinPoint = () => {
        let currentGazeX = props.context.x;
        let currentGazeY = props.context.y;

        let calibrationPoint = document.getElementById("calibrationPoint");

        let pointMinX = calibrationPoint.getBoundingClientRect().left -50;
        let pointMinY = calibrationPoint.getBoundingClientRect().top -50 ;
        let pointMaxX = calibrationPoint.getBoundingClientRect().right +50;
        let pointMaxY = calibrationPoint.getBoundingClientRect().bottom +50;

        let isGazeWithinButton = currentGazeX >= pointMinX && currentGazeX < pointMaxX && currentGazeY >= pointMinY && currentGazeY < pointMaxY

        return isGazeWithinButton;

    }

    return (

        <div style={{
            display: "flex",
            "flexDirection": "row",
            "paddingLeft": 40,
            "paddingight": 40,
            "justifyContent": pointPositions[currentPoint].justifyContent,
            "alignItems": pointPositions[currentPoint].alignItems,
            height: "80vh"
        }}>
            <CalibrationPoint
                id={pointReference}
                phase={currentPhase}
                reference={pointReference}
                position={pointPositions[currentPoint]}
                label={pointLabel} />

            {validationComplete ?
                <p>{"Validation Result: " + validationTotal + "%"} </p>
                : null}

        </div>
    );

}

export default Calibration;