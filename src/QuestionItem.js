
import "./css/questionitem.css";
import RatioButtonGroup from "./RadioButtonGroup"

const QuestionItem = (props) => {
    
    const passUpItemValue = (value) => {
        props.passUpItemValue(value);
    }

    return (
        <div className="item-container">
        <p id="question">{props.statement}</p>

        <div className="controls-container"> 
        <RatioButtonGroup  value={props.value}  setItemValue={passUpItemValue}/>
        </div>
        </div>

     )

}

export default QuestionItem; 