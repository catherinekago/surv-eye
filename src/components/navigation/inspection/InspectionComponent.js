import './inspectioncomponent.css'

import RadioButtonGroupRound from '../../radiocontrol-round/RadioButtonGroupRound.js'

const InspectionComponent = (props) => {
    return ( 

        <div id="INSPECTION-AREA"> 
        <p id="question">{props.statement}</p>

        <RadioButtonGroupRound value={props.input} isInspectionArea={true}/>

        </div>
    );
}

export default InspectionComponent;