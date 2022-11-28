import {
    Navigate
} from "react-router-dom";

import { AuthContext } from "../../contexts/auth";

import { useContext } from "react";

const PrivateContainer = ({ children }) => {

    const { authenticated, loading, room } = useContext(AuthContext);

    if (loading) {
        return <div className="loading">Carregando...</div>
    }
    if (!authenticated) {
        return (<Navigate to="/login" />);
    }

    if (room) {
        //return (<Navigate to="/room-wait" />);
    }

    return children;
}

export default PrivateContainer;