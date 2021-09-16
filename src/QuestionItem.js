
import "./css/questionitem.css";
import RadioButtonGroupRect from "./components/radiocontrol-rect/RadioButtonGroupRect";
import RadioButtonGroupRound from "./components/radiocontrol-round/RadioButtonGroupRound";
import Slider1 from "./components/slider-1/Slider"
import { WebGazeContext } from './context/WebGazeContext';
// import Slider from "./components/slidercontrol/Slider";

const QuestionItem = (props) => {

    const passUpItemValue = (value) => {
        props.passUpItemValue(value);
    }

    const determineItem = (type) => {
        if (type === "radio1")  {
            return (<RadioButtonGroupRect value={props.value} setItemValue={passUpItemValue} />);
        } else if (type === "radio2") {
            return (<RadioButtonGroupRound value={props.value} setItemValue={passUpItemValue} isInspectionArea={false} />); 
        } else if (type === "slider1") {
            return (
                <WebGazeContext.Consumer >
                {context => (
            <Slider1 context={context} value={props.value} setItemValue={passUpItemValue} min={props.min} max={props.max} measure={props.measure} isInspectionArea= {false}/>)
            }
            </WebGazeContext.Consumer>)
        }

        }
    
    return (
        <div className="controls-container" style={{marginTop: props.type === "radio2" ? "40px" : "0px"}}>
        {determineItem(props.type)}
        </div>

    )

}

export default QuestionItem;