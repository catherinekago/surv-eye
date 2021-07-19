import { useEffect, useState } from "react";
import { WebGazeContext } from '../context/WebGazeContext';
import Slider from "./Slider";
import SliderSwitch from "./SliderSwitch";

const SliderComponent = (props) => {

    const [sliderMode, setSliderMode] = useState("zoom-in");

    return (
        <WebGazeContext.Consumer >
        {context => (
            <div style={{display: "flex", flexDirection:"column", justifyContent:"center"}} id="component-container">
                <SliderSwitch selected={sliderMode} setSelected={setSliderMode} context={context} />
                <Slider selected={props.value} setItemValue={props.setItemValue} min={props.min} max={props.max} measure={props.measure} sliderMode={sliderMode} context={context} />
            </div>

)}
</WebGazeContext.Consumer>
    );

}

export default SliderComponent; 