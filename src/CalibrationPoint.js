import {useRef} from "react";

import { WebGazeContext } from './WebGazeContext';
import './css/calibrationpoint.css';

const CalibrationPoint = (props) => {

let display = props.phase === "INACTIVE" ? "none" : "flex";
const reference = useRef(props.reference);

    return (
        <WebGazeContext.Consumer>
            {context => (
                <div style = {{
                    display: display, 
                    margin:"25px",
                    position: "absolute",
                    alignContent: "center",
                    justifyContent: "center",
                    transform: "translate(" + props.position.x +"px," + props.position.y + "px)"}}
                    className={props.phase}
                    id= {props.reference}
                    ref={reference}
                    >
                <button id="calibrationPointCenter"></button>
                </div>


            )}

        </WebGazeContext.Consumer>
    );

}

export default CalibrationPoint;