import { useState, useContext } from "react";
import "./styles.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBan, faCircle, faCrow, faCrown, faPlugCircleCheck, faPlugCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from 'react-toastify';
import Menu from "../../components/Home/Menu";
import { useEffect } from "react";



const MatchPage = function () {

    let navigate = useNavigate();

    const [loadingBoard, setLoadingBoard] = useState(true);
    const [tableData, setTableData] = useState([]);

    const { user, room, findBoardRoom } = useContext(AuthContext);

    useEffect(() => {
        findBoardRoom(room).then((board) => {
            let tableDataAux = [];
            for (let line = 0; line < board.lines; line++) {
                let columnsData = [];
                for (let column = 0; column < board.columns; column++) {
                    columnsData.push({});
                }
                tableDataAux.push(columnsData);
            }
            setTableData(tableDataAux);
            setLoadingBoard(false);
        }).catch(() => {
            toast.error("Erro ao carregar partida, tente novamente.", {
                position: toast.POSITION.TOP_CENTER
            });
        });
    }, []);

    return (
        <div>
            {
                loadingBoard
                    ?
                    <h1>
                        < FontAwesomeIcon icon={faSpinner} spin /> Carregando partida
                    </h1 >
                    :
                    <div className="container">
                        <h2>Mapa Partida #{room.id}</h2>
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-striped m-10px">
                                <tbody>
                                    {tableData.map((columnData) => (
                                        <tr>
                                            {columnData.map((column => (
                                                <td className="cell">&nbsp;</td>
                                            )))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>
    );
}

export default MatchPage;
