import {useRef} from "react";

import { WebGazeContext } from './WebGazeContext';
import './calibrationpoint.css';

const CalibrationPoint = (props) => {

let display = props.phase === "INACTIVE" ? "none" : "block";
const reference = useRef(props.reference);

    return (
        <WebGazeContext.Consumer>
            {context => (
                <div style={{display:"flex", margin:"40px", "flexDirection": "column",  justifyContent: "center", alignItems:"center"}}>
                    <button id= "calibrationPoint" style={{display: display}} ref={reference} className={props.phase}></button>
                    <p style={{display:"flex"}}>{props.result}</p>
                </div >
            )}

        </WebGazeContext.Consumer>
    );

}

export default CalibrationPoint;