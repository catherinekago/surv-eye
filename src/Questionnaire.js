import NavBarCombined from "./components/navigation/NavBarCombined";
import { WebGazeContext } from './context/WebGazeContext';
import QuestionItem from "./QuestionItem";
import { useState, createElement } from 'react';

const Questionnaire = () => {

    const [questionnaireItems, setQuestionnaireItems] = useState([
        // { number: 0, type: "radio2", statement: "I want to know my Patronus.", input: 0 },
        { number: 0, type: "slider1", statement: "How much of an overthinker are you?", min: 0, max: 100, measure:"%", input: null }
        // { number: 1, type: "", statement: "I would stay at Hogwarts during the holidays as well.", input: 0 },
        // { number: 2, type: "radio1", statement: "I feel pitty for Nearly Headless Nick.", input: 0 },
        // { number: 3, type: "radio2", statement: "I'd love to possess the Mauderer's Map.", input: 0 }
    ])

    const [currentQuestionnaireItem, updateCurrentQuestionnaireItem] = useState(0);
    let RADIOBUTTONCOUNT = [1, 2, 3, 4, 5, 6, 7];

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
                            hasItemInspectionArea={questionnaireItems[currentQuestionnaireItem].type === "radio1" ? false : true}
                            questionnaireItem={questionnaireItems[currentQuestionnaireItem]}
                            min={questionnaireItems[currentQuestionnaireItem].type === "slider1" ? questionnaireItems[currentQuestionnaireItem].min : ""}
                            max={questionnaireItems[currentQuestionnaireItem].type === "slider1" ? questionnaireItems[currentQuestionnaireItem].max : ""}
                            measure={questionnaireItems[currentQuestionnaireItem].type === "slider1" ? questionnaireItems[currentQuestionnaireItem].measure : ""}
                            value={questionnaireItems[currentQuestionnaireItem].input}
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
                            min={questionnaireItems[currentQuestionnaireItem].type === "slider1" ? questionnaireItems[currentQuestionnaireItem].min : ""}
                            max={questionnaireItems[currentQuestionnaireItem].type === "slider1" ? questionnaireItems[currentQuestionnaireItem].max : ""}
                            measure={questionnaireItems[currentQuestionnaireItem].type === "slider1" ? questionnaireItems[currentQuestionnaireItem].measure : ""}
                            stepinterval={questionnaireItems[currentQuestionnaireItem].type === "slider1" ? questionnaireItems[currentQuestionnaireItem].stepinterval : ""}
                        />

                        {/* <NavBar
                        context={context}
                        // Only allow further scrolling if item has been selected? 
                        scrollEnabled={currentQuestionnaireItem < questionnaireItems.length-1 ? true : false}
                        scrollTrigger={navigate}
                        type={"scroll-button-back"}
                    /> */}


                    </div >

                    {(questionnaireItems[currentQuestionnaireItem].type === "radio2" && document.getElementById("radio-outline-inspection-round-1") !== null) ? connectingLines() : null}
                </div>
            )}
        </WebGazeContext.Consumer>
    );


}


export default Questionnaire;