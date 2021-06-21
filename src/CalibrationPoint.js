import {useRef} from "react";

import { WebGazeContext } from './WebGazeContext';
import './calibrationpoint.css';

const CalibrationPoint = (props) => {

let display = props.phase === "INACTIVE" ? "none" : "flex";
const reference = useRef(props.reference);



    return (
        <WebGazeContext.Consumer>
            {context => (
                <div style={{display: display, "flex-direction": "column", alignItems: "center", justifyContent: props.position.justifyContent}}>
                    <button ref={reference} className={props.phase} onClick={() => console.log(context.x + " " + context.y)}></button>
                    <p>{props.result === "" ? props.phase : props.result}</p>
                </div >
            )}

        </WebGazeContext.Consumer>
    );

}

export default CalibrationPoint;