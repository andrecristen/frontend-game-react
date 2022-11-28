import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import NavBar from "../UI/NavBar";
import NavItem from "../UI/NavItem";

const Menu = (props) => {

    const { logout } = useContext(AuthContext);

    const onClickLogout = () => {
        logout();
    }

    return (
        <NavBar title="Bem-Vindo" id="menu">
            <NavItem title="Salas Disponíveis" route="/"></NavItem>
            <NavItem title="Minha Conta" route="/profile"></NavItem>
            <button type="button" onClick={onClickLogout} className="btn btn-sm btn-outline-danger">Sair</button>
        </NavBar>
    );
}

export default Menu;