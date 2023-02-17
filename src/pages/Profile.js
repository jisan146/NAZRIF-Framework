import React, {Component} from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route, Link, BrowserRouter as Router} from '../../node_modules//react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Websocket from 'react-websocket';
import FacebookLogin from 'react-facebook-login';
import ReactGA from 'react-ga'; 

class Profile extends Component {
    componentDidMount() {
       // alert(window.location.hostname)
        this.setState({uid: window.uid})
        this.refresh()
        document.title = "Profile"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/user-profile");
        axios.defaults.headers = {
            UID: window.uid,
            Token: window.password,
            QueryID: this.queryID,
            orgID: window.org_id,
            branch: window.branch

        }
        this.setState({suggestBuy: '0'});
        this.setState({suggestSale: '0'});
        
        axios
            .post(window.host + '/profile_deshboard', {uid: window.uid})
            .then(response => {
                this.setState({suggestBuy: response.data[0][0].a});
                this.setState({suggestSale: response.data[1][0].b});
            }).catch(error => {});
        axios
            .post(window.host + '/profile', {uid: window.uid})
            .then(response => {
                this.setState({mydata: response.data})
                this.setState({name: this.state.mydata[0].name})
                this.setState({designation: this.state.mydata[0].designation})
                this.setState({image: this.state.mydata[0].image})

                window.uName = this.state.mydata[0].name;
                window.uImage = this.state.mydata[0].image;
                console.log(window.password)

                this.sendMessage(JSON.stringify({receiver: window.uid, notify: "2",uid: window.uid}));

                axios
                    .post(window.host + '/fb_info_get', {uid: window.uid})
                    .then(response => {

                        this.setState({fbCon: response.data.fbCon})

                        axios
                            .get("https://graph.facebook.com/v7.0/me?fields=id%2Cname&access_token=" + response.data.token)
                            .then(response => {

                                this.setState({fbConName: response.data.name})
                            })
                            .catch(error => {})

                    })
                    .catch(error => {});

                    
            })
            .catch(error => {})


     

    }

    ntfDtlHolder;
    ntfDtlTemp
    notifyUpdate(event)
    {
        var name = event.target.name;

        axios
            .post(window.host + '/notificationUpd', {sl: name})
            .then(response => {})
            .catch(error => {})

    }
    refresh = async e => {

        axios
            .post(window.host + '/notificationDetails', {uid: window.uid})
            .then(response => {
                this.setState({ntfDtl: ""})
                this.ntfDtlTemp = ""
                this.ntfDtlHolder = response.data
                const mylist = this.ntfDtlHolder
                this.ntfDtlTemp = mylist.map((jdata) => {

                    return <tr>
                        <td>{jdata.sender}</td>
                        <td>{jdata.msg}</td>
                        <td>
                            <button name={jdata.sl} onClick={this.notifyUpdate} className={jdata.status}>{jdata.type}</button>
                        </td>
                        <td>{jdata.date}</td>
                    </tr>
                })
                this.setState({ntfDtl: this.ntfDtlTemp})

            })
            .catch(error => {})
    }

    constructor() {
        super()

        this.state = {
            mydata: [],
            name: "",
            designation: "",
            image: "",
            count: [],
            chat: [],
            sndMsg: "",
            rcvMsg: [],
            isLoading: false,
            ntfDtl: "",
            chatRcv: "",
            receiverPort: "",
            enb: false,
            uid: "",
            fbCon: true,
            productUpload: false

        }
       
    }

    handleData(data) {
        
        let result = data;
        var a = []

        try
        {
            this.setState({
                rcvMsg: JSON.parse(data)
            });
            if (this.state.rcvMsg.port > 0) {
                window.socketPort = this.state.rcvMsg.port

            }

        } catch
        {}

        if (this.state.rcvMsg.uid != window.uid && this.state.rcvMsg.receiver == window.uid) {
            if (this.state.rcvMsg.notify == "1") {
                this.setState({ntfDtl: ""})
                this.refresh()
            } else {
                const audioEl = document.getElementsByClassName("audio-element")[0]
                audioEl.play()
                var newStateArray = this
                    .state
                    .chat
                    .slice();
                newStateArray.push(
                    <div>

                        <div className="direct-chat-msg right">
                            <div className="direct-chat-infos clearfix">
                                <span className="direct-chat-name float-right">{this.state.rcvMsg.uName}</span>
                                <span className="direct-chat-timestamp float-left">{this.state.rcvMsg.date}</span>
                            </div>

                            <img
                                className="direct-chat-img"
                                src={this.state.rcvMsg.uImage}
                                alt="Message User Image"/>

                            <div className="direct-chat-text">
                                {this.state.rcvMsg.msg}
                            </div>

                        </div>
                    </div>
                )

                this.setState({chat: newStateArray});
            }

        }
        var elem = document.getElementById('chat');
        elem.scrollTop = elem.scrollHeight;
    }

