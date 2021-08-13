import { useState } from 'react';


const SliderKnob = (props) => {

    const [currentValue, setCurrentValue] = useState(props.value);

    return(
    <div id="SliderKnob">
        <p id="SliderValue">{props.value}</p>
    </div>
    );
}

export default SliderKnob; 