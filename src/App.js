import React from 'react';
import { WebGazeContext } from './context/WebGazeContext';
import { click } from "./functions/click";
import MainApp from './Main';

import './css/App.css';



import Script from 'react-load-script'
declare var webgazer;

class WebGazeLoader extends React.Component {
  constructor() {
    super();
    this.state = {
      context: { x: -1, y: -1 }
    };
  }


  handleScriptLoad() {
    webgazer.setGazeListener((data, elapsedTime) => {
      if (data == null) {

        click("INTRO");
        return;
      }
      this.setState({ context: webgazer.util.bound(data) });

    }).saveDataAcrossSessions(false).begin();
  }

  handleScriptError() {
    console.log('error');
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <WebGazeContext.Provider value={this.state.context}>
          <Script
            url="https://webgazer.cs.brown.edu/webgazer.js"
            onLoad={this.handleScriptLoad.bind(this)}
            onError={this.handleScriptError.bind(this)}
          />
          <MainApp />

        </WebGazeContext.Provider>
      </div>


    );
  }
}
WebGazeLoader.contextType = WebGazeContext;

function App() {

  return (
    <div className="App">
      <WebGazeLoader />
    </div>
  );
}

export default App;