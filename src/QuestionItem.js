
import "./css/questionitem.css";

import RatioButtonGroup from "./RadioButtonGroup"

const QuestionItem = (props) => {
    return (
        <div className="item-container">
        <p className="question">{props.statement}</p>

        <div className="controls-container"> 
        <RatioButtonGroup/>
        </div>
        </div>

     )

}

export default QuestionItem; 