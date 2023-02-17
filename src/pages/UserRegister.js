import React, {Component} from 'react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {Redirect} from 'react-router-dom';
import M from './M'
import Websocket from 'react-websocket';
import ReactGA from 'react-ga'; 

class UserRegister extends Component {

    componentDidMount() {
        document.title = "Registration Form"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/user-registration");
        document
            .getElementById("name")
            .focus();

    }
    handleData(data) {}

    sendMessage(message) {
        this
            .refWebSocket
            .sendMessage(message);

    }
    constructor() {
        super()

        this.state = {
            uid: "",
            password: "",
            isLoading: false,
            mydata: [],
            redirect: false,
            service: '',
            name:'',
            chkNewUser:'Please Complete all Field',
            landingPage:'',

        }
       
    }

    onchg = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]: value})

     

    }
    _handleKeyRel = (event) => {
        if (this.state.name != '') {
            axios
                .post(window.host + '/chkNewUser', this.state)
                .then(response => {
                    this.setState({chkNewUser: response.data})
                })
        }

     /*   if (this.state.name == ''||this.state.phone == ''||this.state.email == ''||this.state.service == ''||this.state.password == '')  {
            this.setState({chkNewUser: 'any field cannot be blank'})
        }*/

        
    }
    _handleKeyDown = (event) => {

        if (event.key === 'Enter') {

            if (event.target.name == 'name') {
                document
                    .getElementById("loginID")
                    .focus();
            } else if (event.target.name == 'loginID') {
                document
                    .getElementById("email")
                    .focus();
            } else if (event.target.name == 'email') {
                document
                    .getElementById("service")
                    .focus();
            } else if (event.target.name == 'service') {
                document
                    .getElementById("password")
                    .focus();
            } else if (event.target.name == 'password') {
                document
                    .getElementById("confirmPassword")
                    .focus();
            } else if (event.target.name == 'confirmPassword') {
                this.submit()
            }

        }
    }
    submit = async e => {
if(this.state.email='')
{
    this.setState({email: 'N/A'})
}
        if (this.state.name != '') {
            axios
                .post(window.host + '/chkNewUser', this.state)
                .then(response => {
                    this.setState({chkNewUser: response.data})
                })
            }
        this.setState({isLoading: true});
        axios
            .post(window.host + '/getLoginID', this.state)
            .then(response => {
                this.setState({uid: response.data[0].sl})

                axios
                    .post(window.host + '/login', this.state)
                    .then(response => {
                        this.sendMessage(JSON.stringify({receiver: this.state.uid, notify: "1"}));

                        this.setState({mydata: response.data})

                        NotificationManager.success('Successful', 'Authentication', 1000);
                        this.setState({isLoading: false});

                        window.login = "1";
                        window.uid = this.state.uid;
                        window.password = this.state.mydata[0].token;
                        window.org_id = this.state.mydata[0].org_id;
                        window.branch = this.state.mydata[0].branch;
                        this.setState({landingPage:this.state.mydata[0].landingPage});

                        this.setState({redirect: true})

                    })
                    .catch(error => {

                       
                        NotificationManager.error('Failed', 'Process Failed', 1000);
                        this.setState({isLoading: false});
                        this.sendMessage(JSON.stringify({receiver: this.state.uid, notify: "1"}));

                    })

            })
            .catch(error => {

                NotificationManager.error('Failed', 'Process Failed', 1000);
                this.setState({isLoading: false});
            })

    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.landingPage}/>
        }
        return (
            <div
                style={{
                marginTop: "-45px"
            }}
                class="hold-transition login-page">
                <div className="login-box">
                    
                    {/* /.login-logo */}
                    <div className="card">
                        <div className="card-body login-card-body">
                        <div className="login-logo">
                        <a href={window.app_url}>
                            <b>[]</b>
                        </a>
                    </div>
                            <p className="login-box-msg">Register a new membership</p>
                            <input
                                autoComplete="off"
                                onChange={this.onchg}
                                id="uid"
                                name="uid"
                                type="hidden"
                                className="form-control"
                                placeholder="User ID"
                                value={this.state.uid}/>

                            

                            <div className="input-group mb-3">
                                <input
                                    autoComplete="off"
                                    onChange={this.onchg}
                                    onKeyDown={this._handleKeyDown}
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    placeholder="Name"/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user"/>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    autoComplete="off"
                                    onChange={this.onchg}
                                    onKeyDown={this._handleKeyDown}
                                    onKeyUp={this._handleKeyRel}
                                    id="loginID"
                                    name="loginID"
                                    type="text"
                                    className="form-control"
                                    placeholder="Phone"/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-phone"/>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="input-group mb-3">
                                <select
                                    id="service"
                                    name="service"
                                    onKeyDown={this._handleKeyDown}
                                    onKeyUp={this._handleKeyRel}
                                    class="form-control"
                                    onChange={this.onchg}>
                                    <option value=''>Select Service</option>
                                    <option value='4'>point of sale system</option>
                                    <option value='6'>Education Managment System</option>
                                </select>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-bookmark"/>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    onChange={this.onchg}
                                    onKeyDown={this._handleKeyDown}
                                    onKeyUp={this._handleKeyRel}
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"/>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    onChange={this.onchg}
                                    onKeyDown={this._handleKeyDown}
                                    onKeyUp={this._handleKeyRel}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"/>
                                    </div>
                                </div>
                            </div>

                            



                            <div className="social-auth-links text-center mb-3">

                                <M></M>
                                <span>I agree <a href="https://nazrif.com/terms-and-conditions/" class="text-black" target="_blank">Terms & Conditions</a></span> | <span><a href="https://nazrif.com/privacy-policy/" class="text-black" target="_blank">Privacy Policy</a></span><br></br>
                                {this.state.isLoading
                                    ? <button
                                            onClick={this.submit}
                                            disabled={this.state.isLoading}
                                            className="btn btn-block btn-warning">

                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Sign in . . .<i class="fas fa-sign-in-alt"></i>
                                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        </button>
                                    : <button
                                        onClick={this.submit}
                                        disabled={this.state.isLoading}
                                        className="btn btn-block btn-warning">
                                    Sign Up <i class="fa fa-user-plus" aria-hidden="true"></i>
                                        
                                    </button>}

                                    <a className="btn btn-block btn-primary" href="/" >
                                    I already have a membership <i class="fas fa-sign-in-alt"></i>

                                </a>

                                <a className="btn btn-block btn-info" href="https://www.youtube.com/channel/UC6MF6TkmimUD2Z5MQcKKjVg/playlists" >
                                    Need Help? <i class="fa fa-support"></i></a>

                              

                            </div>
                            {this.state.chkNewUser != '1'
                                ? <p align="center">
                                        <font
                                            style={{
                                            color: 'red'
                                        }}>{this.state.chkNewUser}</font>
                                    </p>
                                : <></>}
                            {/* /.social-auth-links */}
                            <div class="lockscreen-footer text-center">
                                    <span><a href="#" class="text-black" target="_blank">Terms & Conditions</a></span> | <span><a href="#" class="text-black" target="_blank">Privacy Policy</a></span><br></br>
    Copyright &copy; 2017-2021 <b><a href="#" class="text-black">EDUBD.ONLINE</a></b><br></br>
    All rights reserved
  </div>
  <div className="input-group mb-3">
                                <input
                                    autoComplete="off"
                                    onChange={this.onchg}
                                    onKeyDown={this._handleKeyDown}
                                    onKeyUp={this._handleKeyRel}
                                    id="email"
                                    name="email"
                                    type="hidden"
                                    className="form-control"
                                    placeholder="Email (optional)"/>
                                
                            </div>

                        </div>
                        
                        {/* /.login-card-body */}
                    </div>
                </div>

                <NotificationContainer/>
                <Websocket
                    url={window.scoketIP}
                    onMessage={this
                    .handleData
                    .bind(this)}
                    ref={Websocket => {
                    this.refWebSocket = Websocket;
                }}/>

            </div>

        );
    }
}

export default UserRegister;
