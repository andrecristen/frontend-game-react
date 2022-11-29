import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import Room from "../../models/Room";

const RoomItem = (props) => {

    let navigate = useNavigate();

    const { setRoomUserSession } = useContext(AuthContext);

    var room = new Room();

    const id = props.data.id;
    const players = props.data.users.length;
    const maxPlayers = props.data.max_players;
    const name = props.data.name;
    const status = props.data.status;

    var isOpen = (players < maxPlayers && status == room.STATUS_WAITING_FOR_PLAYERS);

    const onClickEnter = () => {
        setRoomUserSession(props.data);
        navigate("/room-wait");
    }

    return (
        <li className="list-group-item d-flex justify-content-between align-items-start">
            <div>
                <div className="fw-bold">{name}</div>
                {room.STATUS_LIST[status]}
                <br />
                {isOpen ? <button onClick={onClickEnter} className="btn btn-lg btn-danger">Entrar</button> : <div><br /><br /></div>}
            </div>
            <span className="badge bg-primary rounded-pill">{players} / {maxPlayers}</span>
        </li>
    );
}

export default RoomItem;