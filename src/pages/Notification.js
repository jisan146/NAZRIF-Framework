import React, { Component } from 'react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {Route,Link, BrowserRouter as Router} from '../../node_modules/react-router-dom'
import { Redirect } from 'react-router-dom';
import Websocket from 'react-websocket';
import ReactTimeout from 'react-timeout'


class Notification extends Component {

  componentDidMount(){
   
   this.refresh()
   this.setState({uid:window.uid})

   this.interval = setInterval(() => 
  this.sendSMS(), 1000);
 

  
   
  }

  sendSMS()
  {
    
    axios.get(window.host + '/SmsSendToClient/'+window.org_id)
    .then(response=>
        {
          
          this.setState({ test:response.data[1][0].c })
         
          if(response.data[3][0].sms_server=="2")
          {
            /*
            axios.get("https://"+response.data[0][0].server_ip+"/node/LocalSmsReq/"+window.org_id,{timeout: 1000})
            .then(response=>
                {
                  
                
                }) 
            .catch(error=>{
              //console.log(error)
            })
            */
          }
         
        }) 
    .catch(error=>{
      //console.log(error)
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  constructor() {
    super()
   
    this.state={
      notify:[],
      notifyCount:"",
      resData:[],
      rcvMsg:[],
      uid:"",
      enb:false,
      enable_video_call:false,
      test:0
    }
}


refresh()
{
  axios.post(window.host+'/notification',{uid:window.uid})
  .then(response=>
      {
        this.setState({notify:[]}) 
        this.setState({notifyCount:""})
        this.setState({resData:response.data})
        this.setState({notifyCount:this.state.resData[0].notify})
        var newStateArray = this.state.notify.slice();

        var i=0;
        for(i=0;i<this.state.resData.length;i++)
        {
          newStateArray.push
          ( 
            <div>
              <div className="dropdown-divider"></div>
              
              <a href="#" className="dropdown-item">
              <i className={this.state.resData[i].icon}></i>{this.state.resData[i].msg} [{this.state.resData[i].type}]
              <span className="float-right text-muted text-sm">{this.state.resData[i].date}</span>
              </a>
            
            </div>
          )
        }
       
          this.setState({notify: newStateArray});

      })
  .catch(error=>{
  })
}
sendMessage(message) {
  this
      .refWebSocket
      .sendMessage(message);

}
wsOnConn(data) {
  this.sendMessage(JSON.stringify({receiver: window.uid, notify: "1",uid: window.uid}));
}
handleData(data) {
  let result = data;
      try
      {
        this.setState({rcvMsg:JSON.parse(data)});
      }
      catch
      {

      }
      if(this.state.rcvMsg.uid!=window.uid && this.state.rcvMsg.receiver==window.uid)
      {
      
        if(this.state.rcvMsg.notify=="1"||this.state.rcvMsg.notify=="2")
        {
          
          const audioEl = document.getElementsByClassName("audio-element")[0]
          audioEl.play()
          this.refresh()
         
        }
      }
  


  
}

onchg=(event)=>{
    var name=event.target.name;
    var value=event.target.value;
    this.setState({[name]:value})

}


chg=()=>
{
    this.setState({enb:true})
  window.registerUsername()
}

enb=()=>
{
    if(this.state.enb==false)
    {
        this.setState({enb:true})
        window.conn();
    }else
    {
        this.setState({enb:false})
        window.dis();
    }

}

ans()
{
    window.customAnswerCall()
    
}
conclose()
{
    window.test();
    
}
cut()
{
    window.doHangup();
    
}
dis()
{
    window.dis();
}

conn()
{
    window.conn();
}


    render() {
     
  return (
     
    <ul className="navbar-nav ml-auto">
       <Websocket url={window.scoketIP} onOpen={this.wsOnConn.bind(this)} onMessage={this.handleData.bind(this)}   ref={Websocket => {this.refWebSocket = Websocket;}}/>
       <audio className="audio-element"> <source src="/portal/assets/capisci.mp3"></source></audio>
    
    {/****  */}
    <li className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#">
          <i className="fas fa-video"></i>
          <span className="badge badge-success navbar-badge"></span>
        </a>
        <div style={{width:"240px",overflowY:"scroll",height:"400"}} className="dropdown-menu  dropdown-menu-right">
          <span className="dropdown-item dropdown-header">Video Call System</span>
<div className="dropdown-divider"></div>

<div className="input-group col-sm-12">          
                          
                          <div className="custom-control custom-switch">
                <input onChange={this.chg} type="checkbox" className="custom-control-input" id="username" value={this.state.uid} />
                <label className="custom-control-label" htmlFor="username">Enable Call System</label>
                </div>
    
                 
                </div>
    
                <div className="input-group col-sm-12"> 
                <div className="custom-control custom-switch ">
                <input checked={this.state.enb} onChange={this.enb} type="checkbox" className="custom-control-input" id="enb" />
                <label className="custom-control-label" htmlFor="enb">Enable / Diable Media</label>
                </div>   
                </div>
                <div className="dropdown-divider"></div>
<div className="input-group col-sm-12">
  <div className="input-group-prepend">
    <span className="input-group-text">
      <i className="fas fa-phone" />
    </span>
  </div>
  <input class="form-control" type="text" placeholder="Enter ID" autocomplete="off" id="peer" onkeypress="return checkEnter(this, event);"></input>
  <div className="input-group-append">
    <button className=" btn btn-success" autocomplete="off" id="call">  Call</button>

</div>
</div>
<div className="dropdown-divider"></div>
<div className="col-md-12">
  <div className="card card-dark">
    <div className="card-header">
      <h3 className="card-title">Receiver</h3>
      <div className="card-tools">
        <button type="button" className="btn btn-tool" data-card-widget="maximize"><i className="fas fa-expand" />
        </button>
      </div>

    </div>

    <div className="card-body">
    
    <div class="panel-body" id="videoright"></div>
					

    </div>

  </div>

</div>

<div className="dropdown-divider"></div>
<div className="col-md-12">
  <div className="card card-secondary">
    <div className="card-header">
      <h3 className="card-title">Me</h3>
      <div className="card-tools">
        <button type="button" className="btn btn-tool" data-card-widget="maximize"><i className="fas fa-expand" />
        </button>
      </div>

    </div>

    <div className="card-body">
    
      <div class="panel-body" id="videoleft"></div>
					
					
				
    </div>

  </div>

</div>
         

          </div>
      </li>
    {/**** */}
    
 {/*}   --
    <li className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#">
          <i className="far fa-comments"></i>
          <span className="badge badge-danger navbar-badge">0</span>
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" className="dropdown-item">
           
            <div className="media">
              <img src="/assets/amanaLogo.png" alt="User Avatar" className="img-size-50 mr-3 img-circle"/>
              <div className="media-body">
                <h3 className="dropdown-item-title">
                  Deeloper
                  <span className="float-right text-sm text-danger"><i className="fas fa-star"></i></span>
                </h3>
                <p className="text-sm">Welcome</p>
                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 24 Hours</p>
              </div>
            </div>
           
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item">
            
            <div className="media">
              <img src="/assets/amanaLogo.png" alt="User Avatar" className="img-size-50 img-circle mr-3"/>
              <div className="media-body">
                <h3 className="dropdown-item-title">
                  Support Team
                  <span className="float-right text-sm text-muted"><i className="fas fa-star"></i></span>
                </h3>
                <p className="text-sm">Welcome</p>
                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 24 Hours</p>
              </div>
            </div>
           
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item">
           
            <div className="media">
              <img src="/assets/amanaLogo.png" alt="User Avatar" className="img-size-50 img-circle mr-3"/>
              <div className="media-body">
                <h3 className="dropdown-item-title">
                  Business Deelopment Team
                  <span className="float-right text-sm text-warning"><i className="fas fa-star"></i></span>
                </h3>
                <p className="text-sm">Welcome</p>
                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 24 Hours </p>
              </div>
            </div>
            
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
        </div>
      </li>
      --*/}

      <li className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#">
          <i className="far fa-bell"></i>
          <span className="badge badge-warning navbar-badge">{this.state.notifyCount}</span>
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <span className="dropdown-item dropdown-header">{this.state.notifyCount} Notifications</span>


          {this.state.notify}


          
         
          
          <div className="dropdown-divider"></div>
         {/* <a href="#" className="dropdown-item dropdown-footer">See All Notifications test</a>*/}
        </div>
      </li>

      <li className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#">
          <i className="fas fa-sync"></i>
          <span className="badge badge-primary navbar-badge">{this.state.test}</span>
        </a>
        
      </li>

      
     

</ul>

  );
}
}

export default Notification;
