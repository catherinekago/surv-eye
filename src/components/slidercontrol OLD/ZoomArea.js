// import { useEffect, useState } from "react";
// import '../css/zoomarea.css';
// import { click } from "../functions/click";
// import { isGazeWithinElement } from '../functions/isGazeWithinElement';
// import { convertAngleToPx } from "../functions/convertAngleToPx";


// const ZoomArea = (props) => {

//     const [selectionFillClass, setSelectionFillClass] = useState("zoom-inner-fill");
//     const [eventListener, setEventListener] = useState(false);
  
  
//     const MINTARGETSIZE = convertAngleToPx(4.17);


//   // eslint-disable-next-line
//   useEffect(() => {

//     if (isGazeWithinElement("slider-zoom-group", 0, props.context.x, props.context.y)) {
//         if(!eventListener)
//         {
//           document.getElementById(props.idFill).addEventListener("transitionend", onTransitionEnd, false);
//           setEventListener(true);
//           console.log("ADDED EVENTLISTENER)");
//         }
    
//           if (isGazeWithinElement(props.idTarget, 0, props.context.x, props.context.y)) {
//             setSelectionFillClass("zoom-inner-fill transitioning");
//           } else {
//             setSelectionFillClass("zoom-inner-fill unselected transitioning");
//           }  
//     }

//     // This line makes the selected element disappear, but it throws an error when switching to slider element 
//     return () => {
//       if(document.getElementById(props.idFill) !== null) {
//       document.getElementById(props.idFill).removeEventListener("transitionend", onTransitionEnd);
//     }
//   }

//   });

//   // Handle fixation on scroll button
//   const onTransitionEnd = (event) => {
//     console.log(document.getElementById(props.idSelectionCircle).offsetHeight);
//     // console.log(Math.round(MINTARGETSIZE * 0.9 *0.8));
//     if (document.getElementById(props.idFill).offsetHeight === Math.round(MINTARGETSIZE) && event.propertyName === "width") {
//         props.onFixation();
//         click(props.idFill);

//     }
//     document.getElementById(props.idFill).removeEventListener("transitionend", onTransitionEnd);
//     setEventListener(false);
//     console.log("REMOVED EVENTLISTENER");

//   }

//   return (
//     <div style={{
//         minWidth: MINTARGETSIZE,
//         minHeight: MINTARGETSIZE*1.5,
//         height: MINTARGETSIZE*1.5
//       }} id={props.idTarget} className="zoom-container">

//         <div id={props.idFill} className={selectionFillClass} >
//         <p style={{ margin: "0", textAlign: "center", fontSize: "40px", color: "green", fontWeight: 800 }}>{props.icon}</p>
//         </div>
//     </div>
//   );
// }

// export default ZoomArea;