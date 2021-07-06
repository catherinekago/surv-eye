import './css/navbar.css';
import scrollArrow from './assets/scrollArrow.svg';
import { useState, useEffect } from 'react';
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';

const NavBar = (props) => {

    const gazeTriggerInterval = 1000;

    const [lastGazeTrigger, setLastGazeTrigger] = useState(new Date().getTime());

    const [gazeIndicatorClass, setGazeIndicatorClass] = useState("no-gaze-default");

    const arrowClass = props.variant === "scroll-button-top" ? "arrow-top" : "arrow-bottom";
    const gazeIndicatorID = props.variant === "scroll-button-top" ? "gazeIndicator01" : "gazeIndicator02";




    useEffect(() => {
        let currentTime = new Date().getTime();
        document.getElementById(gazeIndicatorID).addEventListener("transitionend", onTransitionEnd, false);
        if (props.enabled && currentTime - lastGazeTrigger >= gazeTriggerInterval) {
            if (isGazeWithinElement(props.variant, 0, props.context.x, props.context.y)) {
                setGazeIndicatorClass(props.variant === "scroll-button-top" ? "gaze-detected-top" : "gaze-detected-bottom");
            } else {
                setGazeIndicatorClass(props.variant === "scroll-button-top" ? "no-gaze-detected-top" : "no-gaze-detected-bottom");
            }

        }
    });

    // Handle fixation on scroll button
    const onTransitionEnd = () => {
        if (document.getElementById(gazeIndicatorID).offsetHeight === 150) {
            props.variant === "scroll-button-top" ? props.scroll("up") : props.scroll("down");
            click(props.variant);
            setLastGazeTrigger(new Date().getTime());
            setGazeIndicatorClass("no-gaze-default");
        }

    }

    return (
        <div className="navbar" style={{ alignSelf: props.variant }}>
            <div id={props.variant} className={"scrollButton"}>
                <img id="scrollArrow" src={scrollArrow} alt="Scroll Arrow" className={arrowClass} />
                <div id={gazeIndicatorID} className={gazeIndicatorClass}>
                </div>
            </div>
        </div>



    );


}


export default NavBar;