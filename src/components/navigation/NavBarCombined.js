import './navbarcombined.css';

import NavButton from "./NavButton.js";

const NavBarCombined = (props) => {

    return (

        <div className="navbar">
            <NavButton
                context={props.context}
                type={"scroll-button-back"}
                scrollTrigger={props.scrollTrigger}
                scrollEnabled={props.scrollEnabledBack} />

            <NavButton
                context={props.context}
                type={"scroll-button-next"}
                scrollTrigger={props.scrollTrigger}
                scrollEnabled={props.scrollEnabledNext} />

        </div>

    );


}


export default NavBarCombined;