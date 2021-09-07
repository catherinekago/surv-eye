import RadioButtonRect from "./RadioButtonRect.js";
import { WebGazeContext } from '../../context/WebGazeContext';
import Ruler from '../ruler/Ruler.js';

import './radiobuttongrouprect.css'


const RadioButtonGroup = (props) => {

    const onSelection = (value) => {
        props.setItemValue(value);
    }

    const LABELS = ["Strongly agree", "Agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Disagree", "Strongly Disagree"];
    const RADIOBUTTONCOUNT = [1, 2, 3, 4, 5, 6, 7];

    const radioButtons = (context) => RADIOBUTTONCOUNT.map((radiobutton) =>
        <RadioButtonRect
            idTarget={"radio-target-rect-" + radiobutton}
            idLabel={"radio-label-rect-" + radiobutton}
            idFill={"radio-fill-rect-" + radiobutton}
            value={radiobutton}
            selected={props.value}
            target={props.target}
            label={LABELS[radiobutton - 1]}
            onFixation={onSelection}
            context={context}
        />
    )

return (
    <WebGazeContext.Consumer >
        {context => (
            <div id="RULER-CONTAINER">
                <Ruler />

                <div id="RADIO-BUTTON-GROUP-RECT-CONTAINER">
                    {radioButtons(context)}

                </div>
            </div>

        )}
    </WebGazeContext.Consumer>

);
}

export default RadioButtonGroup;