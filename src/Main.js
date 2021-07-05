import React from 'react';
import Calibration from "./Calibration";
import Questionnaire from "./Questionnaire";
import { WebGazeContext } from './WebGazeContext';
import { useState } from 'react';


const MainApp = () => {

const [calibrationActive, setCalibrationActive] = useState(false);

  return (
    <div style={{ height: "-webkit-fill-available" }}>

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