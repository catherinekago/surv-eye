import NavBar from "./components/navigation/NavBar";
import NavBarCombined from "./components/navigation/NavBarCombined";
import { WebGazeContext } from './context/WebGazeContext';
import QuestionItem from "./QuestionItem";
import { useState } from 'react';

const Questionnaire = () => {

    const [questionnaireItems, setQuestionnaireItems] = useState([
        // { number: 0, type: "slider", statement: "How much of an overthinker are you?", min: 0, max: 100, measure:"%", stepinterval: 1, input: 0 },
        { number: 0, type: "radio", statement: "Kathrin is the very bestest cook.", input: 0 },
        { number: 1, type: "radio", statement: "The lockdown did not bug me at all.", input: 0 },
        { number: 2, type: "radio", statement: "Taylor Swift sucks.", input: 0 },
        { number: 3, type: "radio", statement: "I would love to be drunk right now.", input: 0 }
    ])

    const [currentQuestionnaireItem, updateCurrentQuestionnaireItem] = useState(0);

    // Handle activation of navigation element
    const navigate = (trig) => {
        if (trig === "back") {
            updateCurrentQuestionnaireItem(previousValue => previousValue - 1)
        } else if (trig === "next") {
            updateCurrentQuestionnaireItem(previousValue => previousValue + 1);

        }
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
                <div id="QuestionnaireContainer" style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%"

                }}>
                    <NavBarCombined 
                        context={context}
                        scrollTrigger={navigate}
                        scrollEnabledBack={currentQuestionnaireItem - 1 >= 0 ? true : false}
                        scrollEnabledNext={currentQuestionnaireItem < questionnaireItems.length-1 ? true : false}
                        statement={questionnaireItems[currentQuestionnaireItem].statement}
                        />

                    {/* <NavBar
                        context={context}
                        type="scroll-button-back"
                        scrollTrigger={navigate}
                        scrollEnabled={currentQuestionnaireItem - 1 >= 0 ? true : false}
                    /> */}

                    <QuestionItem 
                        type={questionnaireItems[currentQuestionnaireItem].type} 
                        passUpItemValue={setItemValue} 
                        value={questionnaireItems[currentQuestionnaireItem].input}
                        statement={questionnaireItems[currentQuestionnaireItem].statement} 
                        min={questionnaireItems[currentQuestionnaireItem].type === "slider" ? questionnaireItems[currentQuestionnaireItem].min : ""}
                        max={questionnaireItems[currentQuestionnaireItem].type === "slider" ? questionnaireItems[currentQuestionnaireItem].max : ""}
                        measure={questionnaireItems[currentQuestionnaireItem].type === "slider" ? questionnaireItems[currentQuestionnaireItem].measure : ""}
                        stepinterval={questionnaireItems[currentQuestionnaireItem].type === "slider" ? questionnaireItems[currentQuestionnaireItem].stepinterval : ""}
                        />

                    {/* <NavBar
                        context={context}
                        // Only allow further scrolling if item has been selected? 
                        scrollEnabled={currentQuestionnaireItem < questionnaireItems.length-1 ? true : false}
                        scrollTrigger={navigate}
                        type={"scroll-button-back"}
                    /> */}

                </div >
            )}
        </WebGazeContext.Consumer>
    );


}


export default Questionnaire;