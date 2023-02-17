import {Route,Link, BrowserRouter as Router} from '../../node_modules/react-router-dom'
import React, { Component } from 'react';
import axios from 'axios';
import Notification from './Notification';

class Menu extends Component {

  componentDidMount(){
      
    document.title = "Profile"

    axios.post(window.host+'/profile',{uid:window.uid})
    .then(response=>
        { 
            this.setState({mydata:response.data})
            this.setState({name:this.state.mydata[0].name})
            this.setState({designation:this.state.mydata[0].designation})
            this.setState({image:this.state.mydata[0].image})
        })
    .catch(error=>{
    })

    axios.post(window.host+'/menu',{uid:window.uid})
    .then(response=>
        { 
            this.setState({menu:response.data})
           
           
        })
    .catch(error=>{
    })
        
  }

  constructor() {
    super()
   
    this.state={
        mydata:[],
        name:"",
        designation:"",
        image:"",
        menu:[]
       
    }
}
  render() {
    var i=0;
    var temp="";
    var a=[]
    var p=[]
    var pSL=""
    var dMenu=[]
    var m=this.state.menu;
    for(i=0;i<=m.length-1;i++)
  {
if(temp!=m[i].msl)
{
  temp=m[i].msl;
  p=[];
  p.push(
  
    <li className="nav-item">
                    <Link to={m[i].link+'/'+m[i].query_id+'/reg'} className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>{m[i].page}</p></Link>           
                  </li>
      )
  a.push(
    <li className="nav-item has-treeview">
            <a href="#" className="nav-link">
            <i className= {m[i].left_icon}></i>
              <p>
               {m[i].menu}
                <i className={m[i].right_icon}></i>
              </p>
            </a>
            <ul className="nav nav-treeview">
              
              {p}
             
              
            </ul>
          </li>
  )
 
}
else
{
  p.push(
  
<li className="nav-item">
                <Link to={m[i].link+'/'+m[i].query_id+'/reg'} className="nav-link">
                  <i className="far fa-circle nav-icon"></i>
                  <p>{m[i].page}</p></Link>           
              </li>
  )
}

dMenu.push(a)
a=[];

}
  
  return (
    <div >
       <nav className="main-header fixed-top navbar navbar-expand navbar-white navbar-light">
    
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link" data-widget="pushmenu" href="#"><i className="fas fa-bars"></i></a>
      </li>

    </ul>

    


    
    <ul className="navbar-nav ml-auto">
     <Notification></Notification>
      
     
      
     
    </ul>
  </nav>
 

 
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
   
   

    <Link to="/Profile"  className="brand-link">
    <img src="/portal/assets/nazrif.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3"
           style={{opacity: ".8"}}/>
      <span className="brand-text font-weight-light">[]</span>
                  
      </Link>
    

   
    <div className="sidebar">
     
      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="image">
          <img src={window.host + "/userFiles/"+window.uid+'/'+window.password+'/'+this.state.image} className="img-circle elevation-2" alt="User Image"/>
        </div>
        <div className="info">
          
          <Link to="/Profile" className="d-block">
          {this.state.name}
                  
      </Link>

        </div>
      </div>

     
      <nav className="mt-2">
      
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
       
        {dMenu}

          <li class="nav-header">Account</li>
          <li className="nav-item has-treeview">
            <Link to="/SignOut" className="nav-link">
            <i className="nav-icon    fas fa-user-circle"></i>
              <p>
                Sign Out
                <i className="fas fa-sign-out-alt right"></i>
              
              </p>
            </Link>
           
          </li>

        
        </ul>
      
      </nav>
     
    </div>
   
  </aside>

 
  
  <div>
  <footer  style={{margin:"-10px",marginBottom:"-20px",paddingTop:"5px"}} className="main-footer fixed-bottom">
    
    <p style={{textAlign:"right"}}> Copyright &copy; 2017-2021 <a href="#">EDUBD.ONLINE</a>.All rights
    reserved.</p> 
  </footer>
  {/* Control Sidebar */}
  <aside className="control-sidebar control-sidebar-dark">
    {/* Control sidebar content goes here */}
  </aside>
</div>

    </div>
  );
}
}

export default Menu;
