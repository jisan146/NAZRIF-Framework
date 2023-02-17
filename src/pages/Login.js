import React, { Component } from 'react';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Redirect } from 'react-router-dom';
import { Route, Link, BrowserRouter as Router } from '../../node_modules/react-router-dom'
import M from './M'
import Websocket from 'react-websocket';
import ReactGA from 'react-ga';
import cookie from 'react-cookies'

class Login extends Component {

    componentDidMount() {
        document.title = "Login"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/login");
        document
            .getElementById("loginID")
            .focus();

            try{
            var loginInfo = cookie.load('loginInfo');
            if (loginInfo.login == "1") {
                
                window.login = "1";
                window.uid = loginInfo.uid;
                window.password = loginInfo.password;
                window.org_id = loginInfo.org_id;
                window.branch = loginInfo.branch;
                this.setState({ landingPage: loginInfo.landingPage });
                this.setState({ redirect: 1 })
            }}catch{}

    }
    handleData(data) { }

    sendMessage(message) {

        if (window.wss == "on") {
            this
                .refWebSocket
                .sendMessage(message);
        }


    }
    constructor() {
        super()

        this.state = {
            uid: "",
            password: "",
            isLoading: false,
            mydata: [],
            redirect: 0,
            name: '',
            landingPage: '',
        }


    }

    onchg = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value })

    }
    _handleKeyDown = (event) => {
        if (event.key === 'Enter') {

            if (event.target.name == 'loginID') {
                document
                    .getElementById("password")
                    .focus();
            } else if (event.target.name == 'password') {
                this.submit()
            }

        }
    }

    UserRegistration = async e => {
        window.login = 2;
        this.setState({ redirect: 2 })
    }

    componentWillMount() {


        //  alert(JSON.stringify(cookie.load('loginInfo')))

        /*
        { 
                                  login: "1", 
                                  uid: this.state.uid,
                                  password: this.state.mydata[0].token,
                                  org_id: this.state.mydata[0].org_id,
                                  branch: this.state.mydata[0].branch,
                                  landingPage:this.state.mydata[0].landingPage,
                                  redirect:1
                              }
        */

      /*  var loginInfo = cookie.load('loginInfo');
        if (loginInfo.login == "1") {
            alert('login set')
            window.login = "1";
            window.uid = loginInfo.uid;
            window.password = loginInfo.password;
            window.org_id = loginInfo.org_id;
            window.branch = loginInfo.branch;
            this.setState({ landingPage: loginInfo.landingPage });
            this.setState({ redirect: 1 })
        }*/


    }


    submit = async e => {

        this.setState({ isLoading: true });
        axios
            .post(window.host + '/getLoginID', this.state)
            .then(response => {
                this.setState({ uid: response.data[0].sl })

                axios
                    .post(window.host + '/login', this.state)
                    .then(response => {
                        this.sendMessage(JSON.stringify({ receiver: this.state.uid, notify: "1", uid: this.state.uid }));

                        this.setState({ mydata: response.data })

                        NotificationManager.success('Successful', 'Authentication', 1000);
                        this.setState({ isLoading: false });




                        window.login = "1";
                        window.uid = this.state.uid;
                        window.password = this.state.mydata[0].token;
                        window.org_id = this.state.mydata[0].org_id;
                        window.branch = this.state.mydata[0].branch;
                        this.setState({ landingPage: this.state.mydata[0].landingPage });

                        cookie.save('loginInfo',
                            {
                                login: "1",
                                uid: this.state.uid,
                                password: this.state.mydata[0].token,
                                org_id: this.state.mydata[0].org_id,
                                branch: this.state.mydata[0].branch,
                                landingPage: this.state.mydata[0].landingPage,
                                redirect: 1
                            }
                            , { path: '/' })


                        this.setState({ redirect: 1 })

                    })
                    .catch(error => {
                        console.log(error)
                        cookie.remove('loginInfo', { path: '/' })
                        cookie.save('loginInfo',
                            {
                                login: "0",

                            }
                            , { path: '/' })

                        NotificationManager.error('Failed', 'Process Failed', 1000);
                        this.setState({ isLoading: false });
                        this.sendMessage(JSON.stringify({ receiver: this.state.uid, notify: "1" }));

                    })

            })
            .catch(error => {
                console.log(error)
                NotificationManager.error('Failed', 'Process Failed', 1000);
                this.setState({ isLoading: false });
            })

    }

    render() {
        if (this.state.redirect == 1) {
            return <Redirect to={this.state.landingPage} />
        } else if ((this.state.redirect == 2)) {
            return <Redirect to='/UserRegistration' />
        }
        return (
            <div
                style={{
                    marginTop: "-45px"
                }}
                class="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <a href={window.app_url}>
                            <b>[]</b>
                        </a>
                    </div>
                    {/* /.login-logo */}
                    <div className="card">
                        <div className="card-body login-card-body">
                            <p className="login-box-msg">Sign in to start your session</p>
                            <input
                                autoComplete="off"
                                onChange={this.onchg}
                                id="uid"
                                name="uid"
                                type="hidden"
                                className="form-control"
                                placeholder="User ID"
                                value={this.state.uid} />
                            <div className="input-group mb-3">
                                <input
                                    autoComplete="off"
                                    onChange={this.onchg}
                                    onKeyDown={this._handleKeyDown}
                                    id="loginID"
                                    name="loginID"
                                    type="text"
                                    className="form-control"
                                    placeholder="User ID / Email / Phone" />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    onChange={this.onchg}
                                    onKeyDown={this._handleKeyDown}
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Password" />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>

                            <div className="social-auth-links text-center mb-3">

                                <M></M>

                                {this.state.isLoading
                                    ? <button
                                        onClick={this.submit}
                                        disabled={this.state.isLoading}
                                        className="btn btn-block btn-primary">

                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Sign in . . .<i class="fas fa-sign-in-alt"></i>
                                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    </button>
                                    : <button
                                        onClick={this.submit}
                                        disabled={this.state.isLoading}
                                        className="btn btn-block btn-primary">
                                        Sign in  <i class="fas fa-sign-in-alt"></i>

                                    </button>}

                                <Link className="btn btn-block btn-warning" onClick={this.UserRegistration} >
                                    New Membership <i class="fa fa-user-plus" aria-hidden="true"></i>

                                </Link>

                                <a className="btn btn-block btn-info" href="https://www.youtube.com/channel/UC6MF6TkmimUD2Z5MQcKKjVg/playlists" >
                                    Need Help? <i class="fa fa-support"></i></a>


                                <div class="lockscreen-footer text-center">
                                    <span><a href="#" class="text-black" target="_blank">Terms & Conditions</a></span> | <span><a href="#" class="text-black" target="_blank">Privacy Policy</a></span><br></br>
    Copyright &copy; 2017-2021 <b><a href="#" class="text-black">EDUBD.ONLINE</a></b><br></br>
    All rights reserved
  </div>
                            </div>
                            {/* /.social-auth-links */}

                        </div>
                        {/* /.login-card-body */}
                    </div>
                </div>

                <NotificationContainer />
                <Websocket
                    url={window.scoketIP}
                    onMessage={this
                        .handleData
                        .bind(this)}
                    ref={Websocket => {
                        this.refWebSocket = Websocket;
                    }} />

            </div>

        );
    }
}

export default Login;
