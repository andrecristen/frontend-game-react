import Menu from "../../components/Home/Menu";
import RoomList from "../../components/Room/RoomList";

const HomePage = function () {

    return (
        <div>
            <Menu></Menu>
            <h1>Página inicial</h1>
            <br/>
            <RoomList></RoomList>
        </div>
    )
}

export default HomePage;