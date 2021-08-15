import RadioButtonRound from "./RadioButtonRound.js";
import { WebGazeContext } from '../../context/WebGazeContext';

import './radiobuttongroupround.css'

const RadioButtonGroup = (props) => {

    const onSelection = (value) => {
        props.setItemValue(value);
    }

    return (
        <WebGazeContext.Consumer >
            {context => (
                <div id="radio-button-group-container">
                    <RadioButtonRound
                        idTarget="radio-target-1"
                        idOutlineCircle="radio-outline-1"
                        idSelectionCircle="radio-button-1"
                        value="1"
                        selected={props.value}
                        label="Strongly agree"
                        icon="Strongly agree"
                        onFixation={onSelection}
                        context={context}
                        color="#373737"
                    />

                    <RadioButtonRound
                        idTarget="radio-target-2"
                        idOutlineCircle="radio-outline-2"
                        idSelectionCircle="radio-button-2"
                        value="2"
                        selected={props.value}
                        label="Agree"
                        icon="Agree"
                        onFixation={onSelection}
                        context={context}
                        color="#373737"
                    />

<RadioButtonRound
                        idTarget="radio-target-3"
                        idOutlineCircle="radio-outline-3"
                        idSelectionCircle="radio-button-3"
                        value="3"
                        selected={props.value}
                        label="Somewhat agree"
                        icon="Somewhat agree"
                        onFixation={onSelection}
                        context={context}
                        color="#373737"

                    />


                    <RadioButtonRound
                        idTarget="radio-target-4"
                        idOutlineCircle="radio-outline-4"
                        idSelectionCircle="radio-button-4"
                        value="4"
                        selected={props.value}
                        label="Neutral"
                        icon="Neutral"
                        onFixation={onSelection}
                        context={context}
                        color="#373737"

                    />

                    
<RadioButtonRound
                        idTarget="radio-target-5"
                        idOutlineCircle="radio-outline-5"
                        idSelectionCircle="radio-button-5"
                        value="5"
                        selected={props.value}
                        label="Somewhat disagree"
                        icon="Somewhat disagree"
                        onFixation={onSelection}
                        context={context}
                        color="#373737"
                    />

                    <RadioButtonRound
                        idTarget="radio-target-6"
                        idOutlineCircle="radio-outline-6"
                        idSelectionCircle="radio-button-6"
                        value="6"
                        selected={props.value}
                        label="Disagree"
                        icon="Disagree"
                        onFixation={onSelection}
                        context={context}
                        color="#373737"
                    />

                    <RadioButtonRound
                        idTarget="radio-target-7"
                        idOutlineCircle="radio-outline-7"
                        idSelectionCircle="radio-button-7"
                        value="7"
                        selected={props.value}
                        label="Strongly disagree"
                        icon="Strongly disagree"
                        onFixation={onSelection}
                        context={context}
                        color="#373737"
                    />

                </div>

            )}
        </WebGazeContext.Consumer>

    );
}

export default RadioButtonGroup;