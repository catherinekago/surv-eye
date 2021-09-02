import NavBarCombined from "./components/navigation/NavBarCombined";
import { WebGazeContext } from './context/WebGazeContext';
import QuestionItem from "./QuestionItem";
import { useState } from 'react';


const Questionnaire = (props) => {

    const [questionnaireItems, setQuestionnaireItems] = useState([
        // { number: 0, type: "radio2", statement: "I want to know my Patronus.", input: 0, target: -1 },
        // // { number: 0, type: "slider", statement: "How much of an overthinker are you?", min: 0, max: 100, measure:"%", stepinterval: 1, input: 0 },
        { number: 0, type: "radio1", statement: "Q1-1", input: 0, target: -1 },
        { number: 1, type: "radio1", statement: "Q1-2", input: 0, target: 1 },
        { number: 2, type: "radio1", statement: "Q1-3", input: 0, target: 2 },
        { number: 3, type: "radio1", statement: "Q1-4", input: 0, target: 3 },
        { number: 4, type: "radio1", statement: "Q1-5", input: 0, target: 4 },
        { number: 5, type: "radio1", statement: "Q1-6", input: 0, target: 5 },
        { number: 6, type: "radio1", statement: "Q1-7", input: 0, target: 6 },
        { number: 7, type: "radio1", statement: "Q1-8", input: 0, target: 7 },
        { number: 8, type: "radio2", statement: "Q2-1.", input: 0, target: -1 },
        { number: 9, type: "radio2", statement: "Q1-2", input: 0, target: 1 },
        { number: 10, type: "radio2", statement: "Q1-3", input: 0, target: 2 },
        { number: 11, type: "radio2", statement: "Q1-4", input: 0, target: 3 },
        { number: 12, type: "radio2", statement: "Q1-5", input: 0, target: 4 },
        { number: 13, type: "radio2", statement: "Q1-6", input: 0, target: 5 },
        { number: 14, type: "radio2", statement: "Q1-7", input: 0, target: 6 },
        { number: 15, type: "radio2", statement: "Q1-8", input: 0, target: 7 }
    ])

    const [currentQuestionnaireItem, updateCurrentQuestionnaireItem] = useState(0);
    const [targetReached, setTargetReached] = useState(false);
    const [targetStartTime, setTargetStartTime] = useState(0);

    let RADIOBUTTONCOUNT = [1, 2, 3, 4, 5, 6, 7];

    // Handle activation of navigation element
    const navigate = (trig) => {
        console.log("scroll");
        if (trig === "back") {
            // updateCurrentQuestionnaireItem(previousValue => previousValue - 1)
            // props.onQuestionChange(questionnaireItems[currentQuestionnaireItem].type === "radio1" ? "R1-" + (currentQuestionnaireItem+1) : "R2-"+ (currentQuestionnaireItem+1-8));
            // setTargetReached(false);
        } else if (trig === "next") {
            if (currentQuestionnaireItem !== questionnaireItems.length -1) {
                setTargetStartTime(new Date().getTime());
                props.onQuestionChange(questionnaireItems[currentQuestionnaireItem].type === "radio1" ? "R1-" + (currentQuestionnaireItem+1) : "R2-"+ (currentQuestionnaireItem+1-8));
                setTargetReached(false);
                updateCurrentQuestionnaireItem(previousValue => previousValue + 1);

            } else {
                console.log(currentQuestionnaireItem + " is the last one! Time to trigger data collection!");
                document.getElementById("downloadGazeData").click();
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
                            hasItemInspectionArea={questionnaireItems[currentQuestionnaireItem].type === "radio2" ? true : false}
                            questionnaireItem={questionnaireItems[currentQuestionnaireItem]}
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

                    {(questionnaireItems[currentQuestionnaireItem].type === "radio2" && document.getElementById("radio-outline-inspection-round-1") !== null) ? connectingLines() : null}
                </div>
            )}
        </WebGazeContext.Consumer>
    );


}


export default Questionnaire;