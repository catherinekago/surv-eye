import { convertAngleToPx } from "../functions/convertAngleToPx";
import { click } from "../functions/click";
import { isGazeWithinElement } from '../functions/isGazeWithinElement';
import { useEffect, useState } from "react";
import SwitchButton from "./SwitchButton.js";
import zoomInIcon from "../assets/zoomInIcon.svg";
import selectIcon from "../assets/selectIcon.svg";


const SliderSwitch = (props) => {

    const onSelection = (value) => { props.setSelected(value); }

// TODO implement small version of radiobuttongroup


    return (
            <div style={{display: "flex", flexDirection:"row", justifyContent:"center"}} id="slider-switch-container">
                    <SwitchButton
                        idTarget="radio-zoom-in"
                        idFill="zoom-in-button"
                        value="zoom-in"
                        selected={props.selected}
                        label="Zoom In"
                        icon={zoomInIcon}
                        onFixation={onSelection}
                        context={props.context}
                        color="#13b3bb50"
                    />

                    <SwitchButton
                        idTarget="radio-select"
                        idFill="select-button"
                        value="select"
                        selected={props.selected}
                        label="Select"
                        icon={selectIcon}
                        onFixation={onSelection}
                        context={props.context}
                        color="#13b3bb50"
                    />
            </div>
    );
}

export default SliderSwitch; 