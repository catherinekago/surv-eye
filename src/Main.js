import React from 'react';
import Calibration from "./Calibration";
import Questionnaire from "./Questionnaire";
import { WebGazeContext } from './context/WebGazeContext';
import { useState } from 'react';


const MainApp = () => {

  const [calibrationActive, setCalibrationActive] = useState(false);
  const [accuracyData, setAccuracyData] = useState();

  const participant = "Test";

  return (
    <div id="MainContainer" style={{ height: "100%" }}>

      {/* {calibrationActive ? (
        <WebGazeContext.Consumer >
          {context => (
            <Calibration context={context} onCalibrationComplete={setCalibrationActive} retrieveData={setAccuracyData} />
          )}
        </WebGazeContext.Consumer>
      ) : 
      (<a style={{display:"flex", justifyContent:"center", paddingTop:"300px", fontSize: "100px"}}
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(accuracyData)
        )}`}
        download={"accuracyData" +  participant + ".json"}
      >
        {`Download Data 💌`}
      </a>) // null
      } */}


      {!calibrationActive ? (
        <WebGazeContext.Consumer >
          {context => (
            <Questionnaire context={context} />
          )}
        </WebGazeContext.Consumer>
      ) : null}

    </div>

  );
}

export default MainApp;