import {
    Navigate
} from "react-router-dom";

import { AuthContext } from "../../contexts/auth";

import { useContext } from "react";

const PrivateContainer = ({ children }) => {

    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="loading">Carregando...</div>
    }
    if (!authenticated) {
        return (<Navigate to="/login" />);
    }
    return children;
}

export default PrivateContainer;