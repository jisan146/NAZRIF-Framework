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

class DynamicUI_CRUDE extends Component {
    route = window.host + '/pgCr'

    componentDidMount() {
        document.title = "Page Creator"
        ReactGA.initialize(window.gatc);
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview("/portal/smart-page-creator");
        axios.defaults.headers = {
            UID: window.uid,
            Token: window.password,
            QueryID: this.queryID,
            orgID: window.org_id,
            branch: window.branch

        }
        console.log(window.org_id + 'org_id')
        this.colNo = this.colNo + 1;

        this.setState({
            dynamicInputField: this
                .state
                .dynamicInputField
                .concat(
                    <div class="row">
                        <div class="col-sm-3">

                            <div class="form-group">
                                <label>Column Name</label>
                                <input
                                    required
                                    type="Text"
                                    onChange={this.onchg}
                                    name={"colName" + this.colNo}
                                    class="form-control"
                                    id={"colName" + this.colNo}
                                    placeholder=""
                                    value='sl'
                                    readOnly/>
                            </div>
                        </div>
                        <div class="col-sm-3">

                            <div class="form-group">
                                <label>Data Type</label>
                                <select
                                    disabled
                                    id={'dataType' + this.colNo}
                                    name={'dataType' + this.colNo}
                                    class="form-control">
                                    <option selected value="ai">AI</option>
                                    <option value="i">INT</option>
                                    <option value="t">Text</option>
                                    <option value="lt">
                                        Large Text</option>
                                    <option value="f">File</option>
                                    <option value="d">Date</option>
                                </select>

                            </div>
                        </div>
                        <div class="col-sm-3">

                            <div class="form-group">
                                <label>Input Lebel</label>
                                <input
                                    required
                                    type="Text"
                                    onChange={this.onchg}
                                    name={"inputLabel" + this.colNo}
                                    id={"inputLabel" + this.colNo}
                                    placeholder=""
                                    value="sl"
                                    class="form-control"
                                    readOnly/>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group">
                                <label>Input Type</label>
                                <select
                                    disabled
                                    id={'inputType' + this.colNo}
                                    name={'inputType' + this.colNo}
                                    class="form-control">
                                    <option value="Text">Text</option>
                                    <option selected value="number">Number</option>
                                    <option value="Phone">Phone</option>
                                    <option value="Email">Email</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="date">Date</option>
                                    <option value="file">File</option>
                                    <option value="select">select</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )
        });
        this.setState({colName1: 'sl'})
        this.setState({dataType1: 'ai'})
        this.setState({inputLabel1: 'sl'})
        this.setState({inputType1: 'number'})
    }
    colNo = 0

    addCol = () => {
        this.colNo = this.colNo + 1;

        this.setState({
            dynamicInputField: this
                .state
                .dynamicInputField
                .concat(
                    <div class="row">
                        <div class="col-sm-2">

                            <div class="form-group">
                                <label>Column Name</label>
                                <input
                                    required
                                    type="Text"
                                    onChange={this.onchg}
                                    name={"colName" + this.colNo}
                                    class="form-control"
                                    id={"colName" + this.colNo}
                                    placeholder=""
                                    value={this.state.colName}/>
                            </div>
                        </div>
                        <div class="col-sm-2">

                            <div class="form-group">
                                <label>Data Type</label>
                                <select
                                    id={'dataType' + this.colNo}
                                    name={'dataType' + this.colNo}
                                    class="form-control"
                                    onChange={this.onchg}>
                                    <option value="">Choose</option>
                                    <option value="i">INT</option>
                                    <option value="dbl">Fraction</option>
                                    <option value="t">Text</option>
                                    <option value="lt">
                                        Large Text</option>
                                    <option value="f">File</option>
                                    <option value="d">Date</option>
                                </select>

                            </div>
                        </div>
                        <div class="col-sm-2">

                            <div class="form-group">
                                <label>Input Lebel</label>
                                <input
                                    required
                                    type="Text"
                                    onChange={this.onchg}
                                    name={"inputLabel" + this.colNo}
                                    id={"inputLabel" + this.colNo}
                                    placeholder=""
                                    value={this.state.inputLabel}class="form-control"/>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label>Input Type</label>
                                <select
                                    id={'inputType' + this.colNo}
                                    name={'inputType' + this.colNo}
                                    class="form-control"
                                    onChange={this.onchg}>
                                    <option value="">Choose</option>
                                    <option value="text">Text</option>
                                    <option value="text_r">Text (R)</option>
                                    <option value="number">Number</option>
                                    <option value="number_r">Number (R)</option>
                                    <option value="Phone">Phone</option>
                                    <option value="Phone_r">Phone (R)</option>
                                    <option value="Email">Email</option>
                                    <option value="Email_r">Email (R)</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="textarea_r">Text Area (R)</option>
                                    <option value="Editor">Editor</option>
                                    <option value="date">Date</option>
                                    <option value="date_r">Date (R)</option>
                                    <option value="file">File</option>
                                    <option value="file_r">File (R)</option>
                                    <option value="select">Select</option>
                                    <option value="select_r">Select (R)</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-sm-2">

                            <div class="form-group">
                                <label>UI Col Size</label>
                                <input
                                    required
                                    type="number"
                                    onChange={this.onchg}
                                    name={"uiColSize" + this.colNo}
                                    id={"uiColSize" + this.colNo}
                                    placeholder=""
                                    min="1" max="12"
                                    value={this.state['uiColSize'+this.colNo]}class="form-control"/>
                            </div>
                        </div>
                     
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label>UI Row</label>
                                <select
                                    id={'uiRow' + this.colNo}
                                    name={'uiRow' + this.colNo}
                                    class="form-control"
                                    onChange={this.onchg}>
                                    <option value="n">New Row</option>
                                    <option value="s">Same Row</option>

                                </select>
                            </div>
                        </div>
                    </div>
                )
        });

    }

