
import "./css/questionitem.css";
import RadioButtonGroupRect from "./components/radiocontrol-rect/RadioButtonGroupRect";
import RadioButtonGroupRound from "./components/radiocontrol-round/RadioButtonGroupRound";
import Slider from "./components/slidercontrol/Slider";

const QuestionItem = (props) => {

    const determineItem = (type) => {
        if (type === "1" || type == "2")  {
            return (<RadioButtonGroupRect value={props.value} target={props.target} setItemValue={props.passUpItemValue} />);
        } else if (type === "3" || type === "4") {
            return (<RadioButtonGroupRound value={props.value} target={props.target} setItemValue={props.passUpItemValue} isInspectionArea={false} />); 
        } else if (type === "slider") {
            return (
            <Slider value={props.value} setItemValue={props.passUpItemValue} min={props.min} max={props.max} measure={props.measure} stepinterval={props.stepinterval}/>);
        }

        }
    
    return (
        <div className="controls-container" style={{marginTop: props.type === "3" && props.type ==="4" ? "40px" : "0px"}}>
        {determineItem(props.type)}
        </div>

    )

}

export default QuestionItem;