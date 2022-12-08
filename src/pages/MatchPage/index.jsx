import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBan, faCircle, faCrow, faCrown, faPlugCircleCheck, faPlugCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';
import Menu from "../../components/Home/Menu";
import { useEffect } from "react";



const MatchPage = function () {

    let navigate = useNavigate();

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [connecting, setConnecting] = useState(true);
    const [userList, setUserList] = useState([]);

    const { user, room } = useContext(AuthContext);

    const roomId = room && room.id ? room.id : null;
    let isOwner = (room && room.owner == user.id);
    let lastUserListLoaded = [];
    let webSocket;

    useEffect(() => {

    }, []);

    return (
        <div>

        </div>
    );
}

export default MatchPage;