    sendMessage(message) {
        this
            .refWebSocket
            .sendMessage(message);

    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {

            this.onClk()

        }
    }
    notifyRefresh = (event) => {
        this.sendMessage(JSON.stringify({receiver: window.uid, notify: "1"}));
    }
    onClk = (event) => {
    //    this.sendMessage(JSON.stringify({id:this.state.sndMsg}));
    this.sendMessage(JSON.stringify({
        uid: window.uid,
        uPort: window.socketPort,
        uName: window.uName,
        uImage: window.host + "/userFiles/" + window.uid + '/' + window.password + '/' + window.uImage,
        msg: this.state.sndMsg,
        receiver: this.state.chatRcv,
        receiverPort: this.state.receiverPort,
        notify: "2",
        orgID: window.org_id,
        branch: window.branch

    }));
    this.setState({sndMsg: ""});
      /*  axios
            .post(window.host + '/sendMSG', this.state)
            .then(response => {

                this.sendMessage(JSON.stringify({
                    uid: window.uid,
                    uPort: window.socketPort,
                    uName: window.uName,
                    uImage: window.host + "/userFiles/" + window.uid + '/' + window.password + '/' + window.uImage,
                    msg: this.state.sndMsg,
                    receiver: this.state.chatRcv,
                    receiverPort: this.state.receiverPort,
                    notify: "2",
                    orgID: window.org_id,
                    branch: window.branch

                }));
                this.setState({sndMsg: ""});
            })
            .catch(error => {})*/

            var newStateArray = this
            .state
            .chat
            .slice();

            var  d = new Date();
var hh=d.getHours();
var am='AM'
if(hh>12)
{
hh=hh-12;
am='PM'
}

var months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
var monthIndex = d.getMonth()
var monthName = months[monthIndex]
var finalTime= d.getDate()+'-'+monthName+'-'+(d.getYear()-100)+" "+hh+':'+d.getMinutes()+':'+d.getSeconds()+' '+am;

        newStateArray.push(
            <div>
                <div className="direct-chat-msg">
                    <div className="direct-chat-infos clearfix">
                        <span className="direct-chat-name float-left">{this.state.name}</span>
                        <span className="direct-chat-timestamp float-right">{finalTime}</span>
                    </div>

                    <img
                        className="direct-chat-img"
                        src={window.host + "/userFiles/" + window.uid + '/' + window.password + '/' + this.state.image}
                        alt="Message User Image"/>

                    <div className="direct-chat-text">
                        {this.state.sndMsg}
                    </div>

                </div>

            </div>
        )
        this.setState({chat: newStateArray});
        //this.setState({sndMsg: ""});

    }

