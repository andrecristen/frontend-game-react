import React, { useState, useEffect, createContext } from "react";

import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

import { api, auth } from "../services/api"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //On start/render view
    useEffect(() => {
        const userSession = localStorage.getItem("userSession");
        if (userSession) {
            setUser(JSON.parse(userSession));
        }
        setLoading(false);
    }, []);

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

    const logout = () => {
        localStorage.removeItem("userSession");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            //!! = Cast to boolean
            value={{ authenticated: !!user, loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}