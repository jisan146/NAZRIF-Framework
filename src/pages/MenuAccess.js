import React, { Component } from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route,Link, BrowserRouter as Router} from '../../node_modules//react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class MenuAccess extends Component {
    
    route="/menu_access_control"
    
    
    componentDidMount()
    {
        document.title = "Access Control Of Group"
        this.getGroup()
        this.getPage()
        this.refresh()
    }

    constructor() 
    {
        super()
        this.state={
            mydata:[],
            isLoading: false,
            uid:"",
            disabled:true,
            psl:"",
            gsl:""  
        }
    }
    resetState()
    {
        this.setState({psl:""})
        this.setState({gsl:""})

    }

    onchg=(event)=>
    {
        var name=event.target.name;
        var value=event.target.value;
        this.setState({[name]:value})
       
    }

    clsModal=()=>
    {
        this.setState({disabled:true})
        this.refresh()
    }

    resetModal=()=>
    {
        this.setState({disabled:true})
    }
    

    refresh= async e =>
    {
        this.setState({ isLoading: true });
        axios.get(window.host+this.route)
        .then(response=>
          {
            NotificationManager.success('Successful', 'Reloaded', 1000);
            this.setState({mydata:response.data})
            this.resetState()
            this.setState({ isLoading: false });

          })
      .catch(error=>
        {
            
            NotificationManager.error('Failed', 'Reloaded', 1000);
        })
    }
 
