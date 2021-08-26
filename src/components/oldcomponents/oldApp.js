import React from 'react';
import { WebGazeContext } from '../../context/WebGazeContext';
import MainApp from '../../Main';

import './css/App.css';


import Script from 'react-load-script'
declare var GazeCloudAPI;

class GazeCloudAPILoader extends React.Component {
    constructor() {
        super();
        this.state = {
            context: { x: -1, y: -1 },
            gazeDisplay: "none",
            fixRange: 100,
            fixTime: 2,
            fixPoint: { x: -1, y: -1, time: Math.floor(Date.now() / 1000) },
            fixation: false
        };
    }

    handleScriptLoad() {

        function processGaze(GazeData) {
            var x_ = GazeData.docX;
            var y_ = GazeData.docY;

            this.setState({ context: { x: x_, y: y_ } });

            var gaze = document.getElementById("gaze");
            x_ -= gaze.clientWidth / 2;
            y_ -= gaze.clientHeight / 2;

            // console.log(x_, y_);

            gaze.style.left = x_ + "px";
            gaze.style.top = y_ + "px";

            if (GazeData.state !== 0) {
                if (this.state.gazeDisplay === "block")
                    this.setState({ gazeDisplay: 'none' });
                this.setState({ fixPoint: { x: -1, y: -1, time: Math.floor(Date.now() / 1000) } })
            } else {
                if (this.state.gazeDisplay === 'none')
                    this.setState({ gazeDisplay: "block" });
            }
            this.checkFixation();

        } 
        GazeCloudAPI.OnCalibrationComplete = function () {
            console.log('gaze Calibration Complete');
            this.setState({ gazeDisplay: "block" })
        }
        GazeCloudAPI.OnCamDenied = function () { console.log('camera access denied') }
        GazeCloudAPI.OnError = function (msg) { console.log('err: ' + msg) }
        GazeCloudAPI.UseClickRecalibration = true;
        GazeCloudAPI.OnResult = processGaze.bind(this);

    }

    handleScriptError() {
        console.log('Script loading Error!');
    }

    checkFixation() {
        if (this.state.gazeDisplay === "block") {
            if (this.state.fixPoint.x === -1) {
                this.setState({ fixPoint: { x: this.state.context.x, y: this.state.context.y, time: Math.floor(Date.now() / 1000) } })
            } else {
                let withinXCoordinates = (this.state.context.x >= this.state.fixPoint.x - this.state.fixRange) && (this.state.context.x <= this.state.fixPoint.x + this.state.fixRange);
                let withinYCoordinates = (this.state.context.y >= this.state.fixPoint.y - this.state.fixRange) && (this.state.context.y <= this.state.fixPoint.y + this.state.fixRange);
                let aboveFixationMin = Math.floor(Date.now() / 1000) - this.state.fixPoint.time >= this.state.fixTime;
                if (withinXCoordinates && withinYCoordinates) {
                    if (aboveFixationMin) {
                        this.setState({ fixation: true });
                    }
                } else {
                    this.setState({ fixPoint: { x: this.state.context.x, y: this.state.context.y, time: Math.floor(Date.now() / 1000) } })
                    this.setState({ fixation: false });
                }
            }
        }
    }



    render() {

        const gazeDisplayStyle = {
            display: this.state.gazeDisplay
        }

        return (
            <WebGazeContext.Provider value={this.state.context}>
                <button onClick={() => GazeCloudAPI.StartEyeTracking()}> Calibrate </button>
                <button onClick={() => GazeCloudAPI.StopEyeTracking()}> Stop Tracking </button>
                <div id="gaze" style={gazeDisplayStyle}>
                    {this.state.gazeDisplay && this.state.fixation ? <p style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>Fixation!</p> : null}
                </div>
                <MainApp />
                <Script
                    url="https://api.gazerecorder.com/GazeCloudAPI.js"
                    onLoad={this.handleScriptLoad.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                />
            </WebGazeContext.Provider>

        );
    }
}
GazeCloudAPILoader.contextType = WebGazeContext;

function App() {
    return (
        <div className="App">
            <GazeCloudAPILoader />
        </div>
    );
}

export default App;