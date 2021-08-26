import RadioButtonRound from "./RadioButtonRound.js";
import { WebGazeContext } from '../../context/WebGazeContext';

import './radiobuttongroupround.css'

const RadioButtonGroup = (props) => {

    const onSelection = (value) => {
        props.setItemValue(value);
    }

    const LABELS = ["Strongly agree", "Agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Disagree", "Strongly Disagree"];
    const RADIOBUTTONCOUNT = [1, 2, 3, 4, 5, 6, 7];

    const radioButtons = (context) => RADIOBUTTONCOUNT.map((radiobutton) =>
        <RadioButtonRound
            isInspectionArea= {props.isInspectionArea}
            idTarget={props.isInspectionArea ? "radio-target-inspection-round-" + radiobutton : "radio-target-round-" + radiobutton}
            idLabel={ props.isInspectionArea ? "" : "radio-label-round-" + radiobutton}
            idSelectionCircle= { props.isInspectionArea ? "" : "radio-fill-round-" + radiobutton}
            idOutlineCircle={props.isInspectionArea ? "radio-outline-inspection-round-" + radiobutton : "radio-outline-round-" + radiobutton}
            value={"" + radiobutton}
            selected={props.value}
            label={LABELS[radiobutton - 1]}
            onFixation={props.isInspectionArea ? "" : onSelection}
            context={context}
        />
    )

    return (
        <WebGazeContext.Consumer >
            {context => (
                <div id="RADIO-BUTTON-GROUP-ROUND-CONTAINER">
                    {radioButtons(context)}
                </div>

            )}
        </WebGazeContext.Consumer>

    );
}

export default RadioButtonGroup;