import { useContext } from "react";
import Menu from "../../components/Home/Menu";
import { AuthContext } from "../../contexts/auth";


const ProfilePage = function () {

    const { user } = useContext(AuthContext);

    return (
        <div>
            <Menu></Menu>
            <h1>Minha Conta</h1>
            <br/>
            <div className="form-horizontal">
                <label className="col-sm-12 fw-bold">Identificador:</label>
                <br/>
                <label className="col-sm-12">{user.id}</label>
                <br/>
                <br/>
                <label className="col-sm-12 fw-bold">Nome:</label>
                <br/>
                <label className="col-sm-12">{user.first_name} {user.last_name}</label>
                <br/>
                <br/>
                <label className="col-sm-12 fw-bold">E-mail:</label>
                <br/>
                <label className="col-sm-12">{user.email}</label>
                <br/>
                <br/>
                <label className="col-sm-12 fw-bold">Usuário:</label>
                <br/>
                <label className="col-sm-12">{user.username}</label>
            </div>
        </div>
    )
}

export default ProfilePage;