    onchg = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]: value})
    }

    responseFacebook_again = async e => {
        this.setState({fbCon: true})

    }
     
  

    responseFacebook = (response) => {

        axios.defaults.headers = {
            UID: window.uid,
            Token: window.password,
            QueryID: this.queryID,
            orgID: window.org_id,
            branch: window.branch

        }

        axios
            .post(window.host + '/fb_info', response)
            .then(response => {

                axios
                    .post(window.host + '/fb_info_get', {uid: window.uid})
                    .then(response => {

                        this.setState({fbCon: response.data.fbCon})

                        axios
                            .get("https://graph.facebook.com/v7.0/me?fields=id%2Cname&access_token=" + response.data.token)
                            .then(response => {

                                this.setState({fbConName: response.data.name})
                            })
                            .catch(error => {})

                            axios
                            .get("https://graph.facebook.com/v7.0/me/feed?fields=description%2Cmessage%2Cfull_picture%2Cpicture&access_token=" + response.data.token)
                            .then(data => {

                                console.log(data.data)
                                axios
                    .post(window.host + '/fb_info_feed', data.data)
                    .then(output => {}) .catch(error => {})
                            })
                            .catch(error => {})

                            

                    })
                    .catch(error => {});
            })
            .catch(error => {})
    }

    render() {

        return (

            <div class="content-wrapper">

                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1></h1>

                            </div>

                        </div>
                    </div>
                </section>
                <section class="content">
                    <div class="container-fluid">
                        <div className="row">

                            <div className="col-md-12">
                                {/* Widget: user widget style 1 */}
                                <div className="card card-widget widget-user">
                                    {/* Add the bg color to the header using any of the bg-* classes */}
                                    <div 
                                        className="widget-user-header text-white"
                                        style={{
                                        background: 'url("/portal/assets/cover.jpg") center center',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        height: '200px',
                                        backgroundWidth: '100%'
                                    }}>
                                        <h3 className="widget-user-username text-right">
                                            <b>{this.state.name}</b>
                                        </h3>
                                        <h5 className="widget-user-desc text-right">
                                            <b>{this.state.designation}</b>
                                        </h5>
                                    </div>
                                    <div className="widget-user-image">
                                        <img
                                            style={{
                                            height: "100px",
                                            width: "100px"
                                        }}
                                            className="img-circle"
                                            src={window.host + "/userFiles/" + window.uid + '/' + window.password + '/' + this.state.image}
                                            alt="User Avatar"/>
                                    </div>
                                    <div className="card-footer">
                                        <div className="row">
                                            <div className="col-sm-4 border-right">
                                                <div className="description-block">
                                                    <h5 className="description-header">Vision</h5>
                                                    <span className="description-text">-</span>
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            {/* /.col */}
                                            <div className="col-sm-4 border-right">
                                                <div className="description-block">
                                                    <h5 className="description-header">Idea</h5>
                                                    <span className="description-text">-</span>
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            {/* /.col */}
                                            <div className="col-sm-4">
                                                <div className="description-block">
                                                    <h5 className="description-header">Success</h5>
                                                    <span className="description-text">-</span>
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            {/* /.col */}
                                        </div>
                                        {/* /.row */}
                                    </div>
                                </div>
                                {/* /.widget-user */}
                            </div>
                            {/* /.col */}
                        </div>
                    </div>

                    <div class="container-fluid">
                        <div
                            class="row"
                            style={{
                            marginBottom: "25px"
                        }}>
                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-secondary elevation-1">
                                            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                                        </span> < div class = "info-box-content" > <span class="info-box-text">

                                          

                                        Suggest For Buy

                                        </span> 
                                        
                                        < span class = "info-box-number" > {this.state.suggestBuy} </span>

                                    </div > 

                                </div>

                            </div>
                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-info elevation-1">
                                           <i class="fa fa-tag" aria-hidden="true"></i>
                                        </span> < div class = "info-box-content" > <span class="info-box-text">

                                          

                                  Suggest For Sale

                                        </span> 
                                        
                                        < span class = "info-box-number" > {this.state.suggestSale} </span>

                                    </div > 

                                </div>

                            </div>
                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-primary elevation-1">
                                           <i class="fa fa-facebook-official" aria-hidden="true"></i>
                                        </span> < div class = "info-box-content" > <span class="info-box-text">

                                          

                                 Facebook Connectivity

                                        </span> 
                                        
                                        < span class = "info-box-number" > For Premium Only </span>

                                    </div > 

                                </div>

                            </div>
                           {/* <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    {this.state.fbCon

                                        ? <FacebookLogin
                                                appId="599374840954363"
                                                fields="name,groups.limit(1000)"
                                                scope="user_likes,
                                                user_photos,
                                                user_friends,
                                                groups_show_list,
                                                publish_to_groups,
                                                public_profile"
                                                callback={this.responseFacebook}/>
                                        : <> <span class="info-box-icon bg-primary elevation-1">
                                            <Link onClick={this.responseFacebook_again}><i class="fa fa-facebook-official" aria-hidden="true"></i></Link> 
                                        </span> < div class = "info-box-content" > <span class="info-box-text">

                                            <Link onClick={this.responseFacebook_again}>

                                                Profile</Link>

                                        </span> 
                                        
                                        < span class = "info-box-number" > {
                                            this.state.fbConName
                                        } </span>

                                    </div > </>}

                                </div>

                            </div>*/}

                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-warning elevation-1">
                                           <i class="fa fa-times" aria-hidden="true"></i>
                                        </span> < div class = "info-box-content" > <span class="info-box-text">

                                          

                                        Profile Status

                                        </span> 
                                        
                                        < span class = "info-box-number" > Not Verified </span>

                                    </div > 

                                </div>

                            </div>

                         {/*   <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    {this.state.fbCon

                                        ? <></>
                                        : <> <span class="info-box-icon bg-primary elevation-1">
                                          <i class="fa fa-truck" aria-hidden="true"></i > </span> < div class = "info-box-content" > <span class="info-box-text">

                                            <Link onClick={this.published_product}>

                                                Profile test</Link>

                                        </span> 

                                        {this.state.productUpload
                                        ? < span class = "info-box-number" > <div class="spinner-border text-primary" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div> </span>
                                        :<></>}



                                    </div > </>}

                                </div>

                            </div>
                            */}

                        </div>

                    </div>

                    <div class="container-fluid">
                        <div
                            className="row"
                            style={{
                            marginBottom: "25px"
                        }}>
                            <div className="card col-md-12">
                                <div className="card-header border-transparent">
                                    <h3 className="card-title">All Notifications</h3>
                                    <div className="card-tools">
                                        <button onClick={this.notifyRefresh} type="button" className="btn btn-tool">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"/>
                                        </button>

                                        {/*<button type="button" className="btn btn-tool" data-card-widget="remove">
        <i className="fas fa-times" />
      </button>*/}
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body p-0">
                                    <div
                                        className="card-body table-responsive p-0"
                                        style={{
                                        height: "300px"
                                    }}>
                                        <table class="table table-head-fixed">
                                            <thead>
                                                <tr>
                                                    <th>Sender</th>
                                                    <th>Notification</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.ntfDtl}

                                            </tbody>
                                        </table>
                                    </div>
                                    {/* /.table-responsive */}
                                </div>
                                {/* /.card-body */}

                                {/* /.card-footer */}
                            </div>

                        </div>
                    </div>

                </section>

                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h5>Welcome To Our Live Cummunication System</h5>

                            </div>

                        </div>
                    </div>
                </section>

                <section class="content">
                    <div class="container-fluid">
                        <div
                            class="row"
                            style={{
                            marginBottom: "25px"
                        }}>
                            <div className="col-md-6">
                                {/* DIRECT CHAT WARNING */}
                                <div className="card card-secondary direct-chat direct-chat-secondary">
                                    <div className="card-header">
                                        <h3 className="card-title">Direct Chat</h3>
                                        <div className="card-tools">

                                            <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"/>
                                            </button>

                                            {/*  <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
        </button>*/}
                                        </div>
                                    </div>
                                    {/* /.card-header */}
                                    <div className="card-body">

                                        <div id="chat" className="direct-chat-messages">
                                            {this.state.chat}

                                        </div>

                                    </div>

                                    <div className="card-footer">

                                        <div className="input-group">
                                            <input
                                                autoComplete="off"
                                                type="text"
                                                placeholder="Type Message ..."
                                                className="form-control"
                                                name="sndMsg"
                                                id="sndMsg"
                                                onChange={this.onchg}
                                                onKeyPress={this.handleKeyPress}
                                                value={this.state.sndMsg}/>
                                            <input
                                                autoComplete="off"
                                                type="text"
                                                placeholder="Receiver"
                                                className="form-control"
                                                name="chatRcv"
                                                id="chatRcv"
                                                onChange={this.onchg}
                                                value={this.state.chatRcv}/>

                                            <span className="input-group-append">
                                                <button type="submit" className="btn btn-secondary" onClick={this.onClk}>Send</button>
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="card col-md-6">
                                <div className="card-header border-transparent">
                                    <h3 className="card-title">All Messages</h3>
                                    
                                    <div className="card-tools">
                                        <button onClick={this.notifyRefresh} type="button" className="btn btn-tool">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"/>
                                        </button>

                                        {/*<button type="button" className="btn btn-tool" data-card-widget="remove">
        <i className="fas fa-times" />
      </button>*/}
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body p-0">
                                    <div
                                        className="card-body table-responsive p-0"
                                        style={{
                                        height: "300px"
                                    }}>
                                        <table class="table table-head-fixed">
                                            <thead>
                                                <tr>
                                                    <th>Sender</th>
                                                    <th>Message</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {/*this.state.ntfDtl*/}

                                            </tbody>
                                        </table>
                                    </div>
                                    {/* /.table-responsive */}
                                </div>
                                {/* /.card-body */}

                                {/* /.card-footer */}
                            </div>

                        </div>
                    </div>
                </section>

                <Websocket
                    url={window.scoketIP}
                    onMessage={this
                    .handleData
                    .bind(this)}
                    ref={Websocket => {
                    this.refWebSocket = Websocket;
                }}/>
                <audio className="audio-element">
                    <source src="/portal/assets/capisci.mp3"></source>
                </audio>

            </div>
        )
    }

}

export default Profile;