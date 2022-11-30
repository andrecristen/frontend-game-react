import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';
import Menu from "../../components/Home/Menu";
import Room from "../../models/Room";
import useWebSocket from 'react-use-websocket';
import { useEffect } from "react";



const RoomWaitPage = function () {

    let navigate = useNavigate();

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [connecting, setConnecting] = useState(true);
    const [userList, setUserList] = useState([]);
    const [webSocket, setWebSocket] = useState(null);

    const { user, room, socketUrl, getUsersRoom, enterRoom, exitRoom } = useContext(AuthContext);

    const roomId = room && room.id ? room.id : null;
    const isOwner = (room && room.owner == user.id);

    useEffect(() => {
        if (!webSocket) {
            var wsUrl = socketUrl() + "/ws/room/" + roomId + "/" + user.id + "/";

            let ws = new WebSocket(wsUrl);
            ws.onopen = (event) => {
                console.log(event, "Conexão Aberta");
                enterRoom(room).then((success) => {
                    if (!success) {
                        onClickExit();
                    } else {
                        setConnecting(false);
                        loadUsers();
                    }
                }).catch(() => {
                    onClickExit();
                });
            };
            ws.onerror = function (event) {
                toast.error('Não foi possível se conectar a sala escolhida.', {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate("/");
            };
            ws.onmessage = function (event) {
                let jsonData = JSON.parse(event.data);
                if (jsonData.payload && jsonData.payload.event) {
                    console.log("Mensagem recebida: " + jsonData.payload.event);
                    switch (jsonData.payload.event) {
                        case "new_player":
                        case "disconnect_player":
                            loadUsers();
                            break;
                    }
                } else {
                    console.log("Mensagem Recebida Não Usada...");
                    console.table(jsonData);
                }
            };
            setWebSocket(ws);
        }
    }, []);

    const loadUsers = async () => {
        setLoadingUsers(true);
        getUsersRoom(room).then((data) => {
            setUserList(data.users);
            setLoadingUsers(false);
        }).catch((exc) => {
            setLoadingUsers(false);
            toast.error("Erro ao carregar usuários da sala, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        });
    }

    const onClickExit = () => {
        exitRoom().then((success) => {
            if (success) {
                webSocket.close();
                navigate("/");
            } else {
                toast.error("Erro ao sair da sala, tente novamente.", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }).catch((exc) => {
            toast.error("Erro ao sair da sala, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        })
    }

    const onClickRemovePlayer = () => {

    }

    const onClickStartMatch = () => {

    }

    return (
        <div>
            <Menu />
            {connecting || loadingUsers
                ?
                <div className="icon-container text-center vh-100">
                    {connecting ? <strong>Conectando a sala...</strong> : <strong>Atualizando a sala...</strong>}
                    <br />
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
                :
                <>
                    <div className="actions-container">
                        <button onClick={onClickExit} className="btn btn-lg btn-danger">Sair Da Sala  <FontAwesomeIcon icon={faArrowCircleLeft} /></button>
                    </div>
                    <section className="vh-100">
                        <ol className="list-group list-group-numbered">
                            {userList?.map(user => {
                                return (
                                    <span>{user.name}</span>
                                );
                            })}
                        </ol>
                    </section>
                </>
            }
        </div>
    );
}

export default RoomWaitPage;
