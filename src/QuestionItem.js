
import "./css/questionitem.css";
import RatioButtonGroup from "./components/radiocontrol/RadioButtonGroup";
import Slider from "./components/slidercontrol/Slider";

const QuestionItem = (props) => {

    const passUpItemValue = (value) => {
        props.passUpItemValue(value);
    }

    return (
        <div className="item-container">

            {/* Currently moved to navigation  */}
            {/* <p id="question">{props.statement}</p> */}

            <div className="controls-container">
                {props.type === "radio" ?
                    (<RatioButtonGroup value={props.value} setItemValue={passUpItemValue} />)
                    : 
                    (<Slider value={props.value} setItemValue={passUpItemValue} min={props.min} max={props.max} measure={props.measure} stepinterval={props.stepinterval}/>)
                    }

            </div>
        </div>

    )

}

export default QuestionItem;