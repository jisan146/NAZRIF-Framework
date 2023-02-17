import React from 'react';
import logo from './logo.svg';
import './App.css';
import Menu from './pages/Menu'
import Login from './pages/Login'
import Reg from './pages/UserRegister'

import Dt from './pages/Dt'
function App() {

    if (window.login == "0") {
        return <Login></Login>

    } else if (window.login == "2") {
        return < Reg > </Reg>
    } else {
        return <Menu></Menu>
    }
}

export default App;
