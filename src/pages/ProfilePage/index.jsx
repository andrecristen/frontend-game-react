import { useContext } from "react";
import Menu from "../../components/Home/Menu";
import { AuthContext } from "../../contexts/auth";


const ProfilePage = function () {

    const { user } = useContext(AuthContext);

    return (
        <div>
            <Menu></Menu>
            <h1>Minha Conta</h1>
            <div className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-12 fw-bold">Identificador</label>
                    <label className="col-sm-12">{user.id}</label>
                    <label className="col-sm-12 fw-bold">Nome</label>
                    <label className="col-sm-12">{user.first_name} {user.last_name}</label>
                    <label className="col-sm-12 fw-bold">E-mail</label>
                    <label className="col-sm-12">{user.email}</label>
                    <label className="col-sm-12 fw-bold">Usuário</label>
                    <label className="col-sm-12">{user.username}</label>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;