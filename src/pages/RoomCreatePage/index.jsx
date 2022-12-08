import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';
import Menu from "../../components/Home/Menu";
import Room from "../../models/Room";
import { useEffect } from "react";



const RoomCreatePage = function () {

    const { authenticated, user, registerRoom, listBoards } = useContext(AuthContext);

    let navigate = useNavigate();

    const [validatingRegister, setValidatingRegister] = useState(false);
    const [name, setName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("");
    const [board, setBoard] = useState("");
    const [loadingBoardList, setLoadingBoardList] = useState(true);
    const [boardList, setBoardList] = useState([]);

    useEffect(() => {
        listBoards().then((boardList) => {
            setBoardList(boardList);
            setLoadingBoardList(false);
        }).catch(() => {
            toast.error("Erro ao carregar mapas disponíveis, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        });
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        const room = new Room();
        room.name = name;
        room.max_players = maxPlayers;
        room.board = board;
        room.status = room.STATUS_WAITING_FOR_PLAYERS;
        room.owner = user.id;
        room.users = [user.id];
        setValidatingRegister(true);
        await registerRoom(room);
        setValidatingRegister(false);
    }

    const onClickBack = () => {
        navigate("/");
    }

    return (
        <div>
            <Menu></Menu>
            <div className="actions-container">
                <button onClick={onClickBack} className="btn btn-lg btn-danger">Voltar  <FontAwesomeIcon icon={faArrowCircleLeft} /></button>
            </div>
            {
                loadingBoardList
                    ?
                    <h1>
                        < FontAwesomeIcon icon={faSpinner} spin /> Carregando mapas
                    </h1 >
                    :
                    <section className="vh-100">
                        <div className="container">
                            <div className="row d-flex justify-content-center align-items-center h-100">
                                <div className="col-lg-12 col-xl-11">
                                    <div className="card text-black">
                                        <div className="card-body">
                                            <div className="row justify-content-center">
                                                <div className="col-md-10 col-lg-6 col-xl-5 order-1">

                                                    <p className="text-center h1 fw-bold mb-2 mx-1 mx-md-2 mt-2">Criar Sala</p>

                                                    <form className="mx-1 mx-md-4" onSubmit={submit}>

                                                        <div className="d-flex flex-row align-items-center mb-2">
                                                            <div className="form-outline flex-fill mb-0">
                                                                <input required type="text" placeholder="Nome*" onChange={(e) => setName(e.target.value)} className="form-control" />
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-center mb-2">
                                                            <div className="form-outline flex-fill mb-0">
                                                                <select required placeholder="Quantidade de Jogadores*" onChange={(e) => setMaxPlayers(e.target.value)} className="form-control" >
                                                                    <option value="">Quantidade de Jogadores</option>
                                                                    <option value="3">3 Jogadores</option>
                                                                    <option value="4">4 Jogadores</option>
                                                                    <option value="5">5 Jogadores</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-center mb-2">
                                                            <div className="form-outline flex-fill mb-0">
                                                                <select required placeholder="Tabuleiro*" onChange={(e) => setBoard(e.target.value)} className="form-control" >
                                                                    <option value="">Tabuleiro</option>
                                                                    {boardList.map((board) => (
                                                                        <option value={board.id}>{board.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex justify-content-center mb-2">
                                                            <button type="submit"
                                                                className="btn btn-primary btn-lg col-sm-12">
                                                                Criar {validatingRegister ? <FontAwesomeIcon icon={faSpinner} spin /> : ''}</button>
                                                        </div>

                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
            }

        </div>
    );
}

export default RoomCreatePage;