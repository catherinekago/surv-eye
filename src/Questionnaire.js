import NavBar from "./NavBar";
import { WebGazeContext } from './context/WebGazeContext';
import QuestionItem from "./QuestionItem";
import { useState } from 'react';

const Questionnaire = () => {

    const [questionnaireItems, setQuestionnaireItems] = useState([
        { number: 0, type: "slider", statement: "How much of an overthinker are you?", min: 0, max: 100, measure:"%", input: 0 },
        { number: 1, type: "radio", statement: "The lockdown did not bug me at all.", input: 0 },
        { number: 2, type: "radio", statement: "Taylor Swift sucks.", input: 0 }
    ])

    const [currentQuestionnaireItem, updateCurrentQuestionnaireItem] = useState(0);

    // Handle activation of navigation element
    const navigate = (trig) => {
        if (trig === "up") {
            updateCurrentQuestionnaireItem(previousValue => previousValue - 1)
        } else if (trig === "down") {
            updateCurrentQuestionnaireItem(previousValue => previousValue + 1);

        }
    }

    // Handle submit of navigation element
    const submit = (trig) => {
        console.log("SUBMIT IT");
    }

    // Set value of the selected option within a questionnaire item
    const setItemValue = (value) => {
        let allItems = questionnaireItems;
        allItems[currentQuestionnaireItem].input = value;
        setQuestionnaireItems(allItems);
    }

    return (

        <WebGazeContext.Consumer >
            {context => (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "99.8%"

                }}>

                    <NavBar
                        context={context}
                        type="scroll-button-top"
                        scrollTrigger={navigate}
                        scrollEnabled={currentQuestionnaireItem - 1 >= 0 ? true : false}
                    />

                    <QuestionItem 
                        type={questionnaireItems[currentQuestionnaireItem].type} 
                        passUpItemValue={setItemValue} 
                        value={questionnaireItems[currentQuestionnaireItem].input}
                        statement={questionnaireItems[currentQuestionnaireItem].statement} 
                        min={questionnaireItems[currentQuestionnaireItem].type === "slider" ? questionnaireItems[currentQuestionnaireItem].min : ""}
                        max={questionnaireItems[currentQuestionnaireItem].type === "slider" ? questionnaireItems[currentQuestionnaireItem].max : ""}
                        measure={questionnaireItems[currentQuestionnaireItem].type === "slider" ? questionnaireItems[currentQuestionnaireItem].measure : ""}
                        />

                    <NavBar
                        context={context}
                        // Only allow further scrolling if item has been selected? 
                        scrollEnabled={currentQuestionnaireItem < questionnaireItems.length-1 ? true : false}
                        scrollTrigger={navigate}
                        type={"scroll-button-bottom"}
                    />

                </div >
            )}
        </WebGazeContext.Consumer>
    );


}


export default Questionnaire;