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

class BioGasDashBoard extends Component {

    componentDidMount() {
        document.title = "Biogas DashBoard"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/BioGasDashBoard");
        this.getData();
    }

    constructor() {
        super()
        this.state = {
            mydata: [],
            isLoading: false,
            uid: "",
            disabled: true,
            dmlTime:""

        }

    }
    chartProcess(a, b, c) {
        var options = {
            chart: {
                height: 280,
                type: "radialBar",
            },

            series: [a],
            colors: ["#20E647"],
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: "70%",
                        background: "#293450"
                    },
                    track: {
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            blur: 4,
                            opacity: 0.15
                        }
                    },

                    /*
                     dataLabels: {
                        show: true,
                        name: {
                          offsetY: -10,
                          show: true,
                          color: '#888',
                          fontSize: '17px'
                        },
                        value: {
                          formatter: function(val) {
                            return parseInt(val);
                          },
                          color: '#111',
                          fontSize: '36px',
                          show: true,
                        }
                      }
                    }
                    */
                    dataLabels: {
                        name: {
                            offsetY: -10,
                            color: "#fff",
                            fontSize: "13px"
                        },
                        value: {
                            formatter: function(val) {
                                return parseInt(val);
                              },
                            color: "#fff",
                            fontSize: "30px",
                            show: true
                        }
                    }
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "vertical",
                    gradientToColors: ["#87D4F9"],
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: "round"
            },
            labels: [b]
        };

        var chart = new ApexCharts(document.querySelector("#" + c), options);

        chart.render();
    }

    getData= async e => {


        axios
            .post(window.host + '/biogasData')
            .then(response => {
                

                this.setState({dmlTime:response.data[0].dml_time});
                this.chartProcess(response.data[0].temperature, "Temperature-°C", "chart1")
                this.chartProcess(response.data[0].pressure, "Pressure-hPa", "chart2")
                this.chartProcess(response.data[0].humidity, "Humidity-%", "chart3")
                this.chartProcess(response.data[0].gas_resistance, "Gas Resistance-KOhms", "chart4")
                this.chartProcess(response.data[0].readAltitude, "Read Altitude-m", "chart5")
                this.chartProcess(response.data[0].methane, "Methane-%", "chart6")

            })
            .catch(error => {

            })
    }

    onchg = (event) => {

        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value })

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
                                        <h3 class="card-title">Biogas Plant Dashboard [Last Update : {this.state.dmlTime}]</h3>
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
                                            <div class="col-sm-4">
                                                <div id="chart1">
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div id="chart2">
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div id="chart6">
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
                </section>

                <NotificationContainer />

            </div>
        )
    }
}

export default BioGasDashBoard;