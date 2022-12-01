import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faCircle, faPlugCircleCheck, faPlugCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'
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

    const { user, room, socketUrl, getUsersRoom, enterRoom, exitRoom } = useContext(AuthContext);

    const roomId = room && room.id ? room.id : null;
    const isOwner = (room && room.owner == user.id);
    let lastUserListLoaded = [];
    let webSocket;

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
                        case "disconnected_player":
                            loadUsers();
                            break;
                        case "remove_player":
                            validateConnection();
                            break;
                    }
                } else {
                    console.log("Mensagem Recebida Não Usada...");
                    console.table(jsonData);
                }
            };
            webSocket = ws;
        } else {
            console.log("Web Socket já conectado.");
        }
    }, []);

    const validateConnection = async () => {
        try {
            let response = await loadUsers();
            if (response) {
                var stayConnected = lastUserListLoaded.some(userComparation => userComparation.id == user.id);
                if (!stayConnected) {
                    webSocket.close();
                    if (user) {
                        toast.error("Você foi removido da sala.", {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    navigate("/");
                }
            }
        } catch (exception) {
            console.log(exception);
        }

    }

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);
            let data = await getUsersRoom(room)
            setUserList(data.users);
            lastUserListLoaded = data.users;
            setLoadingUsers(false);
            return true;
        } catch (exception) {
            console.log(exception);
            setLoadingUsers(false);
            toast.error("Erro ao carregar usuários da sala, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
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
                                    <span>{user.name} {user.status == "Online" ? <FontAwesomeIcon icon={faCircle} className="online" /> : <FontAwesomeIcon icon={faCircle} className="offline"/>}</span>
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
