
import "./css/questionitem.css";
import RadioButtonGroupRect from "./components/radiocontrol-rect/RadioButtonGroupRect";
import RadioButtonGroupRound from "./components/radiocontrol-round/RadioButtonGroupRound";
import Slider from "./components/slidercontrol/Slider";

const QuestionItem = (props) => {

    const passUpItemValue = (value) => {
        props.passUpItemValue(value);
    }

    const determineItem = (type) => {
        if (type === "radio1")  {
            return (<RadioButtonGroupRect value={props.value} setItemValue={passUpItemValue} />);
        } else if (type === "radio2") {
            return (<RadioButtonGroupRound value={props.value} setItemValue={passUpItemValue} isInspectionArea={false} />); 
        } else if (type === "slider") {
            return (
            <Slider value={props.value} setItemValue={passUpItemValue} min={props.min} max={props.max} measure={props.measure} stepinterval={props.stepinterval}/>);
        }

        }
    
    return (
        <div className="controls-container" style={{marginTop: props.type === "radio2" ? "40px" : "0px"}}>
        {determineItem(props.type)}
        </div>

    )

}

export default QuestionItem;