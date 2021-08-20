import React from 'react';
import Calibration from "./Calibration";
import Questionnaire from "./Questionnaire";
import { WebGazeContext } from './context/WebGazeContext';
import { useState } from 'react';


const MainApp = (props) => {

  // STUDY
  const [calibrationActive, setCalibrationActive] = useState(false);
  return (
    <div id="MainContainer" style={{ height: "100%" }}>

      {calibrationActive ? (
        <WebGazeContext.Consumer >
          {context => (
            <Calibration context={context} onPhaseChange={props.onPhaseChange} onCalibrationComplete={setCalibrationActive} retrieveData={props.onCalibrationComplete} />
          )}
        </WebGazeContext.Consumer>
      ) :
        (<WebGazeContext.Consumer >
          {context => (
            <Questionnaire context={context} />
          )}
        </WebGazeContext.Consumer>)
      }
    </div>

  );
}

export default MainApp;