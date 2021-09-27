import NavBarCombined from "./components/navigation/NavBarCombined";
import { WebGazeContext } from './context/WebGazeContext';
import QuestionItem from "./QuestionItem";
import { useState } from 'react';

const Questionnaire = (props) => {
    // { number: 0, type: "2", statement: "I want to know my Patronus.", input: 0, target: -1 },
    // // { number: 0, type: "slider", statement: "How much of an overthinker are you?", min: 0, max: 100, measure:"%", stepinterval: 1, input: 0 },


    const [questionnaireItems, setQuestionnaireItems] = useState([{ type: "1", statement: "Freie Phase", input: 0, target: null }, { type: "1", statement: "stimme ganz und gar nicht zu", input: 0, target: 1 }]);
    const [currentQuestionnaireItem, updateCurrentQuestionnaireItem] = useState(0);
    const [targetReached, setTargetReached] = useState(false);
    const [targetStartTime, setTargetStartTime] = useState(0);
    const [trigger, setTrigger] = useState(null);

    let RADIOBUTTONCOUNT = [1, 2, 3, 4, 5, 6, 7];


    // Randomize order of questions presented (within one variant)
    const randomizeQuestionOrder = () => {
        let exploration1 = [{ type: "1", statement: determineStatement(0), input: 0, target: null }, { type: "1", statement: determineStatement(1), input: 0, target: 1 }];
        let exploration2 = [{ type: "3", statement: determineStatement(0), input: 0, target: null }];
        let exploration3 = [{ type: "5", statement: determineStatement(0), min: "0", max: "100", measure: "%", input: null, target: -1 }]
        let exploration4 = [{ type: "6", statement: determineStatement(0), min: "0", max: "100", measure: "%", input: null, target: -1 }]
        let end3 = [{ type: "5", statement: "Wie gern trinken Sie Tee?", min: "gar nicht gern", max: "sehr gern", measure: "", input: null, target: 101 }]
        let end4 = [{ type: "6", statement: "Wie gern trinken Sie Tee?", min: "gar nicht gern", max: "sehr gern", measure: "", input: null, target: 101 }]
        let variant1 = [
            { type: "1", statement: determineStatement(2), input: 0, target: 2 },
            { type: "1", statement: determineStatement(3), input: 0, target: 3 },
            { type: "1", statement: determineStatement(4), input: 0, target: 4 },
            { type: "1", statement: determineStatement(5), input: 0, target: 5 },
            { type: "1", statement: determineStatement(6), input: 0, target: 6 },
            { type: "1", statement: determineStatement(7), input: 0, target: 7 },
            { type: "2", statement: determineStatement(1), input: 0, target: 1 },
            { type: "2", statement: determineStatement(2), input: 0, target: 2 },
            { type: "2", statement: determineStatement(3), input: 0, target: 3 },
            { type: "2", statement: determineStatement(4), input: 0, target: 4 },
            { type: "2", statement: determineStatement(5), input: 0, target: 5 },
            { type: "2", statement: determineStatement(6), input: 0, target: 6 },
            { type: "2", statement: determineStatement(7), input: 0, target: 7 }];
        let variant2 = [{ type: "3", statement: determineStatement(1), input: 0, target: 1 },
        { type: "3", statement: determineStatement(2), input: 0, target: 2 },
        { type: "3", statement: determineStatement(3), input: 0, target: 3 },
        { type: "3", statement: determineStatement(4), input: 0, target: 4 },
        { type: "3", statement: determineStatement(5), input: 0, target: 5 },
        { type: "3", statement: determineStatement(6), input: 0, target: 6 },
        { type: "3", statement: determineStatement(7), input: 0, target: 7 },
        { type: "4", statement: determineStatement(1), input: 0, target: 1 },
        { type: "4", statement: determineStatement(2), input: 0, target: 2 },
        { type: "4", statement: determineStatement(3), input: 0, target: 3 },
        { type: "4", statement: determineStatement(4), input: 0, target: 4 },
        { type: "4", statement: determineStatement(5), input: 0, target: 5 },
        { type: "4", statement: determineStatement(6), input: 0, target: 6 },
        { type: "4", statement: determineStatement(7), input: 0, target: 7 }];
        let variant3 = [{ type: "5", statement: "Bitte wählen Sie 0% aus", min: 0, max: 100, measure: "%", input: null, target: 0 },
        { type: "5", statement: "Bitte wählen Sie 14% aus", min: 0, max: 100, measure: "%", input: null, target: 14 },
        { type: "5", statement: "Bitte wählen Sie 32% aus", min: 0, max: 100, measure: "%", input: null, target: 32 },
        { type: "5", statement: "Bitte wählen Sie 50% aus", min: 0, max: 100, measure: "%", input: null, target: 50 },
        { type: "5", statement: "Bitte wählen Sie 83% aus", min: 0, max: 100, measure: "%", input: null, target:  83},
        { type: "5", statement: "Bitte wählen Sie 100% aus", min: 0, max: 100, measure: "%", input: null, target: 100 }]
        let variant4 = [{ type: "6", statement: "Bitte wählen Sie 0% aus", min: 0, max: 100, measure: "%", input: null, target: 0 },
        { type: "6", statement: "Bitte wählen Sie 14% aus", min: 0, max: 100, measure: "%", input: null, target: 14 },
        { type: "6", statement: "Bitte wählen Sie 32% aus", min: 0, max: 100, measure: "%", input: null, target: 32 },
        { type: "6", statement: "Bitte wählen Sie 50% aus", min: 0, max: 100, measure: "%", input: null, target: 50 },
        { type: "6", statement: "Bitte wählen Sie 83% aus", min: 0, max: 100, measure: "%", input: null, target:  83},
        { type: "6", statement: "Bitte wählen Sie 100% aus", min: 0, max: 100, measure: "%", input: null, target: 100 }]

        let randomizedVariant1 = randomize(variant1);
        let randomizedVariant2 = randomize(variant2);
        let randomizedVariant3 = randomize(variant3);
        let randomizedVariant4 = randomize(variant4);

        const combinedQuestions = exploration1.concat(randomizedVariant1.concat(exploration2.concat(randomizedVariant2.concat(exploration3.concat(randomizedVariant3.concat(end3.concat(exploration4.concat(randomizedVariant4.concat(end4)))))))));
        console.log(combinedQuestions)
        return combinedQuestions;
    }

    // Determine statement according to target 
    const determineStatement = (target) => {
        if (target !== 0) {
            const statements = ["stimme ganz und gar nicht zu", "stimme nicht zu", "stimme eher nicht zu", "teils-teils", "stimme eher zu", "stimme zu", "stimme voll und ganz zu"];
            return (statements[target - 1]);
        } else {
            return ('Freie Phase')
        }
    }

    // Randomize array 
    const randomize = (array) => {
        let newArray = array;
        for (var i = newArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = newArray[i];
            newArray[i] = newArray[j];
            newArray[j] = temp;
        }
        return newArray;
    }


    // Handle activation of navigation element
    const navigate = (trig) => {
        if (trig === "back") {

        } else if (trig === "next") {
            if (currentQuestionnaireItem === 0) {
                setQuestionnaireItems(randomizeQuestionOrder());
            }
            if (currentQuestionnaireItem !== questionnaireItems.length - 1) {

                if (questionnaireItems[currentQuestionnaireItem].target !== -1 && questionnaireItems[currentQuestionnaireItem].target !== null && !targetReached) {
                    props.onTargetReached(new Date().getTime() - targetStartTime, questionnaireItems[currentQuestionnaireItem].input);   
                }
                setTargetStartTime(new Date().getTime());
                setTargetReached(false);
                props.onQuestionChange(questionnaireItems[currentQuestionnaireItem + 1].type + (questionnaireItems[currentQuestionnaireItem + 1].target));
                updateCurrentQuestionnaireItem(previousValue => previousValue + 1);
            } else {
                if (questionnaireItems[currentQuestionnaireItem].target !== -1 && questionnaireItems[currentQuestionnaireItem].target !== null && !targetReached) {
                    props.onTargetReached(new Date().getTime() - targetStartTime, questionnaireItems[currentQuestionnaireItem].input);   
                }
                setTimeout(() => { document.getElementById("downloadGazeData").click()}, 500);
                
            }
        }
    }

    // Set value of the selected option within a questionnaire item
    const setItemValue = (value) => {
        let allItems = questionnaireItems;
        allItems[currentQuestionnaireItem].input = value;
        setQuestionnaireItems(allItems);
        if (!targetReached && parseInt(questionnaireItems[currentQuestionnaireItem].input) === parseInt(questionnaireItems[currentQuestionnaireItem].target)) {
            setTargetReached(true);
            let currentTime = new Date().getTime();
            let completionTime = currentTime - targetStartTime;
            props.onTargetReached(completionTime);
        }
    }

    const connectingLines = () => RADIOBUTTONCOUNT.map((radiobutton) =>

        <svg
            style={{ gridColumn: 1, gridRow: 1, zIndex: "0", height: "100%", width: "100%" }} >

            <line style={{ strokeWidth: "5px", stroke: "#eaeaea", "strokeLinecap": "round" }} className="connectingLine"
                x1={Math.round(document.getElementById("radio-outline-inspection-round-" + radiobutton).getBoundingClientRect().left + document.getElementById("radio-outline-inspection-round-" + radiobutton).getBoundingClientRect().width * 0.5)}
                y1={Math.round(document.getElementById("radio-outline-inspection-round-" + radiobutton).getBoundingClientRect().bottom)}
                x2={Math.round(document.getElementById("radio-outline-round-" + radiobutton).getBoundingClientRect().left) + document.getElementById("radio-outline-round-" + radiobutton).getBoundingClientRect().width * 0.5}
                y2={Math.round(document.getElementById("radio-outline-round-" + radiobutton).getBoundingClientRect().top)} />
        </svg>
    );

    //    let Mx =  Math.round(document.getElementById("radio-outline-inspection-round-" + num).getBoundingClientRect().left + document.getElementById("radio-outline-inspection-round-" + num).getBoundingClientRect().width * 0.5) ;
    // let My = Math.round(document.getElementById("radio-outline-inspection-round-" + num).getBoundingClientRect().bottom);
    // console.log("M " + Mx + " " + My);
    // return (createElement("path", {d:"M " + Mx + " " + My,  stroke:"red", strokeWidth:"3",  fill:"none"}));
    {/* <line style={{ strokeWidth: "5px", stroke: "#eaeaea", "strokeLinecap": "round" }} className="connectingLine"
                    x1={Math.round(document.getElementById("radio-outline-inspection-round-" + radiobutton).getBoundingClientRect().left) + document.getElementById("radio-outline-inspection-round-" + radiobutton).getBoundingClientRect().width * 0.5}
                    y1={Math.round(document.getElementById("radio-outline-inspection-round-" + radiobutton).getBoundingClientRect().bottom)}
                    x2={Math.round(document.getElementById("radio-target-round-" + radiobutton).getBoundingClientRect().left) + document.getElementById("radio-target-round-" + radiobutton).getBoundingClientRect().width * 0.5}
                    y2={Math.round(document.getElementById("radio-target-round-" + radiobutton).getBoundingClientRect().top)} /> */}


    return (

        <WebGazeContext.Consumer >
            {context => (
                <div id="QuestionnaireGrid" style={{
                    display: "grid",
                    gridTemplateRows: "1fr",
                    height: "100%",
                    width: "100%"

                }}>

                    <div id="QuestionnaireContainer" style={{
                        gridColumn: 1,
                        gridRow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%"

                    }}>
                        <NavBarCombined
                            context={context}
                            scrollTrigger={navigate}
                            scrollEnabledBack={currentQuestionnaireItem - 1 >= 0 ? true : false}
                            scrollEnabledNext={currentQuestionnaireItem < questionnaireItems.length - 1 ? true : false}
                            statement={questionnaireItems[currentQuestionnaireItem].statement}
                            hasItemInspectionArea={questionnaireItems[currentQuestionnaireItem].type === "3" || questionnaireItems[currentQuestionnaireItem].type === "4" || questionnaireItems[currentQuestionnaireItem].type === "5" ? true : false}
                            questionnaireItem={questionnaireItems[currentQuestionnaireItem]}
                            currentItemCount={currentQuestionnaireItem}
                            min={questionnaireItems[currentQuestionnaireItem].type === "5" ? questionnaireItems[currentQuestionnaireItem].min : ""}
                            max={questionnaireItems[currentQuestionnaireItem].type === "5" ? questionnaireItems[currentQuestionnaireItem].max : ""}
                            measure={questionnaireItems[currentQuestionnaireItem].type === "5" ? questionnaireItems[currentQuestionnaireItem].measure : ""}
                            value={questionnaireItems[currentQuestionnaireItem].input}
                        />

                        <QuestionItem
                            id={currentQuestionnaireItem}
                            type={questionnaireItems[currentQuestionnaireItem].type}
                            passUpItemValue={setItemValue}
                            value={questionnaireItems[currentQuestionnaireItem].input}
                            target={questionnaireItems[currentQuestionnaireItem].target}
                            statement={questionnaireItems[currentQuestionnaireItem].statement}
                            min={questionnaireItems[currentQuestionnaireItem].type === "5" || questionnaireItems[currentQuestionnaireItem].type === "6"? questionnaireItems[currentQuestionnaireItem].min : ""}
                            max={questionnaireItems[currentQuestionnaireItem].type === "5" || questionnaireItems[currentQuestionnaireItem].type === "6" ? questionnaireItems[currentQuestionnaireItem].max : ""}
                            measure={questionnaireItems[currentQuestionnaireItem].type === "5" || questionnaireItems[currentQuestionnaireItem].type === "6"? questionnaireItems[currentQuestionnaireItem].measure : ""}
                        />
                    </div >

                    {((questionnaireItems[currentQuestionnaireItem].type === "3" || questionnaireItems[currentQuestionnaireItem].type === "4") && document.getElementById("radio-outline-inspection-round-1") !== null) ? connectingLines() : null}
                </div>
            )}
        </WebGazeContext.Consumer>
    );


}


export default Questionnaire;