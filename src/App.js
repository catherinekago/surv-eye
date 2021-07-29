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
    this.state = {
      context: { x: -1, y: -1 },
      dataNull: true, 
      fixRange: convertAngleToPx(4.17), // target size?
      fixTime: 1, // how many seconds a fixation should last
      fixPoint: { x: -1, y: -1, time: Math.floor(Date.now() / 1000) },
      fixation: false,
      gazeData:[]
    };
  }
  

  checkFixation() {
            let withinXCoordinates = (this.state.context.x >= this.state.fixPoint.x - this.state.fixRange) && (this.state.context.x <= this.state.fixPoint.x + this.state.fixRange);
            let withinYCoordinates = (this.state.context.y >= this.state.fixPoint.y - this.state.fixRange) && (this.state.context.y <= this.state.fixPoint.y + this.state.fixRange);
            let aboveFixationMin = Math.floor(Date.now() / 1000) - this.state.fixPoint.time >= this.state.fixTime;
            if (withinXCoordinates && withinYCoordinates) {
                if (aboveFixationMin && !this.state.fixation) {
                    this.setState({ fixation: true });
                    console.log("FIXATING");
                }
            } else {
                this.setState({ fixPoint: { x: this.state.context.x, y: this.state.context.y, time: Math.floor(Date.now() / 1000) } })
                this.setState({ fixation: false });
            }
    
}


displaySmoothenedDataPoints(data, averaged) {

if (this.state.gazeData.length < averaged) {
  let updatedData = this.state.gazeData;
  updatedData.push({x: data.x, y: data.y});
  this.setState({gazeData: updatedData});

} else {

  let summedX = 0; 
  let summedY = 0;

  for (let i = 0; i < averaged; i ++) {
    summedX += this.state.gazeData[i].x;
    summedY += this.state.gazeData[i].y;
  }

  let averagedX = summedX / averaged; 
  let averagedY = summedY / averaged; 

  this.setState({ context: webgazer.util.bound({x: averagedX, y:averagedY}) });
  this.setState({gazeData: [{x: data.x, y:data.y}]});
  document.getElementById("gaze-dot").style.transform = "translate3d(" + this.state.context.x + "px, " + this.state.context.y + "px, 0px)";
}        


}

  handleScriptLoad() {
    webgazer.setGazeListener((data, elapsedTime) => {
      if (data == null) {
        console.log("NO gaze detected");

        if (document.getElementById("INTRO") !== null) {
          // click("INTRO");
          this.setState({dataNull: false});
          console.log(this.state.dataNull);
        }


        // For debugging: set to true. For usability study: debatable
        webgazer.showPredictionPoints(false);
        webgazer.showVideo(false);
        webgazer.showFaceOverlay(false);
        webgazer.showFaceFeedbackBox(false);

        return;
      }
      this.displaySmoothenedDataPoints(data, 8);

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
          <MainApp />
          <div style={this.state.fixation ? {borderColor: "rgb(255, 63, 137)"} : {borderColor: "rgb(76, 63, 255)"}} id ="gaze-dot"/>

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