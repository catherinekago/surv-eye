import { useState, useEffect } from 'react';
import CalibrationPoint from "./CalibrationPoint";


const Calibration = (props) => {
    const [currentPoint, setCurrentPoint] = useState(0);
    const [currentPhase, setCurrentPhase] = useState("CLICK-CLICK")
    const [calibrationComplete, setCalibrationComplete] = useState(false);

    const pointReference = "calibrationPoint";


    // Justify content (row) and align items (column): flex-start, center, flex-end
    const pointPositions = [{ justifyContent: "flex-start", alignItems: "center" }, { justifyContent: "center", alignItems: "center" }, { justifyContent: "flex-end", alignItems: "center" }];
    const calibrationResults = [];

    const [currentPointResult, setCurrentPointResult] = useState("");

    const [gazeTime, setGazeTime] = useState(new Date().getTime());
    const phaseInterval = 3000;


    useEffect(() => {
        if (!calibrationComplete) {
            // calibrationCycle();
        }
    });

    const calibrationCycle = () => {
        while (currentPoint < pointPositions.length) {
            let currentTime = new Date().getTime();
            if (currentTime > gazeTime + phaseInterval) {
                setGazeTime(currentTime);
                if (currentPhase === "CLICK-CLICK") {
                    setCurrentPhase("INACTIVE");
                    setCurrentPointResult(currentPoint + " completed click calibration");
                } else if (currentPhase === "INACTIVE") {
                    calibrationResults.push(currentPointResult);
                    setCurrentPointResult("");
                    setCurrentPoint(currentPoint + 1);
                    setCurrentPhase("CLICK-CLICK");
                }
            }
        }
        console.log(calibrationResults);
        setCalibrationComplete(true);
    }


    return (

        <div style={{
            display: "flex",
            "padding-left": 40,
            "padding-right": 40,
            "justify-content": pointPositions[currentPoint].justifyContent,
            "alignItems": pointPositions[currentPoint].alignItems,
            height: "80vh"
        }}>

            <CalibrationPoint
                phase={currentPhase}
                reference={pointReference}
                position={pointPositions[currentPoint]}
                result={currentPointResult}
            />

        </div>
    );

}

export default Calibration;