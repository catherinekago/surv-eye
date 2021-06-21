import { findByLabelText } from '@testing-library/react';
import {useState} from 'react';
import CalibrationPoint from "./CalibrationPoint";


const Calibration = (props) => {
    const [currentPoint, setCurrentPoint] = useState(0);
    const [currentPhase, setCurrentPhase] = useState("CLICK-CLICK")

    const pointReferences = ["calibrationpoint01"];


    // Justify content (row) and align items (column): flex-start, center, flex-end
    const pointPositions = [{justifyContent: "center", alignItems: "center"}];
    const calibrationResults = [];

    const [currentPointResult, setCurrentPointResult] = useState("");

    const [gazeTime, setGazeTime] = useState(new Date().getTime());
    const phaseInterval = 30; 
    


    return ( 

        <div style = {{
            display: "flex", 
            "padding-left": 40, 
            "padding-right": 40,
            "justify-content" : pointPositions[currentPoint].justifyContent,
            "alignItems": pointPositions[currentPoint].alignItems,
            height: "80vh" }}>

            <CalibrationPoint 
            phase = {currentPhase} 
            reference = {pointReferences[currentPoint]}
            position = {pointPositions[currentPoint]}
            result = {currentPointResult}
            />
        </div>
    );

}

export default Calibration;