import React from 'react';
import { WebGazeContext } from './context/WebGazeContext';
import { click } from "./functions/click";
import MainApp from './Main';
import { convertAngleToPx } from "./functions/convertAngleToPx";

import './css/App.css';



import Script from 'react-load-script'
declare var webgazer;

class WebGazeLoader extends React.Component {
  constructor() {
    super();
    this.handlePhaseChange = this.handlePhaseChange.bind(this);
    this.handleAccuracyData = this.handleAccuracyData.bind(this);
    this.handleTargetReached = this.handleTargetReached.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.determinePhase = this.determinePhase.bind(this);

    this.state = {
      context: { x: -1, y: -1, time: -1 },
      dataNull: true,
      fixRange: convertAngleToPx(4.17), // target size?
      fixTime: 1, // how many seconds a fixation should last
      fixPoint: { x: -1, y: -1, time: Math.floor(Date.now() / 1000) },
      fixation: false,
      gazeSmoothening: [],
      gazeData: [], // All gaze estimations that webgazer provides 
      accuracyData: [], // All accuracy calculations gathered during calibration-validation process
      phase: "CALIBRATION", // Currently active phase: CALIBRATION, VALIDATION, or 
      question: "10",
      performValidation: false, // THIS VARIABLE INFLUENCES IF SURVEYE INCLUDES A VALIDATION PHASE WITH DATA GENERATION
      targetReached: false,

    };
  }

  // Change phase variable according to actual phase and provide jsons after calibration has been completed
  handlePhaseChange(phase) {
    this.setState({ phase: phase });

    if (this.state.performValidation && phase === "QUESTIONNAIRE") {
      // Functionality to save json files of gathered data within calibration-validation sequence
      document.getElementById("downloadGazeData").click();
      document.getElementById("downloadAccuracyData").click();
      setTimeout(() => { this.setState({ gazeData: [] }) }, 300);
    }
  }

  // Set accuracy data after calibration-validation sequence has been completed
  handleAccuracyData(data) {
    this.setState({ accuracyData: data });
  }

  // Set corresponding variable to true, so that recording of gaze points stops, and add entry to data 
  handleTargetReached(time) {

    this.setState({ targetReached: true });
    let updatedGazeData = this.state.gazeData;
    updatedGazeData.push({completiontime: time, phase: this.determinePhase() });
    this.setState({ gazeData: updatedGazeData });
  }

  handleQuestionChange(question) {
    this.setState({ question: question });
    this.setState({ targetReached: false });
  }

  // Check if the user is fixating a point (gaze staying within a defined area for a defined amount of time)
  checkFixation() {
    let withinXCoordinates = (this.state.context.x >= this.state.fixPoint.x - this.state.fixRange) && (this.state.context.x <= this.state.fixPoint.x + this.state.fixRange);
    let withinYCoordinates = (this.state.context.y >= this.state.fixPoint.y - this.state.fixRange) && (this.state.context.y <= this.state.fixPoint.y + this.state.fixRange);
    let aboveFixationMin = Math.floor(Date.now() / 1000) - this.state.fixPoint.time >= this.state.fixTime;
    if (withinXCoordinates && withinYCoordinates) {
      if (aboveFixationMin && !this.state.fixation) {
        this.setState({ fixation: true });
      }
    } else {
      this.setState({ fixPoint: { x: this.state.context.x, y: this.state.context.y, time: Math.floor(Date.now() / 1000) } })
      this.setState({ fixation: false });
    }

  }

