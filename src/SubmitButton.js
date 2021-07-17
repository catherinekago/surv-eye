import './css/navbutton.css';
import { useState, useEffect } from 'react';
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';
import submitIcon from "./assets/submitIcon.svg";

const SubmitButton = (props) => {

    const gazeTriggerInterval = 1000;

    const [lastGazeTrigger, setLastGazeTrigger] = useState(new Date().getTime());

    const [gazeIndicatorClass, setGazeIndicatorClass] = useState("no-gaze-default");

    const gazeIndicatorID = "gazIndicator03";

    // eslint-disable-next-line
    useEffect(() => {
        let currentTime = new Date().getTime();
        document.getElementById(gazeIndicatorID).addEventListener("transitionend", onTransitionEnd, false);
        if (props.enabled && currentTime - lastGazeTrigger >= gazeTriggerInterval) {
            if (isGazeWithinElement("submit-button", 0, props.context.x, props.context.y)) {
                setGazeIndicatorClass('gaze-detected-bottom');
            } else {
                setGazeIndicatorClass('no-gaze-detected-bottom');
            }

        }
    });

    // Handle fixation on scroll button
    const onTransitionEnd = () => {

        if (document.getElementById(gazeIndicatorID).offsetHeight === 150) {
            click("submit-icon");
            props.trigger("submit");
            setLastGazeTrigger(new Date().getTime());
            setGazeIndicatorClass("no-gaze-default");
        }

    }

    return (
        <div id={"submit-button"} className={"nav-button"}>
            <img id="submit-icon" className="button-icon" src={submitIcon} alt="Submit Icon" />
            <div  style={{background: "yellow !important"}} id={gazeIndicatorID} className={gazeIndicatorClass} />
        </div>

    );

}


export default SubmitButton;