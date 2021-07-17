import './css/navbar.css';

import NavButton from "./NavButton.js";
import SubmitButton from "./SubmitButton";

const NavBar = (props) => {

    return (

        <div className="navbar">
            <NavButton
                context={props.context}
                type={props.type}
                scrollTrigger={props.scrollTrigger}
                scrollEnabled={props.scrollEnabled} /> 

        </div>

    ); 


}


export default NavBar;