import NavBar from "./NavBar";
import { WebGazeContext } from './WebGazeContext';

const Questionnaire = () => {

    return (
        
        <WebGazeContext.Consumer >
        {context => (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height:"-webkit-fill-available"

        }}>
    <NavBar context={context} position="scroll-button-top"/>
    <NavBar context={context} position="scroll-button-bottom"/>

</div >
        )}
        </WebGazeContext.Consumer>
    );


}


export default Questionnaire;