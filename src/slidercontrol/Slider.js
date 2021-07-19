import { useState } from 'react';
import { click } from "../functions/click";
import { isGazeWithinElement } from '../functions/isGazeWithinElement';
import { convertAngleToPx } from "../functions/convertAngleToPx";

import RadioButton from '../radiocontrol/RadioButton';
import ZoomArea from './ZoomArea';
import "../css/slider.css";

const Slider = (props) => {

    const buttonCount = [1, 2, 3, 4, 5];

    const [min, setMin] = useState(props.min);
    const [max, setMax] = useState(props.max);

    const [minZoomed, setMinZoomed] = useState(props.min);
    const [maxZoomed, setMaxZoomed] = useState(props.max);

    const [fill, setFill] = useState({ gridColumn: 0 / 0 });

    // If a new value has been selected in select mode, adjust slider bar fill accordingly and pass up new value
    const onSelection = (value) => {
        props.setItemValue(value);
        if (value !== minZoomed) {
            let steps = (maxZoomed - minZoomed) / buttonCount.length;
            let buttonNumber = (Math.round(value / steps));
            console.log("Button number: " + buttonNumber);
            let endCol = 1 + 2 * buttonNumber;
            setFill({ gridColumn: "2 / " + endCol });
        } else {
            setFill({ gridColumn: "0 / 0" });
        }
    }

    // If a new area has been zoomed into, adjust min and max values of the slider according to zoomed in area
    const onZoomIn = (section) => {
        let steps = (maxZoomed - minZoomed) / buttonCount.length;
        let newMin = minZoomed + (section - 1) * steps;
        let newMax = newMin + steps;
        setMinZoomed(determineNewMin(section));
        setMaxZoomed(determineNewMin(section));
    }

    const determineNewMin = (section) => {
        let steps = (maxZoomed - minZoomed) / buttonCount.length;
        let newMin = minZoomed + (section - 1) * steps;
        return newMin;
    }

    const determineNewMax = (section) => {
        let steps = (maxZoomed - minZoomed) / buttonCount.length;
        let newMin = determineNewMin(section);
        let newMax = newMin + steps;
        return newMax; 
    }

    //Determine which value should be displayed for selection according to currently shown range
    const determineValue = (num) => {
        let steps = (maxZoomed - minZoomed) / buttonCount.length;
        return minZoomed + (num - 1) * steps + 0.5 * steps;
    }

    return (

        <div id="slider-container">
            <p id="slider-min" className="slider-label">{minZoomed + " " + props.measure}</p>
            <div id="slider-bar" />

            <div style={fill} id="slider-bar-fill" />

            {props.sliderMode === "select" ?
                (
                    <div id="slider-radio-group">

                        {buttonCount.map((buttonCount) => (
                            <RadioButton
                                idTarget={"slider-target-" + buttonCount}
                                idOutlineCircle={"slider-outline-" + buttonCount}
                                idSelectionCircle={"slider-button-" + buttonCount}
                                value={determineValue(buttonCount)}
                                selected={props.selected}
                                label={determineValue(buttonCount) + props.measure}
                                icon={determineValue(buttonCount) + props.measure}
                                onFixation={onSelection}
                                context={props.context}
                                color="#0f5f63">

                            </RadioButton>
                        ))}

                    </div>
                )
                :
                (
                    <div id="slider-zoom-group">
                        {/* {buttonCount.map((buttonCount) => (
                            <ZoomArea
                                idTarget={"zoom-target-" + buttonCount}
                                idFill={"zoom-fill-" + buttonCount}
                                section={buttonCount}
                                label={determineNewMin(buttonCount) + "-" + determineNewMax(buttonCount) + props.measure}
                                icon={determineNewMin(buttonCount) + "-" + determineNewMax(buttonCount) + props.measure}
                                onFixation={onZoomIn}
                                context={props.context}
                                color="#0f5f63">

                            </ZoomArea>
                        ))} */}
                    </div>
                )
            }
            <p id="slider-max" className="slider-label">{maxZoomed + " " + props.measure}</p>
        </div>

    );

}

export default Slider;