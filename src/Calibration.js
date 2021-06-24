import { useState, useEffect } from 'react';
import CalibrationPoint from "./CalibrationPoint";
import { WebGazeContext } from './WebGazeContext';


const Calibration = (props) => {
    const [currentPoint, setCurrentPoint] = useState(0);
    const [currentPhase, setCurrentPhase] = useState("INACTIVE");
    const [changePhase, setChangePhase] = useState("false");
    const [currentPointClickCount, setCurrentPointClickCount] = useState(0);

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

    // const validationResults = [];

    const [currentPointResult, setCurrentPointResult] = useState("Please look at the emerging points until they disappear. 👀");

    const [lastTime, setLastTime] = useState(new Date().getTime());
    const phaseInterval = 2000;
    const startInterval = 5000; 
    const requiredClickNum = 50; 


    useEffect(() => {
        // Perform calibration until it is complete 
        if (!calibrationComplete) {
            performCalibration(); 
        } else if (calibrationComplete && !validationComplete) {
            // console.log("Lets validate!");
        }
    });


    // Perform click calibration cycle for all given points.
    const performCalibration = () => {

        let currentTime = new Date().getTime(); 
        let interval; 

        // If calibration has not started yet, apply longer interval to give user time to look at point. 
        if (currentPoint === 0) {
            interval = startInterval;
        } else {
            interval = phaseInterval; 
        }

        // If required interval has passed, set change indicator to true
        if (currentTime - lastTime > interval) {
            setLastTime(currentTime);
            setCurrentPointResult("");
            setChangePhase(true);
            // Change phase to click-click if it was inactive 
            if (currentPhase === "INACTIVE") {
                setCurrentPhase("CLICK-CLICK");
                setCurrentPointResult("CALIBRATING")
            // Change phase to inactive if it was click-click
            } else {
                setCurrentPhase("INACTIVE");
                setCurrentPointResult("PREPARE");
                setCurrentPointClickCount(0);
                // Stop calibration process if last point has been reached.
                if (currentPoint+1 === pointPositions.length) {
                    setCalibrationComplete(true);
                    setCurrentPointResult("🎉 CALIBRATION COMPLETE  🎉");
                    setCurrentPoint(0);
                } else {
                    setCurrentPoint(currentPoint+1);
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
            if (currentPointClickCount < requiredClickNum) {
                let calibrationPoint = document.getElementById("calibrationPoint");
                let pointXCenter = calibrationPoint.getBoundingClientRect().left + calibrationPoint.getBoundingClientRect().width*0.5;
                let pointYCenter = calibrationPoint.getBoundingClientRect().top + calibrationPoint.getBoundingClientRect().width*0.5;
                click(pointXCenter, pointYCenter);
                setCurrentPointClickCount(currentPointClickCount+1);
            }

        }
    }

    // Simulate a mouse click at given x and y coordinates
    const click = (x,y) => {
        var ev = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true,
          'screenX': x,
          'screenY':y,
        'clientX': x,
          'clientY': y
      });

      var el = document.elementFromPoint(x, y);
    //   console.log(el);
      el.dispatchEvent(ev);
    }

    return (

        <div style={{
            display: "flex",
            "paddingLeft": 40,
            "paddingight": 40,
            "justifyContent": pointPositions[currentPoint].justifyContent,
            "alignItems": pointPositions[currentPoint].alignItems,
            height: "80vh"
        }}>
        <WebGazeContext.Consumer>
            {context => (
             <CalibrationPoint
                id = {pointReference}
                phase={currentPhase}
                reference={pointReference}
                position={pointPositions[currentPoint]}
                result={currentPointResult}
            /> )}
        </WebGazeContext.Consumer>
        </div>
    );

}
    
export default Calibration;