import { useState, useContext } from "react";
import "./styles.css"

import { ToastContainer } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';
import Menu from "../../components/Home/Menu";
import Room from "../../models/Room";
import useWebSocket from 'react-use-websocket';



const RoomWaitPage = function () {

    const { user, room, socketUrl } = useContext(AuthContext);

    var wsUrl = socketUrl() + "/ws/room/" + room.id + "/";

    console.log(wsUrl);

    const { lastJsonMessage, sendMessage } = useWebSocket(wsUrl, {
        onOpen: () => {
            console.log("WebSocket conectado.");
        },
        onMessage: () => {
            if (lastJsonMessage) {
                console.log(lastJsonMessage);
            }
        },
        queryParams: { 'user': user.id },
        onError: (event) => { 
            console.error(event); 
        },
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    });

    let navigate = useNavigate();

    const [validatingRegister, setValidatingRegister] = useState(false);

    const submit = async (e) => {

    }

    const onClickExit = () => {
        navigate("/");
    }

    return (
        <div>
            <Menu></Menu>
            <div className="actions-container">
                <button onClick={onClickExit} className="btn btn-lg btn-danger">Sair Da Sala  <FontAwesomeIcon icon={faArrowCircleLeft} /></button>
            </div>
            <section className="vh-100">
                <ToastContainer></ToastContainer>
                <div className="container">
                    <span>Teste</span>
                </div>
            </section>
        </div>
    );
}

export default RoomWaitPage;