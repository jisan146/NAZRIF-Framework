import React, { Component } from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import { Route, Link, BrowserRouter as Router } from '../../node_modules//react-router-dom'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ReactGA from 'react-ga';

import ApexCharts from 'apexcharts'
String.prototype.initCap = function () {
    return this
        .toLowerCase()
        .replace(/(?:^|\s)[a-z]/g, function (m) {
            return m.toUpperCase();
        });
};

class SchoolDeshboard extends Component {

    componentDidMount() {
        document.title = "School Deshboard"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/SchoolDeshboard");
        this.getData();

    }


    chartProcess(a, b, c) {

        var options = {
            series: a,
            chart: {
                width: 380,
                type: 'pie',
            },

            labels: b,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        var chart = new ApexCharts(document.querySelector("#chart1"), options);
        chart.render();

    }

   

    constructor() {
        super()
        this.state = {




        };


    }




    onchg = (event) => {

        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value })

    }


    getData = async e => {


        axios
            .post(window.host + '/SchoolDashBoard')
            .then(response => {
                var DashboardData=response.data;
                this.setState({activeSTD:DashboardData[0][0].activeSTD});
                this.setState({activeEMP:DashboardData[1][0].activeEMP});
                this.setState({collection:DashboardData[2][0].collection});
                this.setState({spend:DashboardData[4][0].spend});
              
                

                

var lebel = [], series = [], i = 0,tblRow=[], balanceColor="",spendTblRow=[];

for (i = 0; i < DashboardData[5].length; i++) {
    if(i==0)
    {
     balanceColor="badge badge-danger float-right"
    }else if(i==1)
    {
     balanceColor="badge badge-warning float-right"
    }
    else if(i==2)
    {
     balanceColor="badge badge-info float-right"
    }
    else
    {
     balanceColor="badge badge-primary float-right"
    }
    spendTblRow.push(
          
         <li className="item">
                 <div className="product-img">
                   <img src={window.host + "/userFiles/" + window.uid + '/' + window.password + '/' + DashboardData[5][i].image} alt="Image" className="img-size-50" />
                 </div>
                 <div className="product-info">
                   <a href="#" className="product-title">{ DashboardData[5][i].name}
                     <span className={balanceColor}><font style={{fontSize: "18px"}}>৳ </font>{ DashboardData[5][i].spend}</span></a>
                   <span className="product-description">
     ID: { DashboardData[5][i].sl} Name: { DashboardData[5][i].name} Designation: { DashboardData[5][i].designation}
                   </span>
                 </div>
               </li>
         )
     
 }

 this.setState({spendTblRow:spendTblRow});

for (i = 0; i < DashboardData[3].length; i++) {
   if(i==0)
   {
    balanceColor="badge badge-primary float-right"
   }else if(i==1)
   {
    balanceColor="badge badge-success float-right"
   }
   else if(i==2)
   {
    balanceColor="badge badge-info float-right"
   }
   else
   {
    balanceColor="badge badge-warning float-right"
   }
    tblRow.push(
         
        <li className="item">
                <div className="product-img">
                  <img src={window.host + "/userFiles/" + window.uid + '/' + window.password + '/' + DashboardData[3][i].image} alt="Image" className="img-size-50" />
                </div>
                <div className="product-info">
                  <a href="#" className="product-title">{ DashboardData[3][i].name}
                    <span className={balanceColor}><font style={{fontSize: "18px"}}>৳ </font>{ DashboardData[3][i].collection}</span></a>
                  <span className="product-description">
    ID: { DashboardData[3][i].sl} Name: { DashboardData[3][i].name} Designation: { DashboardData[3][i].designation}
                  </span>
                </div>
              </li>
        )
    
}

this.setState({tblRow:tblRow});
                
               /* 
                for (i = 0; i < response.data.length; i++) {
                    lebel.push(response.data[i].class)
                    lebel.push(response.data[i].class)
                    series.push(response.data[i].sl)
                    series.push(response.data[i].sl)
                }
                console.log(response.data)
                this.chartProcess(series, lebel, "chart1")*/


            })
            .catch(error => {

            })
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
                        <div
                            class="row"
                            style={{
                                marginBottom: "25px"
                            }}>
                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-secondary elevation-1">
                                        <i class="fas fa-user-graduate" aria-hidden="true"></i>
                                    </span> < div class="info-box-content" > <span class="info-box-text">



                                        Active Student

                                        </span>

                                        < span class="info-box-number" > {this.state.activeSTD} </span>

                                    </div >

                                </div>

                            </div>
                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-info elevation-1">
                                        <i class="fas fa-user-tie" aria-hidden="true"></i>
                                    </span> < div class="info-box-content" > <span class="info-box-text">



                                       Active Employee

                                        </span>

                                        < span class="info-box-number" > {this.state.activeEMP} </span>

                                    </div >

                                </div>

                            </div>
                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-primary elevation-1">
                                        <i class="fa fa-money" aria-hidden="true"></i>
                                    </span> < div class="info-box-content" > <span class="info-box-text">



                                        Today's Collection
                                        

                                        </span>

                                        < span class="info-box-number" > {this.state.collection} </span>

                                    </div >

                                </div>

                            </div>


                            <div class="col-12 col-sm-6 col-md-3">
                                <div class="info-box mb-3">

                                    <span class="info-box-icon bg-warning elevation-1">
                                        <i class="fa fa-money" aria-hidden="true"></i>
                                    </span> < div class="info-box-content" > <span class="info-box-text">



                                        Today's Spend
                                        

                                        </span>

                                        < span class="info-box-number" > {this.state.spend} </span>

                                    </div >

                                </div>

                            </div>



                        </div>

                    </div>
                    <div class="container-fluid">
                        <div class="row">

                            <div class="col-md-12">

                                <div class="card card-dark">
                                    <div class="card-header">
                                        <h3 class="card-title">Dashboard (কাজ চলছে)</h3>
                                        <div class="card-tools">
                                            <div class="input-group input-group-sm" style={{}}>




                                                <div class="input-group-append">
                                                    <button type="submit" class="btn btn-default" onClick={this.getData}>
                                                        <i class="fas fa-sync"></i>
                                                    </button>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div class="card-body">



                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div id="chart1">
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div id="chart2">
                                                </div>
                                            </div>

                                        </div>

                                        <div class="row">

                                            <div class="col-sm-4">
                                                <div id="chart3">
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div id="chart4">
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div id="chart5">
                                                </div>
                                            </div>
                                        </div>




                                    </div>



                                </div>

                            </div>

                            <div class="col-md-6"></div>

                        </div>
                        

                    </div>

                    <div class="container-fluid">
                        <div class="row">
                        <div className="col-md-6">
                        <div className="card">
  <div className="card-header">
    <h3 className="card-title">Collection By Employee</h3>
    <div className="card-tools">
      <button type="button" className="btn btn-tool" data-card-widget="collapse">
        <i className="fas fa-minus" />
      </button>
      <button type="button" className="btn btn-tool" data-card-widget="remove">
        <i className="fas fa-times" />
      </button>
    </div>
  </div>
  {/* /.card-header */}
  <div className="card-body p-0">
    <ul className="products-list product-list-in-card pl-2 pr-2">
      
      {this.state.tblRow}
      
    </ul>
  </div>
  {/* /.card-body */}
  
  {/* /.card-footer */}
</div>
</div>
<div className="col-md-6">
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Spend By Employee</h3>
    <div className="card-tools">
      <button type="button" className="btn btn-tool" data-card-widget="collapse">
        <i className="fas fa-minus" />
      </button>
      <button type="button" className="btn btn-tool" data-card-widget="remove">
        <i className="fas fa-times" />
      </button>
    </div>
  </div>
  {/* /.card-header */}
  <div className="card-body p-0">
    <ul className="products-list product-list-in-card pl-2 pr-2">
      
      {this.state.spendTblRow}
      
    </ul>
  </div>
  {/* /.card-body */}
  
  {/* /.card-footer */}
</div>
</div>
</div>
</div>

                </section>

                <NotificationContainer />

            </div>
        )
    }
}

export default SchoolDeshboard;