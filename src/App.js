import React from 'react';
import { WebGazeContext } from './WebGazeContext';
import MainApp from './Main';

import './App.css';



import Script from 'react-load-script'
declare var webgazer;

class WebGazeLoader extends React.Component {
  constructor() {
    super();
    this.state = {
      context: {x: -1, y: -1}, 
      smoothFactor: 8,
      dataX: 0,
      dataY: 0,
      dataPoints: 0
    };
  }


  handleScriptLoad() {
    webgazer.setGazeListener((data, elapsedTime) => {
      if (data == null) {
        return;
      }
      // this code only smoothens the data, NOT the dot transformation!!
      if (this.state.dataPoints !== this.state.smoothFactor) {
        var newData = [webgazer.util.bound(data)];

        this.setState({dataX: this.state.dataX + newData[0]["x"]});
        this.setState({dataY: this.state.dataY + newData[0]["y"]});
        this.setState({dataPoints: this.state.dataPoints + 1});

      } else {

      // Make sure predictions are alway in bounds of the viewport
      var averageX = this.state.dataX / this.state.smoothFactor; 
      var averageY = this.state.dataY / this.state.smoothFactor; 
      var averaged = {x: averageX, y: averageY};
      this.setState({context: webgazer.util.bound(averaged)})
      this.setState({dataX: 0});
      this.setState({dataY: 0});
      this.setState({dataPoints: 0});

      }

    }).saveDataAcrossSessions(false).begin();
  }

  handleScriptError() {
    console.log('error');
  }



  render() {
    return (

      <WebGazeContext.Provider value={this.state.context}>
        <Script
          url="https://webgazer.cs.brown.edu/webgazer.js"
          onLoad={this.handleScriptLoad.bind(this)}
          onError={this.handleScriptError.bind(this)}
        />
        <MainApp />
      </WebGazeContext.Provider>

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