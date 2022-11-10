import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

import { AuthProvider } from "../contexts/auth"

import PrivateContainer from "../components/UI/PrivateContainer";

const AppRoutes = () => {

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route exact path="/login" element={<LoginPage />}></Route>
                    <Route exact path="/register" element={<RegisterPage />}></Route>
                    <Route exact path="/" element={<PrivateContainer><HomePage /></PrivateContainer>}></Route>
                    <Route exact path="/profile" element={<PrivateContainer><ProfilePage /></PrivateContainer>}></Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default AppRoutes;