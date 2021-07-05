    // Determine whether current gaze points lie within boundaries of a provided element. 
    export const isGazeWithinElement = (elementID, padding, x, y) => {
        let currentGazeX = x;
        let currentGazeY = y;

        let element = document.getElementById(elementID);

        let pointMinX = element.getBoundingClientRect().left - padding;
        let pointMinY = element.getBoundingClientRect().top - padding;
        let pointMaxX = element.getBoundingClientRect().right + padding;
        let pointMaxY = element.getBoundingClientRect().bottom + padding;

        let gazeWithinElement = currentGazeX >= pointMinX && currentGazeX < pointMaxX && currentGazeY >= pointMinY && currentGazeY < pointMaxY

        return gazeWithinElement;
    }