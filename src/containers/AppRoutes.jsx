import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

import { AuthProvider } from "../contexts/auth"

import PrivateContainer from "../components/UI/PrivateContainer";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes = () => {

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route exact path="/login" element={<LoginPage />}></Route>
                    <Route exact path="/" element={<PrivateContainer><HomePage /></PrivateContainer>}></Route>
                    <Route exact path="/profile" element={<PrivateContainer><ProfilePage /></PrivateContainer>}></Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default AppRoutes;