setGroup
response_data


 getGroup()
{
  axios.get(window.host+'/menu_access_group')
  .then(response=>
      {
        this.response_data=response.data
        const mylist=this.response_data
        this.setGroup=mylist.map(
          (jdata)=>
          {
            if(this.state.gsl==jdata.sl){
              return  <option selected value={jdata.sl}>{jdata.group_name}</option>
            }else{
          return  <option value={jdata.sl}>{jdata.group_name}</option>}
         
                      
          }
      )
      })
  .catch(error=>{

  })
 
}
setPage
response_page
getPage()
{
  axios.get(window.host+'/page')
  .then(response=>
      {
        this.response_page=response.data
        const mylist1=this.response_page
        this.setPage=mylist1.map(
          (jdata)=>
          {
            if(this.state.psl==jdata.sl)
            {
                return  <option selected value={jdata.sl}>{jdata.page}</option>
            }
            else
            {
                return  <option value={jdata.sl}>{jdata.page}</option>
            }
         
                      
          }
      )
      })
  .catch(error=>{

  })
 
}

   



    a=0;
    i=0;
    
   focus=(event)=>
   {
     var value=event.target.value;
     var name=event.target.name;

     if(name=="enb")
     {
      
      if(this.state.disabled==false)
      {
        this.setState({disabled:true})
      }else
      {
        this.setState({disabled:false})
      }
  
        this.state.uid=value
        this.i=0;
     
        for(;;)
        { 
            if(this.state.mydata[this.i].sl==this.state.uid)
            {
                this.setState({psl:this.state.mydata[this.i].psl})
                this.setState({gsl:this.state.mydata[this.i].gsl})
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

    axios.put(window.host+this.route,this.state)
    .then(response=>
        { 
            NotificationManager.success('Successful', 'Submission', 1000); 
            this.refresh();
        })
    .catch(error=>
        {
            NotificationManager.error('Failed', 'Submission', 1000);
        })
    }

    submit= async e  =>
    { 
        this.setState({ isLoading: true });
        axios.post(window.host+this.route,this.state)
        .then(response=>
            {
                this.refresh()
                this.setState({ isLoading: false });   
                NotificationManager.success('Successful', 'Submission', 1000);    
            })
        .catch(error=>
            {
                NotificationManager.error('Failed', 'Submission', 1000);
                this.setState({ isLoading: false });
            })
    }

    delete= (event) =>
        {
            var name=event.target.name;
            var value=event.target.value;
            
            axios.delete(window.host+this.route,{data: { uid: value }})
            .then(response=>
                {
                    this.refresh()
                })
            .catch(error=>
                {
                    NotificationManager.error('Failed', 'Submission', 1000);
                })
        }
 

    render() {

        const mylist=this.state.mydata;
        const seldata=mylist.map(
            (jdata)=>
            {
            return <tr >
             <td class="align-middle">

            <a href="" onClick={this.resetModal} data-toggle="modal" data-target={"#exampleModal"+jdata.sl}><i className="nav-icon fas fa-edit" ></i></a>
           
            <div className="modal fade" id={"exampleModal"+jdata.sl} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
            <div className="modal-content">

            <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Access Edit</h5>
            <button onClick={this.clsModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
            </button>
            </div>
            <div className="modal-body">

            <div className="custom-control custom-switch">
            <input Checked="false" type="checkbox" className="custom-control-input" id={"customSwitch"+jdata.sl} onChange={this.onchg} name="enb" onFocus={this.focus} value={jdata.sl}/>
            <label className="custom-control-label" htmlFor={"customSwitch"+jdata.sl}>Enable Edit</label>
            </div>
  
            <div className="form-group">
            <label htmlFor="recipient-name" className="col-form-label">SL:</label>
            <input  disabled={this.state.disabled} type="text" required className="form-control"  onChange={this.onchg} name="uid" id="uid" onFocus={this.focus} value={jdata.sl}></input>
            </div>
       
          

           

           <div className="form-group">
             <label for="name">Group</label>
                <select  required disabled={this.state.disabled}  class="form-control" required name="gsl" id="gsl" onChange={this.onchg} onFocus={this.focus} value={this.state.gsl}>
                    <option value="">Select Group</option>
                        {this.setGroup}
                </select>
           </div>

           <div className="form-group">
             <label for="name">Select Page</label>
                <select  required disabled={this.state.disabled}  class="form-control" required name="psl" id="psl" onChange={this.onchg} onFocus={this.focus} value={this.state.psl}>
                    <option value="">Select Menu</option>
                        {this.setPage}
                </select>
           </div>


   
       </div>
       <div className="modal-footer">
         <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.clsModal}>Close</button>
         <button disabled={this.state.disabled} type="button" className="btn btn-primary"  name="uid" id="uid" data-dismiss="modal" onClick={this.edit} value={jdata.sl}>Update</button>
       </div>
     </div>
   </div>
  </div>
           </td>
           <td class="align-middle">{jdata.sl}</td>

           {/*******************Start TD ******/}
           {/*******************Start TD ******/}
           {/*******************Start TD ******/}
           {/*******************Start TD ******/}

            <td class="align-middle">{jdata.group_id}</td> 
            <td class="align-middle">{jdata.page}</td> 
           

           {/*******************End TD ******/}
           {/*******************End TD ******/}
           {/*******************End TD ******/}
           {/*******************End TD ******/}
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
        /****Start Form */
        return (
            <div class="content-wrapper">
           
            <section class="content-header">
              <div class="container-fluid">
                <div class="row mb-2">
                  <div class="col-sm-6">
                    <h4>Add Access To Group</h4>
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
                          <label for="name">Group </label>

                            <select class="form-control" required name="gsl" id="gsl" onChange={this.onchg} value= {this.state.gsl}>
                                <option value="">Select Menu</option>
                                {this.setGroup}
                            </select>
                           </div>
                           
                           <div class="form-group">
                          <label for="name">Page </label>

                            <select class="form-control" required name="psl" id="psl" onChange={this.onchg} value= {this.state.psl}>
                                <option value="">Select Page</option>
                                {this.setPage}
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

            {/****Start Table */}
            <section class="content-header">
              
              <div class="row mb-2">
                <div class="col-sm-6">
                  <h1>Access Information Of Group 
                  {this.state.isLoading ? <div><div class="spinner-grow text-primary" role="status"></div>
                      <div class="spinner-grow text-secondary" role="status"></div>
                      <div class="spinner-grow text-success" role="status"></div>
                      <div class="spinner-grow text-danger" role="status"></div>
                      <div class="spinner-grow text-warning" role="status"></div>
                      <div class="spinner-grow text-info" role="status"></div></div>:""}
                      
                  </h1>
                  

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
                    <th>Group</th>
                    <th>Page</th>
                  
                   
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

export default MenuAccess;