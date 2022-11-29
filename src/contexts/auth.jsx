import React, { useState, useEffect, createContext } from "react";

import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

import { URL_API, URL_WS, api, auth, create, listRoom, findRoom, usersRoom, createRoom, editRoom } from "../services/api"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    //On start/render view
    useEffect(() => {
        const userSession = localStorage.getItem("userSession");
        if (userSession) {
            setUser(JSON.parse(userSession));
        }
        const roomSession = localStorage.getItem("roomSession");
        if (roomSession) {
            setRoom(JSON.parse(roomSession));
        }
        setLoading(false);
    }, []);


    const serverUrl = () => {
        return URL_API;
    }

    const socketUrl = () => {
        return URL_WS;
    }

    const login = async (email, password) => {
        const response = await auth(email, password);
        if (response.status == 200) {
            const loggedUser = response.data;
            localStorage.setItem("userSession", JSON.stringify(loggedUser));
            setUser(loggedUser);
            navigate("/");
        } else {
            toast.error('Não foi possível realizar o login com as credenciais informadas.', {
                position: toast.POSITION.TOP_CENTER
            });
            navigate("/login");
        }
    };

    const register = async (user) => {
        const response = await create(user);
        if (response.status == 200 || response.status == 201) {
            navigate("/login");
        } else {
            toast.error("Erro ao criar conta, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    const logout = () => {
        localStorage.removeItem("userSession");
        setUser(null);
        navigate("/login");
    };

    const roomList = async () => {
        const response = await listRoom();
        if (response.status == 200 || response.status == 201) {
            return response.data;
        } else {
            toast.error("Erro ao buscar salas, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const getRoom = async (id) => {
        const response = await findRoom(id);
        if (response.status == 200 || response.status == 201) {
            return response.data;
        } else {
            toast.error("Erro ao buscar salas, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const getUsersRoom = async (room) => {
        const response = await usersRoom(room);
        if (response.status == 200 || response.status == 201) {
            return response.data;
        } else {
            toast.error("Erro ao buscar usuários na sala, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const registerRoom = async (room) => {
        const response = await createRoom(room);
        if (response.status == 200 || response.status == 201) {
            const roomUser = response.data;
            localStorage.setItem("roomSession", JSON.stringify(roomUser));
            setRoom(roomUser);
            navigate("/room-wait");
        } else {
            toast.error("Erro ao criar sala, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    const setRoomUserSession = (room) => {
        localStorage.setItem("roomSession", JSON.stringify(room));
        setRoom(room);
    }

    const updateRoom = async (room, setRoomSession) => {
        const response = await editRoom(room);
        if (response.status == 200 || response.status == 201) {
            const roomUser = response.data;
            if (setRoomSession) {
                setRoomUserSession(roomUser);
            }
            return true;
        } else {
            toast.error("Erro ao criar sala, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }
    };

    const enterRoom = async (room) => {
        try {
            const dataRoom = await getRoom(room.id);
            if (dataRoom) {
                dataRoom.users.push(user.id);
                if (!dataRoom.owner) {
                    dataRoom.owner = user.id;
                }
                return await updateRoom(dataRoom, true)
            }
            return false;
        } catch (exc) {
            return false;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                //Defines
                serverUrl,
                socketUrl,
                loading,
                //User
                authenticated: user,
                user,
                login,
                logout,
                register,
                //Room
                setRoomUserSession,
                room,
                getRoom,
                getUsersRoom,
                roomList,
                registerRoom,
                updateRoom,
                enterRoom,
            }}>
            {children}
        </AuthContext.Provider>
    );
}