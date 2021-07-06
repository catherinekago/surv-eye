import NavBar from "./NavBar";
import { WebGazeContext } from './WebGazeContext';
import QuestionItem from "./QuestionItem";
import { useState, useEffect } from 'react';

const Questionnaire = () => {



    const [questionnaireItems, setQuestionnaireItems] = useState([
        { number: 0, type: "radio", statement: "Cats are little bastards", value: "0" },
        { number: 1, type: "radio", statement: "Beer is the best", value: "0" },
        { number: 2, type: "radio", statement: "Mother knows best", value: "0" }
    ])

    const [currentQuestionnaireItem, updateCurrentQuestionnaireItem] = useState(0);

    const scroll = (direction) => {
        if (direction === "up") {
            updateCurrentQuestionnaireItem(previousValue => previousValue -1)
        } else {
            updateCurrentQuestionnaireItem(previousValue => previousValue +1)
        }
    }

    return (

        <WebGazeContext.Consumer >
            {context => (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%"

                }}>

                    <NavBar
                        context={context}
                        variant="scroll-button-top"
                        currentItem = {currentQuestionnaireItem}
                        scroll={scroll}
                        enabled={currentQuestionnaireItem - 1 >= 0 ? true : false}
                    />

                    <QuestionItem statement={questionnaireItems[currentQuestionnaireItem].statement}/>


                    <NavBar
                        context={context}
                        enabled={currentQuestionnaireItem + 1 < questionnaireItems.length ? true : false}
                        currentItem = {currentQuestionnaireItem}
                        scroll={scroll}
                        variant="scroll-button-bottom"
                    />

                </div >
            )}
        </WebGazeContext.Consumer>
    );


}


export default Questionnaire;