import './css/navbutton.css';
import { useState, useEffect } from 'react';
import { click } from "./functions/click";
import { isGazeWithinElement } from './functions/isGazeWithinElement';
import scrollIconTop from './assets/scrollArrowTop.svg';
import scrollIconBottom from './assets/scrollArrowBottom.svg';

const NavButton = (props) => {

    const gazeTriggerInterval = 1000;

    const [lastGazeTrigger, setLastGazeTrigger] = useState(new Date().getTime());

    const [gazeIndicatorClass, setGazeIndicatorClass] = useState("no-gaze-default");

    const [gazeIndicatorID, setGazeIndicatorID] = useState("gazeIndicator01");

    // eslint-disable-next-line
    useEffect(() => {
        setGazeIndicatorID(props.type === "scroll-button-top" ? "gazeIndicator01" : "gazeIndicator02");
        let currentTime = new Date().getTime();
        document.getElementById(gazeIndicatorID).addEventListener("transitionend", onTransitionEnd, false);
        if (props.scrollEnabled && currentTime - lastGazeTrigger >= gazeTriggerInterval) {
            if (isGazeWithinElement(props.type, 0, props.context.x, props.context.y)) {
                setGazeIndicatorClass(props.type === "scroll-button-top" ? 'gaze-detected-top' : 'gaze-detected-bottom');
            } else {
                setGazeIndicatorClass(props.type === "scroll-button-top" ? 'no-gaze-detected-top' : 'no-gaze-detected-bottom');
            }

        }
    });

      useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

    // Handle fixation on scroll button
    const onTransitionEnd = () => {

        if (document.getElementById(gazeIndicatorID).offsetHeight === 150) {
            click(props.type === "scroll-button-top" ? "scroll-icon-top" : "scroll-icon-bottom");
            setLastGazeTrigger(new Date().getTime());
            setGazeIndicatorClass("no-gaze-default");
            props.type === "scroll-button-top" ? props.scrollTrigger("up") : props.scrollTrigger("down");
        }

    }

    return (
        <div id={props.type} className={"nav-button"}>
            <img id={props.type === "scroll-button-top" ? "scroll-icon-top" : "scroll-icon-bottom"} className="button-icon" src={props.type === "scroll-button-top" ? scrollIconTop : scrollIconBottom} alt="Nav Icon" />
            <div id={gazeIndicatorID} className={gazeIndicatorClass} />
        </div>

    );

}


export default NavButton;