  // Apply smoothening to gaze prediction
  displaySmoothenedDataPoints(data, elapsedTime, averaged) {

    this.mapGazePredictionsToScreen(data);

    if (this.state.gazeSmoothening.length < averaged) {
      let updatedData = this.state.gazeSmoothening;
      updatedData.push({ x: data.x, y: data.y });
      this.setState({ gazeSmoothening: updatedData });

      if ((this.state.performValidation && this.state.phase !== "QUESTIONNAIRE") || (this.state.phase === "QUESTIONNAIRE" && !this.state.targetReached)) {
        let updatedGazeData = this.state.gazeData;
        updatedGazeData.push({ x: data.x, y: data.y, time: elapsedTime, type: "raw", phase: this.determinePhase() });
        if (this.determinePhase() === "47") {
        }
        this.setState({ gazeData: updatedGazeData });
      }


    } else {

      let summedX = 0;
      let summedY = 0;

      for (let i = 0; i < averaged; i++) {
        summedX += this.state.gazeSmoothening[i].x;
        summedY += this.state.gazeSmoothening[i].y;
      }

      let averagedX = summedX / averaged;
      let averagedY = summedY / averaged;

      this.setState({ context: webgazer.util.bound({ x: averagedX, y: averagedY, time: elapsedTime }) });
      this.setState({ gazeSmoothening: [{ x: data.x, y: data.y }] });

      if ((this.state.performValidation && this.state.phase !== "QUESTIONNAIRE") || (this.state.phase === "QUESTIONNAIRE" && !this.state.targetReached)) {
        let updatedGazeData = this.state.gazeData;
        updatedGazeData.push({ x: averagedX, y: averagedY, time: elapsedTime, type: "smoothened", phase: this.determinePhase()});
        this.setState({ gazeData: updatedGazeData });
      }

      document.getElementById("gaze-dot").style.transform = "translate3d(" + this.state.context.x + "px, " + this.state.context.y + "px, 0px)";
    }
  }

  determinePhase() {
    if (this.state.phase === "QUESTIONNAIRE") {
      return this.state.question;
    } else {
      return this.state.phase;
    }
  }


  // Restrict gaze prediction to screen boundaries by mapping points outside the boundaries to the corresponding borders
  mapGazePredictionsToScreen(data) {
    if (data.x < 0) {
      data.x = 0;
    } else if (data.x > window.innerWidth - 25) {
      data.x = window.innerWidth - 25;
    }

    if (data.y < 0) {
      data.y = 0;
    } else if (data.y > window.innerHeight - 25) {
      data.y = window.innerHeight - 25;
    }
  }

  handleScriptLoad() {

    webgazer.setGazeListener((data, elapsedTime) => {
      if (data == null) {
        // console.log("NO gaze detected");

        if (document.getElementById("INTRO") !== null) {

          // STUDY
          click("INTRO");
          this.setState({ dataNull: false });
        }


        // For debugging: set to true
        webgazer.showPredictionPoints(false);
        webgazer.showVideo(false);
        webgazer.showFaceOverlay(false);
        webgazer.showFaceFeedbackBox(false);

        return;
      }
      this.displaySmoothenedDataPoints(data, Math.round(elapsedTime), 8);

      this.checkFixation();

    }).saveDataAcrossSessions(false).begin();
  }

  handleScriptError() {
    console.log('error');
  }

  render() {
    return (
      <div id="AppContainer" style={{ height: "100%" }}>
        <WebGazeContext.Provider value={this.state.context}>
          <Script
            url="https://webgazer.cs.brown.edu/webgazer.js"
            onLoad={this.handleScriptLoad.bind(this)}
            onError={this.handleScriptError.bind(this)}
          />
          <MainApp onTargetReached={this.handleTargetReached} performValidation={this.state.performValidation} onPhaseChange={this.handlePhaseChange} onQuestionChange={this.handleQuestionChange} onCalibrationComplete={this.handleAccuracyData} />
          <div style={this.state.fixation ? { borderColor: "rgb(255, 63, 137)" } : { borderColor: "rgb(76, 63, 255)" }} id="gaze-dot" />

          {/* Functionality to retrieve gaze and accuracy data of a calibration-validation phase */}
          <a id="downloadGazeData" style={{ background: "transparent", fontSize: 0 }}
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(this.state.gazeData)
            )}`}
            download={"gazeData" + ".json"}
          >
            {`Download Gaze Data 💌`}
          </a>

          {this.state.performValidation ?
            (<a id="downloadAccuracyData" style={{ background: "transparent", fontSize: 0 }}
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(this.state.accuracyData)
              )}`}
              download={"accuracyData" + ".json"}
            >
              {`Download Accuracy Data 💌`}
            </a>) : null}




        </WebGazeContext.Provider>
      </div>


    );
  }
}
WebGazeLoader.contextType = WebGazeContext;

function App() {

  return (
    <WebGazeLoader />
  );
}

export default App;