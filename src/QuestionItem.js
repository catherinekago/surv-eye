
import "./css/questionitem.css";
import RatioButtonGroup from "./radiocontrol/RadioButtonGroup"
import SliderComponent from "./slidercontrol OLD/SliderComponent"

const QuestionItem = (props) => {

    const passUpItemValue = (value) => {
        props.passUpItemValue(value);
    }

    return (
        <div className="item-container">
            <p id="question">{props.statement}</p>

            <div className="controls-container">
                {/* {props.type === "radio" ? */}
                    <RatioButtonGroup value={props.value} setItemValue={passUpItemValue} />
                    {/* // : 
                    // (<SliderComponent value={props.value} setItemValue={passUpItemValue} min={props.min} max={props.max} measure={props.measure}/>)
                    // } */}

            </div>
        </div>

    )

}

export default QuestionItem;