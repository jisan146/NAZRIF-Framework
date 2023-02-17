import React, { Component } from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route,Link, BrowserRouter as Router} from '../../node_modules//react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class MenuPages extends Component {
    route=window.host+'/page'
    componentDidMount(){
        document.title = "Application Pages"
        axios.get(this.route)
        .then(response=>
            {
                this.setState({mydata:response.data})
            })
        .catch(error=>{
    
        })
    }
 
setMenu
response_data
 getMenu()
{
  axios.get(window.host+'/menuView')
  .then(response=>
      {
        this.response_data=response.data
        const mylist=this.response_data
        this.setMenu=mylist.map(
          (jdata)=>
          {
            if(this.state.menu==jdata.sl){
              return  <option selected value={jdata.sl}>{jdata.menu}</option>
            }else{
          return  <option value={jdata.sl}>{jdata.menu}</option>}
         
                      
          }
      )
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
            disabled:true,
            page:"",
            link:"",
            icon:"",
            menu:""
        }
    }
    onchg=(event)=>{
        var name=event.target.name;
        var value=event.target.value;
       this.setState({[name]:value})
this.getMenu()
    }
    clsModal=()=>{
  
        this.setState({disabled:true})
        this.setState({page:""})
        this.setState({link:""})
        this.setState({icon:""})
        this.setState({menu:""})
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
         this.setState({page:this.state.mydata[this.i].page})
         this.setState({link:this.state.mydata[this.i].link})
         this.setState({icon:this.state.mydata[this.i].icon})
         this.setState({menu:this.state.mydata[this.i].menu})
        
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

    axios.put(this.route,this.state)
    .then(response=>
        { this.setState({designation:""})
          axios.get(window.host+'/page')
          .then(response=>
              {
                  this.setState({mydata:response.data})
                  this.setState({page:""})
        this.setState({link:""})
        this.setState({icon:""})
        this.setState({menu:""})
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
  axios.post(this.route,this.state)
  .then(response=>
    {
        this.setState({page:""})
        this.setState({link:""})
        this.setState({icon:""})
        this.setState({menu:""})
      axios.get(this.route)
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
      axios.post(window.host+'/pageDelete',{uid:value})
      .then(response=>
          {
            axios.get(window.host+'/page')
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
     
        axios.get(window.host+'/page')
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
         <h5 className="modal-title" id="exampleModalLabel">Page Edit</h5>
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
             <label htmlFor="recipient-name" className="col-form-label">Page:</label>
             <input required disabled={this.state.disabled} type="text" className="form-control" id="recipient-name" onChange={this.onchg} name="page" id="page" onFocus={this.focus} value={this.state.page}></input>
           </div>

           <div className="form-group">
             <label htmlFor="recipient-name" className="col-form-label">Route:</label>
             <input required disabled={this.state.disabled} type="text" className="form-control" id="recipient-name" onChange={this.onchg} name="link" id="link" onFocus={this.focus} value={this.state.link}></input>
           </div>

           <div className="form-group">
            
           
             <label for="name">Menu</label>
                          <select  required disabled={this.state.disabled}  class="form-control" required name="menu" id="menu" onChange={this.onchg} onFocus={this.focus} value={this.state.menu}>
                    <option value="">Select Menu</option>
                   {this.setMenu}
                    </select>
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
            <td class="align-middle">{jdata.page}</td> 
            <td class="align-middle">{jdata.link}</td> 
            <td class="align-middle">{jdata.menu}</td> 
          
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
                    <h4>Create Page</h4>
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
                            <label for="name">Page</label>
                            <input required type="Text" onChange={this.onchg} name="page" class="form-control" id="page" placeholder="Application Page" value={this.state.page}/>
                          </div>

                          <div class="form-group">
                            <label for="name">Page Link</label>
                            <input required type="Text" onChange={this.onchg} name="link" class="form-control" id="link" placeholder="Page Route Link" value={this.state.link}/>
                          </div>

                          <div class="form-group">
                            <label for="name">Page Icon</label>
                            <input required type="Text" onChange={this.onchg} name="icon" class="form-control" id="icon" placeholder="Page Icon" value={this.state.icon}/>
                          </div>
                          
                          <div class="form-group">
                          <label for="name">Menu</label>
                          <select class="form-control" required name="menu" id="menu" onChange={this.onchg} value= {this.state.menu}>
                    <option value="">Select Menu</option>
                   {this.setMenu}
                    </select>
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
                  <h1>Page Information</h1>
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
                    <th>Page</th>
                    <th>Route To</th>
                    <th>Menu</th>
                   
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

export default MenuPages;