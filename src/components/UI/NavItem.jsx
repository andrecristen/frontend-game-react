import React from 'react';
import { useNavigate } from "react-router-dom";


const NavItem = (props) => {

    let navigate = useNavigate();

    const routeChange = () => {
        navigate(props.route);
    }

    return (
        <li className="nav-item" onClick={routeChange} style={{cursor: "pointer"}}>
            <a className={props.active ? 'nav-link active' : 'nav-link'} >{props.title}</a>
        </li>
    );
}

export default NavItem;