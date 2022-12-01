import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBan, faCircle, faCrow, faCrown, faPlugCircleCheck, faPlugCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';
import Menu from "../../components/Home/Menu";
import { useEffect } from "react";



const RoomWaitPage = function () {

    let navigate = useNavigate();

    const { user, room, socketUrl, getUsersRoom, enterRoom, exitRoom, sendRemoveUserRoom, getRoom } = useContext(AuthContext);

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [connecting, setConnecting] = useState(true);
    const [userList, setUserList] = useState([]);
    const [curretRoom, setCurrentRoom] = useState(room);

    const roomId = curretRoom && curretRoom.id ? curretRoom.id : null;
    let isOwner = (curretRoom && curretRoom.owner == user.id);
    let lastUserListLoaded = [];
    let webSocket;

    useEffect(() => {
        if (!webSocket) {
            var wsUrl = socketUrl() + "/ws/room/" + roomId + "/" + user.id + "/";

            let ws = new WebSocket(wsUrl);
            ws.onopen = (event) => {
                console.log(event, "Conexão Aberta");
                enterRoom(curretRoom).then((success) => {
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
                            setTimeout(() => {
                                reloadRoom();
                            }, 1000);
                            break;
                        case "remove_player":
                            setTimeout(async () => {
                                validateConnection();
                            }, 1000);
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
            let successReload = await reloadRoom();
            if (successReload) {
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
            }
        } catch (exception) {
            console.log(exception);
        }

    }


    const loadUsers = async () => {
        try {
            setLoadingUsers(true);
            let data = await getUsersRoom(curretRoom)
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

    const reloadRoom = async () => {
        try {
            let successLoadUser = await loadUsers();
            if (successLoadUser) {
                let dataRoom = await getRoom(curretRoom.id);
                if (dataRoom) {
                    setCurrentRoom(dataRoom);
                }
            }
            return true;
        } catch (exception) {
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
            let response = await sendRemoveUserRoom(curretRoom, currentUser);
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
                        <button onClick={onClickExit} className="btn btn-lg btn-danger"><FontAwesomeIcon icon={faArrowCircleLeft} /> Sair da Sala</button>
                    </div>
                    <section className="vh-100">
                        <h2>Usuários</h2>
                        <ol className="list-group list-group-numbered list-user">
                            {userList?.map(currentUser => {
                                return (
                                    <div className="user-item">
                                        <div className="col-11 user-item-infos">
                                            <span className="icon-status" title={currentUser.status}>{currentUser.status == "Online" ? <FontAwesomeIcon icon={faCircle} className="online" /> : <FontAwesomeIcon icon={faCircle} className="offline" />}</span>
                                            <span>{currentUser.id == user.id ? "*" : ""} {currentUser.name}</span>
                                            <span className="icon-owner">{curretRoom.owner == currentUser.id ? <FontAwesomeIcon title="Dono da sala" icon={faCrown} /> : ""}</span>
                                        </div>
                                        <div className="col-1">
                                            {isOwner && currentUser.id != user.id ? <button title="Remover usuário da sala" onClick={() => { onClickRemovePlayer(currentUser) }} className="btn btn-sm btn-danger"><FontAwesomeIcon icon={faBan} /></button> : ""}
                                        </div>
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
