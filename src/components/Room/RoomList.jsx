import { faRefresh, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import RoomItem from "./RoomItem";

const RoomList = (props) => {

    const [reloadingRooms, setReloadingRooms] = useState(false);
    const [foundRooms, setFoundRooms] = useState([]);


    const { roomList } = useContext(AuthContext);

    //On start/render view
    useEffect(() => {
        reload();
    }, []);

    const onClickReload = () => {
        reload();
    }

    const reload = () => {
        setFoundRooms([]);
        setReloadingRooms(true);
        roomList().then((data) => {
            setFoundRooms(data);
            setReloadingRooms(false);
        }).catch((exc) => {
            setReloadingRooms(false);
        });
    }

    return (
        <div>
            <div className="actions-container">
                <button onClick={onClickReload} className="btn btn-lg btn-primary">{reloadingRooms ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faRefresh} />}</button>
            </div>
            <ol className="list-group list-group-numbered">
                {foundRooms.map(room => {
                    return (
                        <RoomItem data={room}></RoomItem>
                    );
                })}
            </ol>
            {foundRooms.length == 0 ? <strong>Nenhuma sala</strong> : ''}
        </div>
    );
}

export default RoomList;