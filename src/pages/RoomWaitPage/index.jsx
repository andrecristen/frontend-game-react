import { useState, useContext } from "react";
import "./styles.css"

import { ToastContainer } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';
import Menu from "../../components/Home/Menu";
import Room from "../../models/Room";
import useWebSocket from 'react-use-websocket';



const RoomWaitPage = function () {

    let navigate = useNavigate();

    const [validatingRegister, setValidatingRegister] = useState(false);
    const { user, room, socketUrl } = useContext(AuthContext);


    const roomId = room && room.id ? room.id : null;

    var wsUrl = socketUrl() + "/ws/room/" + roomId + "/";

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(wsUrl, {
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
            toast.error('Não foi possível realizar o login com as credenciais informadas.', {
                position: toast.POSITION.TOP_CENTER
            });
            navigate("/");
        },
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 300
    });

    const submit = async (e) => {

    }

    const onClickExit = () => {
        getWebSocket().close();
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