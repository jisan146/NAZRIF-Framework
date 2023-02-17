import React, {Component} from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route, Link, BrowserRouter as Router} from '../../node_modules//react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ReactGA from 'react-ga'; 
String.prototype.initCap = function () {
    return this
        .toLowerCase()
        .replace(/(?:^|\s)[a-z]/g, function (m) {
            return m.toUpperCase();
        });
};

class PasswordChange extends Component {

    componentDidMount() {
        document.title = "Change Password"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/change-password");

    }

    constructor() {
        super()
        this.state = {
            mydata: [],
            isLoading: false,
            uid: "",
            disabled: true

        }
      
    }

    onchg = (event) => {

        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]: value})
        if (name == 'np') {
            var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{6,20}$/;
            if (value.match(passw)) {

                var i = 0;
                var inputs = document.getElementsByTagName('input');
                for (i = 0; i < inputs.length; i++) {
                    if (inputs[i].name == 'np') {
                        inputs[i].style.border = '1px solid green'
                        this.setState({step2: 1})

                    }
                }

            } else {
                var i = 0;
                var inputs = document.getElementsByTagName('input');
                for (i = 0; i < inputs.length; i++) {
                    if (inputs[i].name == 'np') {
                        inputs[i].style.border = '1px solid red'
                        this.setState({step2: 0})
                    }
                }

            }
        } else if (name == 'cnp') {
            if (value == this.state.np) {
                var i = 0;
                var inputs = document.getElementsByTagName('input');
                for (i = 0; i < inputs.length; i++) {
                    if (inputs[i].name == 'cnp') {
                        inputs[i].style.border = '1px solid green'
                        this.setState({step3: 1})

                    }
                }
            } else {
                var i = 0;
                var inputs = document.getElementsByTagName('input');
                for (i = 0; i < inputs.length; i++) {
                    if (inputs[i].name == 'cnp') {
                        inputs[i].style.border = '1px solid red'
                        this.setState({step3: 0})

                    }
                }
            }
        } else if (name == 'cp') {
            axios
                .post(window.host + '/matchPassword', {
                loginID: window.uid,
                password: value
            })
                .then(response => {

                    var i = 0;
                    var inputs = document.getElementsByTagName('input');
                    for (i = 0; i < inputs.length; i++) {
                        if (inputs[i].name == 'cp') {
                            inputs[i].style.border = '1px solid green'
                            this.setState({step1: 1})

                        }
                    }
                })
                .catch(error => {

                    var i = 0;
                    var inputs = document.getElementsByTagName('input');
                    for (i = 0; i < inputs.length; i++) {
                        if (inputs[i].name == 'cp') {
                            inputs[i].style.border = '1px solid red'
                            this.setState({step1: 0})

                        }
                    }

                })
        }
    }
    _handleKeyDown = (event) => {
        if (event.key === 'Enter') {

            if (event.target.name == 'cp') {
                axios
                    .post(window.host + '/matchPassword', {
                    loginID: window.uid,
                    password: this.state.cp
                })
                    .then(response => {

                        var i = 0;
                        var inputs = document.getElementsByTagName('input');
                        for (i = 0; i < inputs.length; i++) {
                            if (inputs[i].name == 'cp') {
                                inputs[i].style.border = '1px solid green'
                                this.setState({step1: 1})

                            }
                        }
                    })
                    .catch(error => {

                        var i = 0;
                        var inputs = document.getElementsByTagName('input');
                        for (i = 0; i < inputs.length; i++) {
                            if (inputs[i].name == 'cp') {
                                inputs[i].style.border = '1px solid red'
                                this.setState({step1: 0})

                            }
                        }

                    });
                document
                    .getElementById("np")
                    .focus();
            } else if (event.target.name == 'np') {
                document
                    .getElementById("cnp")
                    .focus();

            } else if (event.target.name == 'cnp') {

                this.submit()
            }

        }
    }
     
    submit = async e => {
        if (this.state.step1 == '1' && this.state.step2 == '1' && this.state.step3 == '1') {
            this.setState({isLoading: true});
            axios
                .post(window.host + '/updPassword', {
                loginID: window.uid,
                newPassword: this.state.cnp,
                password: this.state.cp
            })
                .then(response => {
                    NotificationManager.success('Successful', 'Submission');
                    this.setState({isLoading: false});
                    this.setState({ste1: 0});
                    this.setState({cp: ""});
                    this.setState({np: ""});
                    this.setState({cnp: ""});
                    var i = 0;
                    var inputs = document.getElementsByTagName('input');
                    for (i = 0; i < inputs.length; i++) {
                        if (inputs[i].name == 'cp') {
                            inputs[i].style.border = '1px solid red'

                        }else if (inputs[i].name == 'cnp') {
                            inputs[i].style.border = '1px solid red'

                        }else if (inputs[i].name == 'np') {
                            inputs[i].style.border = '1px solid red'

                        }
                    }
                })
                .catch(error => {
                    NotificationManager.error('Failed', 'Submission');
                    this.setState({isLoading: false});

                })
        }

    }

    render() {

        return (
            <div
                class="content-wrapper"
                style={{
                marginBottom: "50px"
            }}>

                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6"></div>

                        </div>
                    </div>
                </section>

                <section class="content">
                    <div class="container-fluid">
                        <div class="row">

                            <div class="col-md-12">

                                <div class="card card-dark">
                                    <div class="card-header">
                                        <h3 class="card-title">Change Password</h3>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-5">

                                                <div class="form-group">
                                                    <label for="name">Current Password</label>
                                                    <input
                                                        required
                                                        type="password"
                                                        onKeyDown={this._handleKeyDown}
                                                        onChange={this.onchg}
                                                        name="cp"
                                                        class="form-control"
                                                        id="cp"
                                                        placeholder="Insert your Current Password"
                                                        value={this.state.cp}/>
                                                </div>
                                            </div>

                                        </div>

                                        <div class="row">
                                            <div class="col-sm-5">

                                                <div class="form-group">
                                                    <label for="name">New Password</label>
                                                    <input
                                                        required
                                                        type="password"
                                                        onKeyDown={this._handleKeyDown}
                                                        onChange={this.onchg}
                                                        name="np"
                                                        class="form-control"
                                                        id="np"
                                                        placeholder="Insert your New Password"
                                                        data-toggle="tooltip"
                                                        data-placement="bottom"
                                                        title="user password must contain number, capital & small letters and minumum length 6"
                                                        value={this.state.np}/>
                                                    <small>user password must contain number, capital & small letters and minumum length 6</small>
                                                </div>
                                            </div>

                                        </div>

                                        <div class="row">
                                            <div class="col-sm-5">

                                                <div class="form-group">
                                                    <label for="name">Confirm Password</label>
                                                    <input
                                                        required
                                                        type="password"
                                                        onKeyDown={this._handleKeyDown}
                                                        onChange={this.onchg}
                                                        name="cnp"
                                                        class="form-control"
                                                        id="cnp"
                                                        placeholder="Confirm Password"
                                                        value={this.state.cnp}/>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div class="card-footer">

                                        <div class="row">
                                            <div class="col-sm-11">

                                                {this.state.isLoading
                                                    ? <button
                                                            onClick={this.submit}
                                                            disabled={this.state.isLoading}
                                                            class="btn btn-primary">
                                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            Loading...
                                                        </button>
                                                    : <button
                                                        onClick={this.submit}
                                                        disabled={this.state.isLoading}
                                                        class="btn btn-primary">
                                                        Submit
                                                    </button>}
                                            </div>
                                            <div class="col-sm-1"></div>

                                         


                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="col-md-6"></div>

                        </div>

                    </div>
                </section>

                <NotificationContainer/>

            </div>
        )
    }
}

export default PasswordChange;