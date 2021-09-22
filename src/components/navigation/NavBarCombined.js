import './navbarcombined.css';

import NavButton from "./NavButton.js";
import InspectionComponent from "./inspection/InspectionComponent.js"

const NavBarCombined = (props) => {

    return (

        <div className={props.hasItemInspectionArea ? "navbar inspectionnav" : "navbar noinspectionnav"}>
            <NavButton
                context={props.context}
                type={"scroll-button-back"}
                scrollTrigger={props.scrollTrigger}
                scrollEnabled={props.scrollEnabledBack}
                currentItemCount={props.currentItemCount} />
            {props.hasItemInspectionArea ?
                (<InspectionComponent
                    statement={props.statement}
                    type={props.questionnaireItem.type}
                    input={props.questionnaireItem.input}
                    target={props.questionnaireItem.target}
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
                scrollEnabled={props.scrollEnabledNext} 
                currentItemCount={props.currentItemCount} />

        </div>

    );


}


export default NavBarCombined;