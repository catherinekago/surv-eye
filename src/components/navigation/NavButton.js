import './navbutton.css';
import { useState, useEffect } from 'react';
import { click } from "../../functions/click";
import { isGazeWithinElement } from '../../functions/isGazeWithinElement';
import scrollIconBack from '../../assets/scrollArrowBack.svg';
import scrollIconNext from '../../assets/scrollArrowNext.svg';

const NavButton = (props) => {

    const gazeTriggerInterval = 1000;

    const [lastGazeTrigger, setLastGazeTrigger] = useState(new Date().getTime());

    const [gazeIndicatorClass, setGazeIndicatorClass] = useState("no-gaze-default");

    const [gazeIndicatorID, setGazeIndicatorID] = useState(props.type === "scroll-button-back" ? "gazeIndicatorBack" : "gazeIndicatorNext");

    // eslint-disable-next-line
    useEffect(() => {
        // let currentTime = new Date().getTime();
        // document.getElementById(gazeIndicatorID).addEventListener("transitionend", onTransitionEnd, false);
        // if (props.scrollEnabled && currentTime - lastGazeTrigger >= gazeTriggerInterval) {
        //     if (isGazeWithinElement(props.type, 0, props.context.x, props.context.y)) {
        //         setGazeIndicatorClass(props.type === "scroll-button-back" ? 'gaze-detected-back' : 'gaze-detected-next');
        //     } else {
        //         setGazeIndicatorClass(props.type === "scroll-button-back" ? 'no-gaze-detected-back' : 'no-gaze-detected-next');
        //     }

        // }
    });

      useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

    // Handle fixation on scroll button
    const onTransitionEnd = () => {

        if (document.getElementById(gazeIndicatorID).offsetWidth !== 0) {
            console.log("SCROLL TRANSITION");
            // click(props.type === "scroll-button-back" ? "scroll-icon-back" : "scroll-icon-next");
            setLastGazeTrigger(new Date().getTime());
            setGazeIndicatorClass("no-gaze-default");
            props.type === "scroll-button-back" ? props.scrollTrigger("back") : props.scrollTrigger("next");
        }

    }

    return (
        <div onClick={() => props.type === "scroll-button-back" ? props.scrollTrigger("back") : props.scrollTrigger("next")} id={props.type} className={"nav-button"}>
            <img id={props.type === "scroll-button-back" ? "scroll-icon-back" : "scroll-icon-next"} className="button-icon" src={props.type === "scroll-button-back" ? scrollIconBack : scrollIconNext} alt="Nav Icon" />
            <div id={gazeIndicatorID} className={gazeIndicatorClass} />
        </div>

    );

}


export default NavButton;