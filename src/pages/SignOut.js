import React, {Component} from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route, Link, BrowserRouter as Router} from '../../node_modules//react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ReactGA from 'react-ga'; 
import cookie from 'react-cookies'
String.prototype.initCap = function () {
    return this
        .toLowerCase()
        .replace(/(?:^|\s)[a-z]/g, function (m) {
            return m.toUpperCase();
        });
};

class SignOut extends Component {

    componentDidMount() {
        document.title = "Sign Out"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/SignOut");

        cookie.remove('loginInfo', { path: '/' })
                        cookie.save('loginInfo',
                            {
                                login: "0",

                            }
                            , { path: '/' })

                            window.location.href = "/portal";

    }

    constructor() {
        super()
        this.state = {
           

        }
      
    }

   
   
     
   

    render() {

        return (
            <div
                class="content-wrapper"
                style={{
                marginBottom: "50px"
            }}>

                

                

                <NotificationContainer/>

            </div>
        )
    }
}

export default SignOut;