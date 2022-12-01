import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../contexts/auth";
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import "./styles.css"
import { useNavigate } from "react-router-dom";

const LoginPage = function () {

    const { authenticated, login } = useContext(AuthContext);

    let navigate = useNavigate();

    const [validatingLogin, setValidatingLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setValidatingLogin(true);
        await login(email, password);
        setValidatingLogin(false);
    }

    const onClickRegister = () => {
        navigate("/register");
    }

    return (
        <div className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img
                            src="/img/logo_login.png"
                            className="img-fluid"
                            alt="Imagem de Login" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <h1>DSD - Trabalho Final</h1>
                        <form onSubmit={submit}>

                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Usuário"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2 col-sm-12">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg col-sm-12">
                                    Entrar {validatingLogin ? <FontAwesomeIcon icon={faSpinner} spin /> : ''}
                                </button>
                                <p
                                    className="small fw-bold mt-2 pt-1 mb-0 text-center">
                                    <button onClick={onClickRegister} className="btn link-danger">Não possui uma conta? Crie agora</button>
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;