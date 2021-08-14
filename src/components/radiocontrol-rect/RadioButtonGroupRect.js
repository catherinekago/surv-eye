import RadioButtonRect from "./RadioButtonRect.js";
import { WebGazeContext } from '../../context/WebGazeContext';

import './radiobuttongrouprect.css'

const RadioButtonGroup = (props) => {

    const onSelection = (value) => {
        props.setItemValue(value);
    }

    return (
        <WebGazeContext.Consumer >
            {context => (
                <div id="radio-button-group-container">
                    <RadioButtonRect
                        idTarget="radio-target-1"
                        idFill="radio-fill-1"
                        value="1"
                        selected={props.value}
                        label="Strongly agree"
                        icon="Strongly agree"
                        onFixation={onSelection}
                        context={context}
                        color="#033f63"
                    />

                    <RadioButtonRect
                        idTarget="radio-target-2"
                        idFill="radio-fill-2"
                        value="2"
                        selected={props.value}
                        label="Agree"
                        icon="Agree"
                        onFixation={onSelection}
                        context={context}
                        color="#033f63"
                    />

                    <RadioButtonRect
                        idTarget="radio-target-3"
                        idFill="radio-fill-3"
                        value="3"
                        selected={props.value}
                        label="Somewhat agree"
                        icon="Somewhat agree"
                        onFixation={onSelection}
                        context={context}
                        color="#033f63"

                    />


                    <RadioButtonRect
                        idTarget="radio-target-4"
                        idFill="radio-fill-4"
                        value="4"
                        selected={props.value}
                        label="Neutral"
                        icon="Neutral"
                        onFixation={onSelection}
                        context={context}
                        color="#033f63"

                    />


                    <RadioButtonRect
                        idTarget="radio-target-5"
                        idFill="radio-fill-5"
                        value="5"
                        selected={props.value}
                        label="Somewhat disagree"
                        icon="Somewhat disagree"
                        onFixation={onSelection}
                        context={context}
                        color="#033f63"
                    />

                    <RadioButtonRect
                        idTarget="radio-target-6"
                        idFill="radio-fill-6"
                        value="6"
                        selected={props.value}
                        label="Disagree"
                        icon="Disagree"
                        onFixation={onSelection}
                        context={context}
                        color="#033f63"
                    />

                    <RadioButtonRect
                        idTarget="radio-target-7"
                        idFill="radio-fill-7"
                        value="7"
                        selected={props.value}
                        label="Strongly disagree"
                        icon="Strongly disagree"
                        onFixation={onSelection}
                        context={context}
                        color="#033f63"
                    />

                </div>

            )}
        </WebGazeContext.Consumer>

    );
}

export default RadioButtonGroup;