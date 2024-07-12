import React from "react";
import "./Menu.css";

const Menu = ({ onRouteChange }) => {
    return (   
            <div>
                <input onClick={onRouteChange} className="start" type="button" value="start game" />
            </div>
    );
};

export default Menu;