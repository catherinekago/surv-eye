import RadioButtonRound from "./RadioButtonRound.js";
import { WebGazeContext } from '../../context/WebGazeContext';
import {useState} from "react";

import './radiobuttongroupround.css'

const RadioButtonGroup = (props) => {

    const [lineMargin, setLineMargin] = useState("0px");

    const onSelection = (value) => {
        props.setItemValue(value);
    }

    const LABELS = ["Strongly agree", "Agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Disagree", "Strongly Disagree"];
    const RADIOBUTTONCOUNT = [1, 2, 3, 4, 5, 6, 7];

    const radioButtons = (context) => RADIOBUTTONCOUNT.map((radiobutton) =>
        <RadioButtonRound
            isInspectionArea= {props.isInspectionArea}
            idTarget={props.isInspectionArea ? "": "radio-target-round-" + radiobutton}
            idLabel={ props.isInspectionArea ? "" : "radio-label-round-" + radiobutton}
            idSelectionCircle= { props.isInspectionArea ? "" : "radio-fill-round-" + radiobutton}
            idOutlineCircle={props.isInspectionArea ? "radio-outline-inspection-round-" + radiobutton : "radio-outline-round-" + radiobutton}
            value={"" + radiobutton}
            selected={props.value}
            label={LABELS[radiobutton - 1]}
            onFixation={props.isInspectionArea ? "" : onSelection}
            context={context}
            setWidth={setLineMargin}
        />
    )

    return (
        <WebGazeContext.Consumer >
            {context => (
                <div id="RADIO-BUTTON-GROUP-ROUND-CONTAINER">
                    {radioButtons(context)}
                    <div style={{marginTop: lineMargin}} class="connecting-line" />
                </div>

            )}
        </WebGazeContext.Consumer>

    );
}

export default RadioButtonGroup;