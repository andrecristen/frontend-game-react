import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Menu from "../../components/Home/Menu";
import RoomList from "../../components/Room/RoomList";
import "./styles.css"

const HomePage = function () {

    let navigate = useNavigate();

    const onClickCreateRoom = () => {
        navigate("/room-create");
    }

    return (
        <div>
            <Menu></Menu>
            <ToastContainer></ToastContainer>
            <div className="actions-container">
                <button onClick={onClickCreateRoom}className="btn btn-lg btn-success">Criar Sala  <FontAwesomeIcon icon={faPlusCircle} /></button>
            </div>
            <h1>Salas Disponíveis</h1>
            <br/>
            <RoomList></RoomList>
        </div>
    )
}

export default HomePage;