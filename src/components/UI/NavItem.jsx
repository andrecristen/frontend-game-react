import React from 'react';
import { useNavigate } from "react-router-dom";


const NavItem = (props) => {

    let navigate = useNavigate();

    const routeChange = () => {
        navigate(props.route);
    }

    return (
        <li className="nav-item" onClick={routeChange}>
            <a className="nav-link active" >{props.title}</a>
        </li>
    );
}

export default NavItem;