
import "./css/questionitem.css";
import { useEffect, useState } from "react";
import RatioButtonGroup from "./RadioButtonGroup"

const QuestionItem = (props) => {

    const [value, setValue] = useState(0);
    
    const passUpItemValue = (value) => {
        props.passUpItemValue(value);
    }

    return (
        <div className="item-container">
        <p className="question">{props.statement}</p>

        <div className="controls-container"> 
        <RatioButtonGroup  value={props.value}  setItemValue={passUpItemValue}/>
        </div>
        </div>

     )

}

export default QuestionItem; 