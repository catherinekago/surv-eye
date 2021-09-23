import './navbarcombined.css';

import NavButton from "./NavButton.js";
import InspectionComponent from "./inspection/InspectionComponent.js"

const NavBarCombined = (props) => {

    return (

        <div className="navbar" style={{marginBottom: props.questionnaireItem.type === "slider2" ? "0px" : "80px" }}>
            <NavButton
                context={props.context}
                type={"scroll-button-back"}
                scrollTrigger={props.scrollTrigger}
                scrollEnabled={props.scrollEnabledBack} />
            {props.hasItemInspectionArea ?
                (<InspectionComponent
                    statement={props.statement}
                    type={props.questionnaireItem.type}
                    input={props.questionnaireItem.input}
                    min={props.questionnaireItem.type === "slider1" ? props.min : ""}
                    max={props.questionnaireItem.type === "slider1" ? props.max : ""}
                    measure={props.questionnaireItem.type === "slider1" ? props.measure : ""}
                    value={props.value}
                />)
                :
                (<p id="question">{props.statement}</p>)}

            <NavButton
                context={props.context}
                type={"scroll-button-next"}
                scrollTrigger={props.scrollTrigger}
                scrollEnabled={props.scrollEnabledNext} />

        </div>

    );


}


export default NavBarCombined;