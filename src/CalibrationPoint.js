import {useRef} from "react";

import { WebGazeContext } from './WebGazeContext';
import './calibrationpoint.css';

const CalibrationPoint = (props) => {

let display = props.phase === "INACTIVE" ? "none" : "block";
const reference = useRef(props.reference);

    return (
        <WebGazeContext.Consumer>
            {context => (
                    <button id= "calibrationPoint" style={{
                        display: display,
                        margin:"25px", 
                        position: "absolute",
                        transform: "translate(" + props.position.x +"px," + props.position.y + "px)"

                    }} ref={reference} className={props.phase}></button>
            )}

        </WebGazeContext.Consumer>
    );

}

export default CalibrationPoint;