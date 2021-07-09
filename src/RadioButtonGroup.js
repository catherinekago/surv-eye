import { useState, useEffect } from 'react';
import RadioButton from "./RadioButton.js";
import { WebGazeContext } from './context/WebGazeContext';

import './css/radiobuttongroup.css'

const RadioButtonGroup = (props) => {


    const [selected, setSelected] = useState(props.value);

    const onSelection = (value) => {
        setSelected(value);
        props.setItemValue(value);
    }

    return (
        <WebGazeContext.Consumer >
            {context => (
                <div className="radio-button-group-container">
                    <RadioButton
                        idTarget="radio-target-1"
                        idSelectionCircle="radio-button-1"
                        value="1"
                        selected={props.value}
                        label="Strongly agree"
                        onFixation={onSelection}
                        context={context}
                    />

                    <RadioButton
                        idTarget="radio-target-2"
                        idSelectionCircle="radio-button-2"
                        value="2"
                        selected={props.value}
                        label="Agree"
                        onFixation={onSelection}
                        context={context}
                    />

                    <RadioButton
                        idTarget="radio-target-3"
                        idSelectionCircle="radio-button-3"
                        value="3"
                        selected={props.value}
                        label="Neutral"
                        onFixation={onSelection}
                        context={context}
                    />

                    <RadioButton
                        idTarget="radio-target-4"
                        idSelectionCircle="radio-button-4"
                        value="4"
                        selected={props.value}
                        label="Disagree"
                        onFixation={onSelection}
                        context={context}
                    />

                    <RadioButton
                        idTarget="radio-target-5"
                        idSelectionCircle="radio-button-5"
                        value="5"
                        selected={props.value}
                        label="Strongly disagree"
                        onFixation={onSelection}
                        context={context}
                    />

                </div>

            )}
        </WebGazeContext.Consumer>

    );
}

export default RadioButtonGroup;