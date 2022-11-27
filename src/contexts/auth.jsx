import React, { useState, useEffect, createContext } from "react";

import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

import { URL_API, api, auth, create, createRoom, URL_WS } from "../services/api"

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

    return (
        <AuthContext.Provider
            value={{
                authenticated: user,
                loading,
                serverUrl,
                socketUrl,
                user,
                login,
                logout,
                register,
                registerRoom,
                room,
            }}>
            {children}
        </AuthContext.Provider>
    );
}