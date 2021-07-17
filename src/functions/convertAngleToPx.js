    // Determine whether current gaze points lie within boundaries of a provided element. 
    export const convertAngleToPx = (angle) => {

        const onePxInCm = 0.0264583333;
        let screenheight = window.outerHeight;
        let screenHeightCm = screenheight * onePxInCm;
        // console.log("Monitor Resolution: " + screenheight);
        // console.log("Monitor Height: " + screenHeightCm);


        // This is only a rough estimation of typical distance between user and screen
        let distanceToScreen = 60; 

        let visualAngleDegree = ((180*Math.atan2(0.5*screenHeightCm, distanceToScreen))/ Math.PI)/ (0.5*screenheight);

        // console.log("Degree: " + visualAngleDegree);

        let pixel = Math.round(angle/visualAngleDegree);
        // console.log("Converted to " + pixel + " px");


        return pixel;
    }