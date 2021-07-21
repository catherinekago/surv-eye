import React from 'react';
import Calibration from "./Calibration";
import Questionnaire from "./Questionnaire";
import { WebGazeContext } from './context/WebGazeContext';
import { useState } from 'react';


const MainApp = () => {

const [calibrationActive, setCalibrationActive] = useState(true);

  return (
    <div style={{ height: "100%" }}>

      {calibrationActive ? (
        <WebGazeContext.Consumer >
        {context => (
          <Calibration context={context} onCalibrationComplete={setCalibrationActive}/>
        )}
      </WebGazeContext.Consumer>
      ) : null } 


{!calibrationActive ? (
        <WebGazeContext.Consumer >
        {context => (
          <Questionnaire context={context} />
        )}
      </WebGazeContext.Consumer>
      ) : null } 

    </div>

  );
}

export default MainApp;