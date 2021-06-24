import React from 'react';
import Calibration from "./Calibration";
import { WebGazeContext } from './WebGazeContext';

const MainApp = () => {

  // const performCalibrationCycle = (context) => {
  //   const newTime = new Date().getTime();
  //   if (newTime > cycleTime + cycleInterval) {
  //     setCycleTime(newTime);
  //     if (state === "CLICK-CLICK") {
  //       setHasCalibrated(true);
  //       setState("CALIBRATION-ACCURACY");
  //       setResult("Clicked " + clickNum + " times");
  //     } else if (state === "CALIBRATION-ACCURACY") {
  //       setState("LOOK-LOOK");
  //       setResult(0);
  //       setClickNum(0);
  //     } else if (state === "LOOK-LOOK") {
  //       setState("EYE-GAZE-ACCURACY");
  //       setResult("Gaze was " + gazePoints.in / gazePoints.total * 100 + "% accurate");
  //     } else if (state === "EYE-GAZE-ACCURACY") {
  //       if (hasCalibrated) {
  //         setCalibrationComplete(true);
  //         setState("DONE");
  //       } else {
  //         setResult(0);
  //         setGazePoints({ in: 0, total: 0 });
  //         setState("CLICK-CLICK");
  //       }

  //     }
  //   } else {
  //     if (state === "CLICK-CLICK") {
  //       // calibrate();
  //     } else if (state === "LOOK-LOOK") {
  //       recordGazePoints(context);
  //     }
  //   }
  //   return (state);
  // }

  // const calibrate = () => {
  //   if (!hasCalibrated) {
  //     let xCoor = calibrationPoint01.current.getBoundingClientRect().left + 50;
  //     let yCoor = calibrationPoint01.current.getBoundingClientRect().top + 50;
  //     // console.log(xCoor);
  //     // console.log(yCoor);
  //     document.elementFromPoint(xCoor, yCoor).click();
  //     setHasCalibrated(true)
  //   }
  // }

  // const recordGazePoints = (context) => {
  //   const newTime = new Date().getTime();
  //   if (newTime > gazeTime + gazePointInterval) {

  //     setGazeTime(newTime);

  //     let currentGazeX = context.x;
  //     let currentGazeY = context.y;

  //     let buttonMinX = calibrationPoint01.current.getBoundingClientRect().left;
  //     let buttonMinY = calibrationPoint01.current.getBoundingClientRect().top;
  //     let buttonMaxX = calibrationPoint01.current.getBoundingClientRect().right;
  //     let buttonMaxY = calibrationPoint01.current.getBoundingClientRect().bottom;

  //     let isGazeWithinButton = currentGazeX >= buttonMinX && currentGazeX < buttonMaxX && currentGazeY >= buttonMinY && currentGazeY < buttonMaxY

  //     console.log(isGazeWithinButton)
  //     if (isGazeWithinButton) {
  //       let updatedGazePoints = { in: gazePoints.in + 1, total: gazePoints.total + 1 };
  //       setGazePoints(updatedGazePoints);
  //     } else {
  //       let updatedGazePoints = { in: gazePoints.in, total: gazePoints.total + 1 };
  //       setGazePoints(updatedGazePoints);
  //     }
  //   } else {
  //     console.log("got " + gazePoints.total + " data points: " + gazePoints.in + " out of " + gazePoints.total);
  //   }

  // }


  return (
    <WebGazeContext.Consumer>
    {context => (
    <Calibration context = {context}/>
    )}

    </WebGazeContext.Consumer>

  );
}

export default MainApp;