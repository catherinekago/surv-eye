import RadioButton from "./RadioButton.js";
import { WebGazeContext } from './context/WebGazeContext';

import './css/radiobuttongroup.css'

const RadioButtonGroup = (props) => {

    const onSelection = (value) => {
        props.setItemValue(value);
    }

    return (
        <WebGazeContext.Consumer >
            {context => (
                <div id="radio-button-group-container">
                    <RadioButton
                        idTarget="radio-target-1"
                        idOutlineCircle="radio-outline-1"
                        idSelectionCircle="radio-button-1"
                        value="1"
                        selected={props.value}
                        label="Strongly agree"
                        icon="++"
                        onFixation={onSelection}
                        context={context}
                        color="#9b2226"
                    />

                    <RadioButton
                        idTarget="radio-target-2"
                        idOutlineCircle="radio-outline-2"
                        idSelectionCircle="radio-button-2"
                        value="2"
                        selected={props.value}
                        label="Agree"
                        icon="+"
                        onFixation={onSelection}
                        context={context}
                        color="#B96467"
                    />

                    <RadioButton
                        idTarget="radio-target-3"
                        idOutlineCircle="radio-outline-3"
                        idSelectionCircle="radio-button-3"
                        value="3"
                        selected={props.value}
                        label="Neutral"
                        icon="0"
                        onFixation={onSelection}
                        context={context}
                        color="#b2b2b2"

                    />

                    <RadioButton
                        idTarget="radio-target-4"
                        idOutlineCircle="radio-outline-4"
                        idSelectionCircle="radio-button-4"
                        value="4"
                        selected={props.value}
                        label="Disagree"
                        icon="-"
                        onFixation={onSelection}
                        context={context}
                        color="#64b9b6"
                    />

                    <RadioButton
                        idTarget="radio-target-5"
                        idOutlineCircle="radio-outline-5"
                        idSelectionCircle="radio-button-5"
                        value="5"
                        selected={props.value}
                        label="Strongly disagree"
                        icon="--"
                        onFixation={onSelection}
                        context={context}
                        color="#15989e"
                    />

                </div>

            )}
        </WebGazeContext.Consumer>

    );
}

export default RadioButtonGroup;