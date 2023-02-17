import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import DynamicUI from './pages/DynamicUI'
import Login from './pages/Login'
import Menu from './pages/Menu'
import Profile from './pages/Profile'
import MenuControl from './pages/MenuControl'
import MenuPages from './pages/MenuPages'
import MenuGroup from './pages/MenuGroup'
import MenuAccess from './pages/MenuAccess'
import PageCreator from './pages/DynamicUI_CRUDE';
import PasswordChange from './pages/PasswordChange';
import UserRegister from './pages/UserRegister';
import BioGasDashBoard from './pages/BioGasDashBoard';
import SchoolDashBoard from './pages/SchoolDashBoard';
import PoultryFarm from './pages/PoultryFarm';
import SignOut from './pages/SignOut';



import {Route, Link, BrowserRouter as Router} from '../node_modules/react-router-dom'
import * as serviceWorker from './serviceWorker';

window.test = "";
window.login = "0";
window.uid = "";
window.org_id = "";
window.branch = "";
window.password = "";
window.uName = "";
window.uImage = "";
window.socketPort = "0";
window.gatc="UA-174084476-1"
window.wss="off";

//alert(window.location.hostname)

window.hostIP = 'localhost'
window.host = 'https://localhost:2000/node'
window.app_url = "http://erp.nazrif.com"
window.scoketIP = "wss://localhost"
window.wss="off";
 
/*
else {
    window.host = 'https://api.nazrif.com/nazrif_api'
    window.app_url = "https://portal.nazrif.com"
    window.scoketIP = "wss://wss.nazrif.com"
    window.wss="off";

}
*/

/*window.host = 'https://api.amanaanalytics.com'
window.imageLoc = "https://test.amanaanalytics.com/userFiles";
window.app_url = "https://test.amanaanalytics.com"
window.scoketIP = "wss://ws.amanaanalytics.com" */

const router = (
    <Router basename={'/portal'}>
        <Route eaxct path="/" component={App}/>
        < Route path="/ui/:query_id/:edit_id" component={DynamicUI}/>
        <Route path="/Profile" component={Profile}/>
        < Route path="/Login" component={Login}/>
        <Route path="/Menu" component={Menu}/>
        < Route path="/MenuControl" component={MenuControl}/>
        <Route path="/MenuPages" component={MenuPages}/>
        < Route path="/MenuGroup" component={MenuGroup}/>
        <Route path="/MenuAccess" component={MenuAccess}/>
        < Route path="/PageCreator" component={PageCreator}/>
        <Route path="/PasswordChange" component={PasswordChange}/>
        < Route path="/UserRegistration" component={UserRegister}/>
        < Route path="/BioGasDashBoard" component={BioGasDashBoard}/>
        < Route path="/SchoolDashBoard" component={SchoolDashBoard}/>
        < Route path="/PoultryFarm" component={PoultryFarm}/>
        < Route path="/SignOut" component={SignOut}/>

        
        
        
        
        
       
    </Router>
)

ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. Learn
// more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
