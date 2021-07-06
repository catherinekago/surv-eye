import { useState } from 'react';
import RadioButton from "./RadioButton.js";

import './css/radiobuttongroup.css'

const RadioButtonGroup = (props) => {
    const [selected, setSelected] = useState("0");

    return (
            <div className="radio-button-group-container">
                <RadioButton
                    value="1"
                    selected={selected}
                    label="Strongly agree"
                    onChange={() => setSelected("1")}
                />
                <RadioButton
                    value="2"
                    selected={selected}
                    label="Agree"
                    onChange={() => setSelected("2")
                    }
                />
                <RadioButton
                    value="3"
                    selected={selected}
                    label="Neutral"
                    onChange={() => setSelected("3")
                    }
                />
                <RadioButton
                    value="4"
                    selected={selected}
                    label="Disagree"
                    onChange={() => setSelected("4")
                    }
                />
                <RadioButton
                    value="5"
                    selected={selected}
                    label="Strongly disagree"
                    onChange={() => setSelected("5")
                    }
                />
        </div>

    );
}

export default RadioButtonGroup;