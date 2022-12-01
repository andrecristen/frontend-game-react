import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBan, faCircle, faCrow, faCrown, faPlugCircleCheck, faPlugCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'
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

    const { user, room, socketUrl, getUsersRoom, enterRoom, exitRoom, sendRemoveUserRoom } = useContext(AuthContext);

    const roomId = room && room.id ? room.id : null;
    let isOwner = (room && room.owner == user.id);
    let lastUserListLoaded = [];
    let webSocket;

    useEffect(() => {
        isOwner = (room && room.owner == user.id);
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
                        toast.info("Você foi removido da sala.", {
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

    const onClickExit = async () => {
        try {
            let success = await exitRoom();
            if (success) {
                if (webSocket) {
                    webSocket.close();
                }
                navigate("/");
            } else {
                console.log(success);
                toast.error("Erro ao sair da sala, tente novamente.", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } catch (exception) {
            console.log(exception);
            toast.error("Erro ao sair da sala, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const onClickRemovePlayer = async (currentUser) => {
        try {
            let response = await sendRemoveUserRoom(room, currentUser);
            if (response) {
                toast.success("Sucesso ao remover usuário.", {
                    position: toast.POSITION.TOP_CENTER
                });
            } else {
                toast.success("Erro ao remover, tente novamente.", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } catch (exception) {
            toast.success("Erro ao remover, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
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
                        <ol className="list-group list-group-numbered list-user">
                            {userList?.map(currentUser => {
                                return (
                                    <div className="user-item">
                                        <span className="icon-status">{currentUser.status == "Online" ? <FontAwesomeIcon icon={faCircle} className="online" /> : <FontAwesomeIcon icon={faCircle} className="offline" />}</span>
                                        <span>{currentUser.name}</span>
                                        <span className="icon-owner">{room.owner == currentUser.id ? <FontAwesomeIcon icon={faCrown} /> : ""}</span>
                                        {isOwner && currentUser.id != user.id ? <button onClick={() => { onClickRemovePlayer(currentUser) }} className="btn btn-sm btn-danger icon-remove-user"><FontAwesomeIcon icon={faBan} /> Remover</button> : ""}
                                    </div>
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
