import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBan, faCircle, faCrown, faPaperPlane, faPlay, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
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
    const [webSocket, setWebSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [curretRoom, setCurrentRoom] = useState(room);

    const roomId = curretRoom && curretRoom.id ? curretRoom.id : null;
    let isOwner = (curretRoom && curretRoom.owner == user.id);
    let lastUserListLoaded = [];

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
                            setTimeout(() => {
                                validateConnection();
                            }, 1000);
                            break;
                        case "start_match":
                            executeStartMatch();
                            break;
                        case "message":
                            addMessage(jsonData.payload);
                            break;
                    }
                } else {
                    console.log("Mensagem Recebida não está no formato correto...");
                    console.table(jsonData);
                }
            };
            setWebSocket(ws);
        } else {
            console.log("Web Socket já conectado.");
        }
    }, []);

    const executeStartMatch = () => {
        if (webSocket) {
            webSocket.close();
        }
        navigate("/match");
    }

    const addMessage = (message) => {
        message.senderName = findUserName(message.sender);
        messages.push(message);
        let newMessages = messages.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.message === value.message && t.sender === value.sender
            ))
        );
        setSendMessage(null);
        setMessages(newMessages);
    }

    const findUserName = (id) => {
        let users = lastUserListLoaded.filter((value) => value.id == id);
        return users && users[0] && users[0].name ? users[0].name : "Usuário";
    }

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
                toast.error("Erro ao remover, tente novamente.", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } catch (exception) {
            toast.error("Erro ao remover, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const onClickStartMatch = () => {
        if (webSocket) {
            webSocket.send(JSON.stringify({
                event: "start_match"
            }));
        } else {
            toast.error("Erro, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const onClickSendMessage = () => {
        if (webSocket) {
            if (sendMessage) {
                webSocket.send(JSON.stringify({
                    event: "message",
                    message: sendMessage
                }));
                setSendMessage("");
            } else {
                toast.info("Digite a mensagem para enviar.", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } else {
            toast.error("Erro, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
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
                        <div className="container">
                            <div className="row clearfix">
                                <div className="col-lg-12">
                                    <div className="card chat-app">
                                        <div className="chat">
                                            <div className="chat-header clearfix">
                                                <div className="row">
                                                    <strong>Conversa</strong>
                                                </div>
                                            </div>
                                            <div className="chat-history">
                                                <ul className="m-b-0 chat-list-container">
                                                    {messages?.map(currentMessage => {
                                                        return (currentMessage.sender == user.id
                                                            ?
                                                            <li className="clearfix active">
                                                                <div className="message other-message float-right"> {currentMessage.message} </div>
                                                            </li>
                                                            :
                                                            <li classname="clearfix">
                                                                <div className="message my-message"><FontAwesomeIcon icon={faUser} /> { currentMessage.senderName}: <br/>{currentMessage.message}</div>
                                                            </li>);
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="chat-message clearfix">
                                                <div className="input-group mb-0">
                                                    <input type="text"
                                                        className="form-control"
                                                        placeholder="Digite a mensagem"
                                                        value={sendMessage}
                                                        onChange={(e) => setSendMessage(e.target.value)} />
                                                    <div className="input-group-prepend">
                                                        <button type="button" onClick={onClickSendMessage} className="btn btn-lg btn-primary btn-send"><FontAwesomeIcon icon={faPaperPlane} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isOwner ? <button className="btn btn-lg btn-success" onClick={() => { onClickStartMatch() }}><FontAwesomeIcon icon={faPlay} /> Iniciar Partida</button> : ''}
                        <br/>
                        <br/>
                    </section>
                </>
            }
        </div>
    );
}

export default RoomWaitPage;
