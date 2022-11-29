import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import User from "../../models/User";
import { toast } from 'react-toastify';



const RegisterPage = function () {

    const { authenticated, register } = useContext(AuthContext);

    let navigate = useNavigate();

    const [validatingRegister, setValidatingRegister] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        if (confirmPassword == password) {
            const user = new User();
            user.first_name = firstName;
            user.last_name = lastName;
            user.username = username;
            user.email = email;
            user.password = password;
            user.birth_date = "2000-09-03";
            //user.date_joined = "";
            setValidatingRegister(true);
            await register(user);
            setValidatingRegister(false);
        } else {
            setValidatingRegister(false);
            toast.error('Os campos Senha e Confirmar Senha devem ser iguais.', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const onClickLogin = () => {
        navigate("/login");
    }

    return (
        <section className="vh-100">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black">
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-1">

                                        <p className="text-center h1 fw-bold mb-2 mx-1 mx-md-2 mt-2">Criar Conta</p>

                                        <form className="mx-1 mx-md-4" onSubmit={submit}>

                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-outline flex-fill mb-0">
                                                    <input required type="text" placeholder="Nome" onChange={(e) => setFirstName(e.target.value)} className="form-control" />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-outline flex-fill mb-0">
                                                    <input required type="text" placeholder="Sobrenome" onChange={(e) => setLastName(e.target.value)} className="form-control" />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-outline flex-fill mb-0">
                                                    <input required type="text" placeholder="Nome de usuário" onChange={(e) => setUsername(e.target.value)} className="form-control" />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-outline flex-fill mb-0">
                                                    <input required type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="form-control" />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-outline flex-fill mb-0">
                                                    <input required type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} className="form-control" />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <div className="form-outline flex-fill mb-0">
                                                    <input required type="password" placeholder="Confirmar Senha" onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" />
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-center mb-2">
                                                <button type="submit"
                                                    className="btn btn-primary btn-lg col-sm-12">
                                                    Criar {validatingRegister ? <FontAwesomeIcon icon={faSpinner} spin /> : ''}</button>
                                            </div>

                                        </form>
                                        <div className="text-center text-lg-start mt-1 pt-2 col-sm-12">
                                            <p
                                                className="small fw-bold pt-1 mb-0 text-center">
                                                <button onClick={onClickLogin} className="btn link-danger">Já possui uma conta? Efetue Login</button>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-2">

                                        <img
                                            src={"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"}
                                            className="img-fluid"
                                            alt="Sample image" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterPage;
