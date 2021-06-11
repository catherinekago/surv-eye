import { useState } from 'react';
import RadioButton from "./RadioButton.js";

import './radiobuttongroup.css'

const RadioButtonGroup = (props) => {
    const [selected, setSelected] = useState("0");

    return (
        <div className = "radio-item"> 
            <h2>{props.question}</h2>
        <div className="radio-button-group-container">
            <p>{props.left}</p>
            <RadioButton
                value="0"
                selected={selected}
                text="First Radio Button"
                onChange={() => setSelected("0")}
            />
            <RadioButton
                value="1"
                selected={selected}
                text="Second Radio Button"
                onChange={() => setSelected("1")
                }
            />
            <p>{props.right}</p>
        </div>
        </div>

    );
}

export default RadioButtonGroup;