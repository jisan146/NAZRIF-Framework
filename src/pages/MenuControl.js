import React, { Component } from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route,Link, BrowserRouter as Router} from '../../node_modules//react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class MenuControl extends Component {
    
    componentDidMount(){
      document.title = "Application Menu"
        axios.get(window.host+'/menuView')
        .then(response=>
            {
                this.setState({mydata:response.data})
            })
        .catch(error=>{
    
        })
    }

    constructor() {
        super()
       
        this.state={
            
          mydata:[],
          isLoading: false,
          uid:"",
          left_icon:"",
          right_icon:"",
          menu:"",
          viewsl:"",
          disabled:true,
        }
    }
    onchg=(event)=>{
        var name=event.target.name;
        var value=event.target.value;
       this.setState({[name]:value})

    }
    clsModal=()=>{
  
        this.setState({disabled:true})
      }
    a=0;
    i=0;
    
   focus=(event)=>{
     var value=event.target.value;
     var name=event.target.name;
     if(name=="uid")
     { this.setState({disabled:false})
     this.state.uid=value
   
   
     this.i=0;
     for(;;)
     { 
      
       if(this.state.mydata[this.i].sl==this.state.uid)
       {
        this.setState({menu:this.state.mydata[this.i].menu})
        this.setState({left_icon:this.state.mydata[this.i].left_icon})
        this.setState({right_icon:this.state.mydata[this.i].right_icon})
        this.setState({viewsl:this.state.mydata[this.i].viewsl})
        
         break;
       }
      
      this.i=this.i+1;
     }
 
 
   }
  
   }
   edit= (event) =>
    {
     
    var name=event.target.name;
    var value=event.target.value;
    this.setState({uid:value})
    

    this.setState({disabled:true})

    axios.post(window.host+'/menuUpdate',this.state)
    .then(response=>
        { this.setState({designation:""})
          axios.get(window.host+'/menuView')
          .then(response=>
              {
                this.setState({mydata:response.data})
                this.setState({menu:""})
                this.setState({left_icon:""})
                this.setState({right_icon:""})
                this.setState({viewsl:""})
              })
          .catch(error=>{
    
          })
        })
    .catch(error=>{
 
    })
    }

    submit= async e  =>
{ 
   
 
this.setState({ isLoading: true });
  axios.post(window.host+'/menuReg',this.state)
  .then(response=>
    {
        this.setState({menu:""})
        this.setState({left_icon:""})
        this.setState({right_icon:""})
        this.setState({viewsl:""})
      axios.get(window.host+'/menuView')
    .then(response=>
        {
            this.setState({mydata:response.data})
        })
    .catch(error=>{

    })
    
NotificationManager.success('Successful', 'Submission');
this.setState({ isLoading: false });
     
      
    })
.catch(error=>{
  NotificationManager.error('Failed', 'Submission');
  this.setState({ isLoading: false });

})




}
delete= (event) =>
    {
   
      var name=event.target.name;
      var value=event.target.value;
      axios.post(window.host+'/menuDelete',{uid:value})
      .then(response=>
          {
            axios.get(window.host+'/menuView')
            .then(response=>
                {
                    this.setState({mydata:response.data})
                })
            .catch(error=>{
      
            })
          })
      .catch(error=>{

      })
    }
    refresh= async e =>
    {
     
        axios.get(window.host+'/menuView')
      .then(response=>
          {
            NotificationManager.success('Successful', 'Reloaded');
          
              this.setState({mydata:response.data})
          })
      .catch(error=>{

      })
    } 

    render() {
        const mylist=this.state.mydata;
        const seldata=mylist.map(
            (jdata)=>
            {
            return <tr >
             <td class="align-middle">
           
           <button  data-toggle="modal" data-target={"#exampleModal"+jdata.sl}><i className="nav-icon fas fa-edit" ></i></button>
           <div className="modal fade" id={"exampleModal"+jdata.sl} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
   <div className="modal-dialog" role="document">
     <div className="modal-content">
       <div className="modal-header">
         <h5 className="modal-title" id="exampleModalLabel">Menu Edit</h5>
         <button type="button" className="close" data-dismiss="modal" aria-label="Close">
           <span aria-hidden="true">×</span>
         </button>
       </div>
       <div className="modal-body">
  
       <div className="form-group">
             <label htmlFor="recipient-name" className="col-form-label">SL:</label>
             <input  type="text" required className="form-control" id="recipient-name" onChange={this.onchg} name="uid" id="uid" onFocus={this.focus} value={jdata.sl}></input>
           </div>
       
           <div className="form-group">
             <label htmlFor="recipient-name" className="col-form-label">Menu Heading:</label>
             <input required disabled={this.state.disabled} type="text" className="form-control" id="recipient-name" onChange={this.onchg} name="menu" id="menu" onFocus={this.focus} value={this.state.menu}></input>
           </div>

           <div className="form-group">
             <label htmlFor="recipient-name" className="col-form-label">Left Icon:</label>
             <input required disabled={this.state.disabled} type="text" className="form-control" id="recipient-name" onChange={this.onchg} name="left_icon" id="left_icon" onFocus={this.focus} value={this.state.left_icon}></input>
           </div>

           <div className="form-group">
             <label htmlFor="recipient-name" className="col-form-label">Right Icon:</label>
             <input required disabled={this.state.disabled} type="text" className="form-control" id="recipient-name" onChange={this.onchg} name="right_icon" id="right_icon" onFocus={this.focus} value={this.state.right_icon}></input>
           </div>

           <div className="form-group">
             <label htmlFor="recipient-name" className="col-form-label">Serial No:</label>
             <input required disabled={this.state.disabled} type="text" className="form-control" id="recipient-name" onChange={this.onchg} name="viewsl" id="viewsl" onFocus={this.focus} value={this.state.viewsl}></input>
           </div>
           
  
           
           
        
       </div>
       <div className="modal-footer">
         <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.clsModal}>Close</button>
         <button type="button" className="btn btn-primary"  name="uid" id="uid" data-dismiss="modal" onClick={this.edit} value={jdata.sl}>Update</button>
       </div>
     </div>
   </div>
  </div>
           </td>
            <td class="align-middle">{jdata.sl}</td>
            <td class="align-middle">{jdata.menu}</td> 
            <td class="align-middle">{jdata.left_icon}</td> 
            <td class="align-middle">{jdata.right_icon}</td> 
            <td class="align-middle">{jdata.viewsl}</td> 
            <td class="align-middle">
            
            <Link   to="/Designation" className="nav-link" data-toggle="modal" data-target={"#delete"+jdata.sl}>
            <i style={{color:"red"}} class="fa fa-trash" ></i>
            </Link>
  
            <div className="modal fade" id={"delete"+jdata.sl} tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">Alert</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          Are You Want to Delete ?
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" className="btn btn-danger" name="uid" id="uid" value={jdata.sl} onClick={this.delete} data-dismiss="modal">Confirm</button>
        </div>
      </div>
    </div>
  </div>
  
  
  
            </td>
             </tr>
            
                    
              
            }
            
        )
        return (
            <div class="content-wrapper">
           
            <section class="content-header">
              <div class="container-fluid">
                <div class="row mb-2">
                  <div class="col-sm-6">
                    <h4>Create Menu</h4>
                  </div>
                  
                </div>
              </div>
            </section>
        
           
            <section class="content">
              <div class="container-fluid">
                <div class="row">
                  
                  <div class="col-md-12">
                   
                    <div class="card card-dark">
                      <div class="card-header">
                        <h3 class="card-title">Please Check Form Before Submit</h3>
                      </div>
                     
                     
                        <div class="card-body">
                          <div class="form-group">
                            <label for="name">Menu Heading</label>
                            <input required type="Text" onChange={this.onchg} name="menu" class="form-control" id="menu" placeholder="Menu Heading" value={this.state.menu}/>
                          </div>

                          <div class="form-group">
                            <label for="name">Left Side Icon</label>
                            <input required type="Text" onChange={this.onchg} name="left_icon" class="form-control" id="left_icon" placeholder="Left Side Icon" value={this.state.left_icon}/>
                          </div>

                          <div class="form-group">
                            <label for="name">Right Side Icon</label>
                            <input required type="Text" onChange={this.onchg} name="right_icon" class="form-control" id="right_icon" placeholder="Right Side Icon" value={this.state.right_icon}/>
                          </div>
                          
                          <div class="form-group">
                            <label for="name">Serial No</label>
                            <input required type="Text" onChange={this.onchg} name="viewsl" class="form-control" id="viewsl" placeholder="Serial No" value={this.state.viewsl}/>
                          </div>
                          
                        </div>

                        
                        
                        <div class="card-footer">
                        {this.state.isLoading ? <button onClick={this.submit} disabled={this.state.isLoading} class="btn btn-primary">
                          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                          </button>:<button onClick={this.submit} disabled={this.state.isLoading} class="btn btn-primary">
                          Submit
                          </button>}
                        
                         
                          
                          
                        </div>
                      
                    </div>
                   
                    </div>
                 
                  <div class="col-md-6">
        
                  </div>
                 
                </div>
               
              </div>
            </section>
            <section class="content-header">
              
              <div class="row mb-2">
                <div class="col-sm-6">
                  <h1>Menu Information</h1>
                </div>
                
              </div>
            
          </section>
      
      <div class="container-fluid">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"></h3>

              <div class="card-tools">
                <div class="input-group input-group-sm" style={{width: "150px"}}>
                  <input type="text" name="table_search" class="form-control float-right" placeholder="Search"/>

                  <div class="input-group-append">
                    <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
                  </div>
                  <div class="input-group-append">
                  <button type="submit" class="btn btn-default" onClick={this.refresh}><i class="fas fa-sync"></i></button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-body table-responsive p-0" style={{height: "500px"}}>
              <table class="table table-head-fixed text-nowrap">
                <thead>
                  <tr>
                  <th>Edit</th>
                    <th>SL</th>
                    <th>Menu Heading</th>
                    <th>Left Icon</th>
                    <th>Right Icon</th>
                   
                    <th>Menu Serial</th>
                    <th>Delete</th>
                   
                    
                  </tr>
                </thead>
                <tbody>
              
                  
                  
                {seldata}
                  
                  
                  
                  
                </tbody>
              </table>
            </div>
           
          </div>
         
        </div>
       
     
         
         </div>

            <NotificationContainer/>

        </div>
        )
    }
}

export default MenuControl;