    constructor() {
        super()

        this.state = {

            mydata: [],
            isLoading: false,
            uid: "",
            disabled: true,
            colNo: 0,
            dynamicInputField: [],
            menuOption: [],
            menuTbl: [],
            menuTblCol: [],
            tblPfx: ''
        }

       
    }

    onchg = (event) => {
        this.setState({colNo: this.colNo})
        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]: value})
        if (name == 'inputType' + this.colNo && (value == 'select' || value == 'select_r')) {
            this.setState({
                dynamicInputField: this
                    .state
                    .dynamicInputField
                    .concat(
                        <div class="row">
                            <div class="col-sm-3"></div>
                            <div class="col-sm-3">

                                <div class="form-group">
                                    <label>Data Get From</label>
                                    <select
                                        id={'dtGetFrm' + this.colNo}
                                        name={'dtGetFrm' + this.colNo}
                                        class="form-control"
                                        onChange={this.onchg}>
                                        {this.state.menuTbl}

                                    </select>

                                </div>
                            </div>
                            <div class="col-sm-3"></div>

                            <div class="col-sm-3"></div>
                        </div>
                    )
            })
        }
        if (name == 'dtGetFrm' + this.colNo) {

            axios
                .post(window.host + '/pageCol', {tbl: value})
                .then(response => {

                    var i = 0
                    this.setState({menuTblCol: []})
                    this.setState({
                        menuTblCol: this
                            .state
                            .menuTblCol
                            .concat(
                                <option selected value="">Choose</option>
                            )
                    })
                    for (i = 0; i < response.data.length; i++) {

                        this.setState({
                            menuTblCol: this
                                .state
                                .menuTblCol
                                .concat(
                                    <option value={response.data[i].col_name}>{response.data[i].col_name}</option>
                                )
                        })
                    }
                    this.setState({
                        dynamicInputField: this
                            .state
                            .dynamicInputField
                            .concat(
                                <div class="row">
                                    <div class="col-sm-3"></div>

                                    <div class="col-sm-3">

                                        <div class="form-group">
                                            <label>View</label>
                                            <select
                                                id={'dtGetFrmView' + this.colNo}
                                                name={'dtGetFrmView' + this.colNo}
                                                class="form-control"
                                                onChange={this.onchg}>
                                                {this.state.menuTblCol}
                                            </select>

                                        </div>
                                    </div>

                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label>Value</label>
                                            <select
                                                id={'dtGetFrmValue' + this.colNo}
                                                name={'dtGetFrmValue' + this.colNo}
                                                class="form-control"
                                                onChange={this.onchg}>
                                                {this.state.menuTblCol}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )
                    })
                })
                .catch(error => {});
        }
        if (name == 'subMenu') {
            axios
                .post(window.host + '/pageMenu')
                .then(response => {

                    var i = 0
                    this.setState({menuOption: []})
                    this.setState({
                        menuOption: this
                            .state
                            .menuOption
                            .concat(
                                <option selected value="">Choose</option>
                            )
                    })
                    for (i = 0; i < response.data.length; i++) {

                        this.setState({
                            menuOption: this
                                .state
                                .menuOption
                                .concat(
                                    <option value={response.data[i].sl}>{response.data[i].menu}</option>
                                )
                        })
                    }
                })
                .catch(error => {});

            axios
                .post(window.host + '/pageTbl')
                .then(response => {

                    var i = 0
                    this.setState({menuTbl: []})
                    this.setState({
                        menuTbl: this
                            .state
                            .menuTbl
                            .concat(
                                <option selected value="">Choose</option>
                            )
                    })
                    for (i = 0; i < response.data.length; i++) {

                        this.setState({
                            menuTbl: this
                                .state
                                .menuTbl
                                .concat(
                                    <option value={response.data[i].table_name}>{response.data[i].table_name}</option>
                                )
                        })
                    }
                })
                .catch(error => {});
        }
        if (name == 'tblName') {
            value = value
                .replace(/ /g, "_")
                .toLowerCase()

        }
        this.setState({[name]: value})
        var inputs = document.getElementsByTagName('input');
        var i = 0
        if (name == 'colName' + this.colNo) {
            for (i = 0; i < inputs.length; i++) {
                if (inputs[i].name == 'inputLabel' + this.colNo) {
                    inputs[i].value = value
                        .replace(/_/g, " ")
                        .initCap()
                    this.setState({
                        [inputs[i].name]: value
                            .replace(/_/g, " ")
                            .initCap()
                    })
                }
                if (inputs[i].name == 'colName' + this.colNo) {
                    inputs[i].value = value
                        .replace(/ /g, "_")
                        .toLowerCase()

                         
                        this.setState({['uiColSize'+this.colNo]:4});
                        this.setState({['uiRow'+this.colNo]:'n'});
                }

            }

        }

        var inputs = document.getElementsByTagName('select');
        var i = 0

        if (name == 'dataType' + this.colNo) {

            for (i = 0; i < inputs.length; i++) {

                if (inputs[i].name == 'inputType' + this.colNo) {
                    var intputTypeValue;
                    if (value == 'i') {
                        intputTypeValue = 'number'
                    } else if (value == 't') {
                        intputTypeValue = 'text'
                    } else if (value == 'lt') {
                        intputTypeValue = 'textarea'
                    } else if (value == 'f') {
                        intputTypeValue = 'file'
                    } else if (value == 'd') {
                        intputTypeValue = 'date'
                    } else if (value == 'dbl') {
                        intputTypeValue = 'number'
                    }
                    inputs[i].value = intputTypeValue

                    this.setState({
                        [inputs[i].name]: intputTypeValue
                    })

                    
                }

            }

        }

    }

    submit = async e => {

        this.setState({isLoading: true});
        axios
            .post(this.route, this.state)
            .then(response => {

                axios
                    .get(this.route)
                    .then(response => {
                        this.setState({mydata: response.data})
                    })
                    .catch(error => {});
                NotificationManager.success('Successful', 'Submission');
                this.setState({isLoading: false});

            })
            .catch(error => {
                NotificationManager.error('Failed', 'Submission');
                this.setState({isLoading: false});

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
                        <div class="row">

                            <div class="col-md-12">

                                <div class="card card-dark">
                                    <div class="card-header">
                                        <h3 class="card-title">Smart Page Creator</h3>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-3">

                                                <div class="form-group">
                                                    <label for="name">Table Prefix</label>
                                                    <select id="tblPfx" name="tblPfx" class="form-control" onChange={this.onchg}>
                                                        <option value=''>No Table Prefix</option>
                                                        <option value='pos_'>POS</option>
                                                        <option value='edu_'>Edu</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="col-sm-3">

                                                <div class="form-group">
                                                    <label for="name">Table Name</label>
                                                    <input
                                                        required
                                                        type="Text"
                                                        onChange={this.onchg}
                                                        name="tblName"
                                                        class="form-control"
                                                        id="tblName"
                                                        placeholder="Insert Database Table Name"
                                                        value={this.state.tblName}/>
                                                </div>
                                            </div>

                                            <div class="col-sm-3">

                                                <div class="form-group">
                                                    <label for="name">Submenu Tittle</label>
                                                    <input
                                                        required
                                                        type="Text"
                                                        onChange={this.onchg}
                                                        name="subMenu"
                                                        class="form-control"
                                                        id="subMenu"
                                                        placeholder=""
                                                        value={this.state.subMenu}/>
                                                </div>
                                            </div>

                                            <div class="col-sm-3">

                                                <div class="form-group">
                                                    <label for="name">Select Menu</label>
                                                    <select
                                                        id="selectMenu"
                                                        name="selectMenu"
                                                        class="form-control"
                                                        onChange={this.onchg}>
                                                        {this.state.menuOption}
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="card-body">

                                        {this.state.dynamicInputField}

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
                                            <div class="col-sm-1">

                                                <button onClick={this.addCol} class="btn btn-primary">
                                                    Add
                                                </button>
                                            </div>
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

export default DynamicUI_CRUDE;