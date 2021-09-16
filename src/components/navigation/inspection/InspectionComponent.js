import './inspectioncomponent.css'

import RadioButtonGroupRound from '../../radiocontrol-round/RadioButtonGroupRound.js'
import Slider1 from "../../slider-1/Slider"

const InspectionComponent = (props) => {
    return ( 

        <div id="INSPECTION-AREA"> 
        <p id="question">{props.statement}</p>
        {props.type === "radio2" ? <RadioButtonGroupRound value={props.input} isInspectionArea={true}/>
        : <Slider1 value={props.value} min={props.min} max={props.max} measure={props.measure} isInspectionArea= {true}/>}
        

        </div>
    );
}

export default InspectionComponent;