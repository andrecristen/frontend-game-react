import './App.css';

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import AppRoutes from "./AppRoutes"

function App() {

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
