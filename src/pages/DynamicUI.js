import React, {Component} from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route, Link, BrowserRouter as Router} from '../../node_modules/react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import FileBase64 from 'react-file-base64';
import {Button, Modal} from 'react-bootstrap';
import SunEditor, {buttonList} from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import ReactGA from 'react-ga'; 
import { Redirect } from 'react-router-dom'

String.prototype.initCap = function () {
    return this
        .toLowerCase()
        .replace(/(?:^|\s)[a-z]/g, function (m) {
            return m.toUpperCase();
        });
};

class DynamicUI extends Component {

    route = ""
    inputHead = " Information Registry"
    tableHead = "All Social Info"

    tblNameRepresent = ""
    queryID = ""
    tempQueryID = ""
    tempEditID = ""
    editID = ""
    editorName = []
    editorNameDone = 0
    componentDidMount()
    {

        this.queryID = this
            .props
            .match
            .params
            .query_id
            .replace(/_/g, " ")

        this.tempQueryID = this.queryID

        this.route = "/ui"

        axios.defaults.headers = {
            UID: window.uid,
            Token: window.password,
            QueryID: this.queryID,
            orgID: window.org_id,
            branch: window.branch

        }
        this.setState({newUIrow: 0});
        this.setState({submitBtnEnable:false})
        this.setState({SubmitMSG:''})
        this.setState({tabular_data:[]})
        
        this.uiGenerator()
        this.refresh()

       

    }

    componentDidUpdate()
    {

        this.queryID = this
            .props
            .match
            .params
            .query_id
            .replace(/_/g, " ")
        this.editID = this
            .props
            .match
            .params
            .edit_id
            .replace(/_/g, " ")

        if (this.tempQueryID != this.queryID || this.tempEditID != this.editID) {

            this.route = "/ui"
            this.setState({btnText: 'Submit'})
            axios.defaults.headers = {
                UID: window.uid,
                Token: window.password,
                QueryID: this.queryID,
                orgID: window.org_id,
                branch: window.branch

            }
            axios
                .post(window.host + '/tblRst', {})
                .then(response => {

                    this.refresh()

                })
                .catch(error => {});
                this
                .tempQueryID = this.queryID
            this.tempEditID = this.editID
            this.setState({newUIrow: 0})
            this.setState({submitBtnEnable:false})
            this.setState({SubmitMSG:''})
            this.setState({tabular_data:[]})
            this.uiGenerator()
            this.refresh()
        }
        
    }

   
    getFiles(files) {
        this.setState({files: files})
        console.log(files)

        var inputs = document.getElementsByTagName('input');
        var i = 0
        for (i = 0; i < inputs.length; i++) {

            if (inputs[i].type == 'file') {
                inputs[i].className = "form-control"
                inputs[i].style.border = '1px solid green'
            }

        }

    }
    uiGenerator = async e => {

        axios
            .get(window.host + "/ui")
            .then(response => {
                this.setState({uiData: response.data})
               
                this.tblNameRepresent = this
                    .state
                    .uiData[0][0]
                    .title
                    .replace(/_/g, " ")
                    

                    this.setState({helpLink:this
                        .state
                        .uiData[0][0]
                        .help})
                this.tblNameRepresent = this
                    .state
                    .uiData[0][0]
                    .title
                   
                document.title = this
                    .tblNameRepresent
                    .replace(/_/g, " ")
                    .replace(/_/g, " ")
                    

                    ReactGA.initialize(window.gatc);
                    // This just needs to be called once since we have no routes in this case.
                    ReactGA.pageview("/portal/"+this
                        .tblNameRepresent
                        .replace(/_/g, "-")
                        .replace(/ /g, "-")
                        .replace("/", "or")
                        );

                this.setState({tblColHead: []})
                this.setState({uiInput: []})
                var tempTblColHead = this
                    .state
                    .tblColHead
                    .slice();
                var tempUiInputRow = []
                var tempUiInput = this
                    .state
                    .uiInput
                    .slice();
                var i = 0

                for (i = 0; i <= this.state.uiData[0].length - 1; i++) {

                    if (i > 0) {

                        this.setState({
                            [this.state.uiData[0][i].col_name + '_business_logic']: this.state.uiData[0][i].business_logic
                        });
                        if (this.state.uiData[0][i].insert_enable == '1') {
                            this.setState({['insert_enable']: true});
                            this.setState({tableHeight: '440px'})

                        } else {
                            this.setState({['insert_enable']: false});
                            this.setState({tableHeight: '500px'})

                        }
                        //tabular_enable

                        if (this.state.uiData[0][i].tabular_enable == '1') {
                            this.setState({['tabular_enable']: true});

                        } else {
                            this.setState({['tabular_enable']: false});

                        }
                        //edit_privilege

                        if (this.state.uiData[0][i].edit_privilege == '1') {
                            this.setState({['edit_privilege']: true});

                        } else {
                            this.setState({['edit_privilege']: false});

                        }
                        //delete_privilege
                        if (this.state.uiData[0][i].delete_privilege == '1') {
                            this.setState({['delete_privilege']: true});

                        } else {
                            this.setState({['delete_privilege']: false});

                        }
                        // report_enable
                        if (this.state.uiData[0][i].report_enable == '1') {
                            this.setState({['report_enable']: true});

                        } else {
                            this.setState({['report_enable']: false});

                        }
                        //sl_enable
                        if (this.state.uiData[0][i].sl_enable == '1') {
                            this.setState({['sl_enable']: true});

                        } else {
                            this.setState({['sl_enable']: false});

                        }

                        if (this.state.uiData[0][i].col_name == 'image') {
                            var userUIColSize
                            if(this.state.setShow==false)
                            {
                                userUIColSize=this.state.uiData[0][i].col_size
                            }
                            else
                            {
                                userUIColSize='12'
                            }
                            tempUiInput.push(
                                <div class={"col-sm-" + userUIColSize}>
                                    <div class="form-group">
                                        <label for="name">
                                            {this
                                                .state
                                                .uiData[0][i]
                                                .input_label
                                                .replace(/_/g, " ")
                                                .initCap()}</label>
                                        <div className="custom-file">
                                            <FileBase64
                                                multiple={true}
                                                onDone={this
                                                .getFiles
                                                .bind(this)}/>
                                            <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                                        </div>
                                    </div>
                                </div>

                            )
                        } else if (this.state.uiData[0][i].input_type == 'select') {

                            var s = 0

                            this.setState({selectOption: []})
                            this
                                .state
                                .selectOption
                                .push(
                                    <option value=''>{'<-- Select ' + this
                                            .state
                                            .uiData[0][i]
                                            .input_label
                                            .replace(/_/g, " ")
                                            .initCap() + ' -->'}</option>
                                )
                            for (s = 0; s < this.state.uiData[2 + this.state.uiData[0][i].select_sl].length; s++) {

                                this
                                    .state
                                    .selectOption
                                    .push(
                                        <option value={this.state.uiData[2 + this.state.uiData[0][i].select_sl][s].r}>{this.state.uiData[2 + this.state.uiData[0][i].select_sl][s].v}</option>
                                    )
                            }

                            var userUIColSize
                            if(this.state.setShow==false)
                            {
                                userUIColSize=this.state.uiData[0][i].col_size
                            }
                            else
                            {
                                userUIColSize='12'
                            }
                            tempUiInput.push(
                                <div class={"col-sm-" + userUIColSize}>
                                    <div class="form-group">
                                        <label for="name">{this
                                                .state
                                                .uiData[0][i]
                                                .input_label
                                                .replace(/_/g, " ")
                                                .initCap()}</label>

                                        <select
                                            class="form-control"
                                            name={this.state.uiData[0][i].col_name}
                                            id={this.state.uiData[0][i].col_name}
                                            onChange={this.onchg}>
                                            {this.state.selectOption}
                                        </select>

                                    </div>
                                </div>
                            )
                        } else if (this.state.uiData[0][i].input_type == 'search') {
                            var userUIColSize
                            if (this.state.setShow == false) {
                                userUIColSize = this.state.uiData[0][i].col_size
                            }
                            else {
                                userUIColSize = '12'
                            }

                            var s = 0

                            this.setState({ selectOption: [] })

                            for (s = 0; s < this.state.uiData[2 + this.state.uiData[0][i].select_sl].length; s++) {


                                this
                                    .state
                                    .selectOption
                                    .push(
                                        <option label={this.state.uiData[2 + this.state.uiData[0][i].select_sl][s].v} value={this.state.uiData[2 + this.state.uiData[0][i].select_sl][s].r}>{this.state.uiData[2 + this.state.uiData[0][i].select_sl][s].v}</option>
                                    )
                            }
                            tempUiInput.push(
                                <div class={"col-sm-" + userUIColSize}>
                                    <div class="form-group">
                                        <label for="name">{this
                                            .state
                                            .uiData[0][i]
                                            .input_label
                                            .replace(/_/g, " ")
                                            .initCap()}</label>

                                        <input
                                            class="form-control"
                                            list={"browsers_" + this.state.uiData[0][i].col_name}
                                            required
                                            autoComplete="none"
                                            type={this.state.uiData[0][i].input_type}
                                            name={this.state.uiData[0][i].col_name}
                                            id={this.state.uiData[0][i].col_name}
                                            onChange={this.onchg}
                                            onKeyDown={this._handleKeyDown}></input>

                                        <datalist id={"browsers_" + this.state.uiData[0][i].col_name}>

                                            {this.state.selectOption}
                                        </datalist>

                                    </div>
                                </div>
                            )

                        }
                         else if (this.state.uiData[0][i].input_type == 'textarea') {
                            var userUIColSize
                            if(this.state.setShow==false)
                            {
                                userUIColSize=this.state.uiData[0][i].col_size
                            }
                            else
                            {
                                userUIColSize='12'
                            }
                            tempUiInput.push(
                                <div class={"col-sm-" + userUIColSize}>
                                    <div class="form-group">
                                        <label for="name">{this
                                                .state
                                                .uiData[0][i]
                                                .input_label
                                                .replace(/_/g, " ")
                                                .initCap()}</label>

                                        <textarea
                                            class="form-control"
                                            required
                                            name={this.state.uiData[0][i].col_name}
                                            id={this.state.uiData[0][i].col_name}
                                            onChange={this.onchg}></textarea>

                                    </div>
                                </div>
                            )
                        } else if (this.state.uiData[0][i].input_type == 'hidden') {
                            var userUIColSize
                            if(this.state.setShow==false)
                            {
                                userUIColSize=this.state.uiData[0][i].col_size
                            }
                            else
                            {
                                userUIColSize='12'
                            }
                            tempUiInput.push(
                                <div class={"col-sm-" + userUIColSize}>
                                    <div class="form-group">

                                        <input
                                            class="form-control"
                                            required
                                            autoComplete="none"
                                            type={this.state.uiData[0][i].input_type}
                                            name={this.state.uiData[0][i].col_name}
                                            id={this.state.uiData[0][i].col_name}
                                            onChange={this.onchg}
                                            onKeyDown={this._handleKeyDown}></input>

                                    </div>
                                </div>
                            )
                        } else if (this.state.uiData[0][i].input_type == 'Editor') {
                            this.editorNameDone = 0;
                            if (this.tempEditID != 'reg') {
                                var editIndex = ''
                                for (editIndex = 0; editIndex < this.state.uiData[2].length; editIndex++) {

                                    if (this.state.uiData[2][editIndex]['sl'] == this.tempEditID) {

                                        console.log(this.state.uiData[2][editIndex][this.state.uiData[0][i].col_name])

                                        this.setState({
                                            [this.state.uiData[0][i].col_name]: this.state.uiData[2][editIndex][this.state.uiData[0][i].col_name]
                                        })
                                        this
                                            .editorName
                                            .push(this.state.uiData[0][i].col_name)
                                            var userUIColSize
                                            if(this.state.setShow==false)
                                            {
                                                userUIColSize=this.state.uiData[0][i].col_size
                                            }
                                            else
                                            {
                                                userUIColSize='12'
                                            }
                                            tempUiInput.push(
                                                <div class={"col-sm-" + userUIColSize}>
                                                <div class="form-group">
                                                    <label for="name">{this
                                                            .state
                                                            .uiData[0][i]
                                                            .input_label
                                                            .replace(/_/g, " ")
                                                            .initCap()}</label>

                                                    <SunEditor
                                                        setContents={this.state.uiData[2][editIndex][this.state.uiData[0][i].col_name]}
                                                        onChange={this.handleChangeRich}
                                                        setOptions={{
                                                        height: 200,
                                                        buttonList: buttonList.complex
                                                    }}/>

                                                </div>
                                            </div>
                                        )
                                        break;
                                    }
                                }

                            } else {
                                this
                                    .editorName
                                    .push(this.state.uiData[0][i].col_name)
                                    var userUIColSize
                                    if(this.state.setShow==false)
                                    {
                                        userUIColSize=this.state.uiData[0][i].col_size
                                    }
                                    else
                                    {
                                        userUIColSize='12'
                                    }
                                    tempUiInput.push(
                                        <div class={"col-sm-" + userUIColSize}>
                                        <div class="form-group">
                                            <label for="name">{this
                                                    .state
                                                    .uiData[0][i]
                                                    .input_label
                                                    .replace(/_/g, " ")
                                                    .initCap()}</label>

                                            <SunEditor
                                                onChange={this.handleChangeRich}
                                                setOptions={{
                                                height: 200,
                                                buttonList: buttonList.complex
                                            }}/>

                                        </div>
                                    </div>
                                )
                            }

                        } else if (this.state.uiData[0][i].input_type == 'readonly') {
                            var userUIColSize
                            if(this.state.setShow==false)
                            {
                                userUIColSize=this.state.uiData[0][i].col_size
                            }
                            else
                            {
                                userUIColSize='12'
                            }
                            tempUiInput.push(
                                <div class={"col-sm-" + userUIColSize}>
                                    <div class="form-group">
                                        <label for="name">{this
                                                .state
                                                .uiData[0][i]
                                                .input_label
                                                .replace(/_/g, " ")
                                                .initCap()}</label>

                                        <input
                                            class="form-control"
                                            required
                                            readOnly={true}
                                            type={this.state.uiData[0][i].input_type}
                                            name={this.state.uiData[0][i].col_name}
                                            id={this.state.uiData[0][i].col_name}
                                            onChange={this.onchg}
                                            onKeyDown={this._handleKeyDown}></input>

                                    </div>
                                </div>
                            )
                        } else {
                            var userUIColSize
                            if(this.state.setShow==false)
                            {
                                userUIColSize=this.state.uiData[0][i].col_size
                            }
                            else
                            {
                                userUIColSize='12'
                            }
                           
                             
                                tempUiInput.push(
                                    <div class={"col-sm-" + userUIColSize}>
                                        <div class="form-group">
                                            <label for="name">{this
                                                    .state
                                                    .uiData[0][i]
                                                    .input_label
                                                    .replace(/_/g, " ")
                                                    .initCap()}</label>
    
                                            <input
                                                class="form-control"
                                                autoComplete="none"
                                                required
                                                type={this.state.uiData[0][i].input_type}
                                                name={this.state.uiData[0][i].col_name}
                                                id={this.state.uiData[0][i].col_name}
                                                onChange={this.onchg}
                                                onKeyDown={this._handleKeyDown}></input>
    
                                        </div>
                                    </div>
                                )
                            
                           
                        }

                    }
                    if (this.state.uiData[0][i].row == 0) {
                        this.setState({newUIrow: this.state.uiData[0][i].row
                        })
                        tempUiInputRow.push(

                            <div class="row">{tempUiInput}</div>
                        );

                        tempUiInput = [];
                    }
                }

                try {
                    var colName = Object.keys(this.state.uiData[1][0]);
                    var tempSearchOption = []
                    if (this.state.edit_privilege == true || this.tblNameRepresent.replace(/_/g, " ").replace(/_/g, " ").initCap() == 'Pages') {
                        tempTblColHead.push(
                            <th style={{whiteSpace: "nowrap"}}>
                                <button
                                    style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '0',
                                    color: '#069',
                                    fontFamily: 'arial, sans-serif',
                                    
                                }}
                                    disabled>
                                    <b>Edit</b>
                                </button>
                            </th>
                        )
                        
                    }
                    if (this.state.tabular_enable == true ) {
                    tempTblColHead.push(
                        <th style={{whiteSpace: "nowrap"}}>
                            <button
                                style={{
                                background: 'none',
                                border: 'none',
                                padding: '0',
                                color: '#069',
                                fontFamily: 'arial, sans-serif',
                                
                            }}
                                disabled>
                                <b> Check</b>
                            </button>
                        </th>
                    )}
                    tempTblColHead.push(
                        <th style={{whiteSpace: "nowrap"}}>
                            <button
                                style={{
                                background: 'none',
                                border: 'none',
                                padding: '0',
                                color: '#069',
                                fontFamily: 'arial, sans-serif',
                                
                            }}
                                disabled>
                                <b> Row No</b>
                            </button>
                        </th>
                    )
                   
                  /*  tempSearchOption.push(
                        <option value={'0'}>{'All  →'}</option>
                    )*/

                    tempSearchOption.push(
                        <option value={'-'}>{'<-Column->'}</option>
                    )
                    this.setState({searchCol: '0'})
                    var tempSearchOptionLike=[]
                    for (i = 0; i <= colName.length - 1; i++) {
                        console.log(colName[i])
                      /*  tempSearchOption.push(
                            <option value={i + 1}>{colName[i]
                                    .replace(/_/g, " ")
                                    .initCap() + '  →'}</option>
                        )*/

                        tempSearchOption.push(
                            <option value={colName[i]}>{colName[i]
                                    .replace(/_/g, " ")
                                    .initCap() + '  →'}</option>
                        )

                        tempSearchOptionLike.push(colName[i])
                        this.setState({tempSearchOptionLike:tempSearchOptionLike});


                        if (colName[i]=='sl')
                        {
                            if(this.state.sl_enable == true || this.tblNameRepresent.replace(/_/g, " ").replace(/_/g, " ").initCap() == 'Pages'){
                            tempTblColHead.push(
                                <th style={{whiteSpace: "nowrap"}}>
                                    <button
                                        style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '0',
                                        color: '#069',
                                        fontFamily: 'arial, sans-serif',
                                        cursor: 'pointer'
                                    }}
                                        onClick={this.colOrder}
                                        name={colName[i]
                                        .replace(/_/g, " ")
                                        .initCap()}
                                        id={i + 1}>
                                        <b>{colName[i]
                                                .replace(/_/g, " ")
                                                .initCap()}</b>
                                    </button>
                                </th>
                            )}
                        }else{
                            tempTblColHead.push(
                                <th style={{whiteSpace: "nowrap"}}>
                                    <button
                                        style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '0',
                                        color: '#069',
                                        fontFamily: 'arial, sans-serif',
                                        cursor: 'pointer'
                                    }}
                                        onClick={this.colOrder}
                                        name={colName[i]
                                        .replace(/_/g, " ")
                                        .initCap()}
                                        id={i + 1}>
                                        <b>{colName[i]
                                                .replace(/_/g, " ")
                                                .replace("(textarea)", "")
                                                .replace("(number)", "")
                                                .initCap()}</b>
                                    </button>
                                </th>
                            )
                        }
                       
                    }
                    if (this.state.delete_privilege == true || this.tblNameRepresent.replace(/_/g, " ").replace(/_/g, " ").initCap() == 'Pages') {
                        tempTblColHead.push(
                            <th style={{whiteSpace: "nowrap"}}>
                                <button
                                    style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '0',
                                    color: '#069',
                                    fontFamily: 'arial, sans-serif',
                                    cursor: 'pointer'
                                }}
                                    name="colDelete"
                                    id="colDelete"
                                    disabled
                                    onClick={this.colOrder}>
                                    <b>Delete</b>
                                </button>
                            </th>
                        )
                    }
                } catch (ex) {}

                this.setState({tblColHead: tempTblColHead});
                this.setState({searchOption: tempSearchOption});
                this.setState({uiInput: tempUiInputRow});

            })
            .catch(error => {

                NotificationManager.error('Failed', 'to load UI', 1000);
                console.log(error)
            })

    }

    _handleKeyDown = (event) => {
        if (event.key === 'Enter') {

            if ((this.state.inputFocus.length - 1) == (this.state.inputFocus.indexOf(event.target.name))) {
                this.submit()

            } else {
                try {
                    document.getElementById(this.state.inputFocus[this
                            .state
                            .inputFocus
                            .indexOf(event.target.name) + 1]).focus();
                } catch (ex) {
                    this.submit()
                }
            }

        }

    }

    _handleKeyDownDataSearch = (event) => {
        if (event.key === 'Enter') {
            this.advSerUI('SearchAll')
        }
    }

    _handleKeyDownAdvSearch = (event) => {
        if (event.key === 'Enter') {
            this.advSerUI('Search')
        }
    }
    dataSearch = (event) => {

        axios
            .post(window.host + '/dataSearch', {
            qid: this.queryID,
            q: this.state.searchValue,
            c: this.state.searchCol,
            fq:this.state.advSerQueryFinal
        })
            .then(response => {
                this.setState({searchValue: ''})
                this.refresh()

            })
    }
    colOrder = (event) => {
        var name = event
            .target
            .innerHTML
            .replace('<b>', '')
            .replace('</b>', '')
            .replace('⠀↓', '')
            .replace('⠀↑', '')

        var inputs = document.getElementsByTagName('button');
        var i = 0
        for (i = 0; i < inputs.length; i++) {
            inputs[i].innerHTML = inputs[i]
                .innerHTML
                .replace('⠀↑', '')
                .replace('⠀↓', '');
            if (inputs[i].name == name) {

                if (this.state.colAsc == '0') {
                    this.setState({['colAsc']: '1'})
                    inputs[i].innerHTML = "<b>" + name + "⠀↑</b>";
                    axios
                        .post(window.host + '/colOrder', {
                        qid: this.queryID,
                        q: ' order by ' + inputs[i].id + '  limit 10;'
                    })
                        .then(response => {
                            this.refresh()
                        })
                } else {
                    axios
                        .post(window.host + '/colOrder', {
                        qid: this.queryID,
                        q: ' order by ' + inputs[i].id + ' desc  limit 10;'
                    })
                        .then(response => {
                            this.refresh()
                        })
                    this.setState({['colAsc']: '0'})
                    inputs[i].innerHTML = "<b>" + name + "⠀↓</b>";
                }

            }
        }

    }
    onchg = (event) => {

        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]: value})
        var business_logic_data = []


        if (this.state[name + '_business_logic'] != '-') {

            this.setState({submitBtnEnable:true})
        for (i = 0; i <= this.state.uiData[0].length - 1; i++) {

            if (i > 0) {

                if (this.state.uiData[0][i].col_name != name) {
                    business_logic_data.push({
                        [this.state.uiData[0][i].col_name]: this.state[this.state.uiData[0][i].col_name]
                    });
                } else {
                    business_logic_data.push({[name]: value})
                }

            }

        }
        
            axios.post(window.host + this.state[name + '_business_logic'], business_logic_data).then(response => {

                // business_logic_data=[]

                var bl = 0
                for (bl = 1; bl < response.data.length; bl++) {
                    
                    if(response.data[bl].name=='submitBtnEnable')
                    {
                        this.setState({submitBtnEnable:response.data[bl].value})
                    }else if(response.data[bl].name=='SubmitMSG')
                    {
                        this.setState({SubmitMSG:response.data[bl].value})
                    }
                    else{
                        this.setState({submitBtnEnable:false}) 

                        if(response.data[bl].type=='input')
                        {

                    var inputs = document.getElementsByTagName('input');
                  
                    var i = 0

                    for (i = 0; i < inputs.length; i++) {

                        if (inputs[i].name == response.data[bl].name) {
                            this.setState({
                                [response.data[bl].name]: response.data[bl].value
                            })
                            inputs[i].value = response.data[bl].value

                        }

                    }
                }else if(response.data[bl].type=='select')
                {
                    var inputs = document.getElementsByTagName('select');
                  
                    var i = 0

                    for (i = 0; i < inputs.length; i++) {

                        if (inputs[i].name == response.data[bl].name) {
                         
                            document.getElementById(inputs[i].name).innerHTML = "";

                            var x = document.getElementById(inputs[i].name);
                            var option = document.createElement("option");
                            option.text = "<-- Select Option-->";
                            option.value = '';
                            x.add(option);

                            for(var dv=0;dv<response.data[bl].value.length;dv++)
                            {
                             var x = document.getElementById(inputs[i].name);
                            var option = document.createElement("option");
                            option.text = response.data[bl].value[dv].v;
                            option.value = response.data[bl].value[dv].r;
                            x.add(option);
                            }
                          

                        }

                    }

                }
                else if(response.data[bl].type=='search')
                {
                    var inputs = document.getElementsByTagName('datalist');
                  
                    var i = 0
                   
                    
                    for (i = 0; i < inputs.length; i++) {
                       
                        if (inputs[i].id == "browsers_"+response.data[bl].name) {
                        
                            document.getElementById(inputs[i].id).innerHTML = "";

                            var x = document.getElementById(inputs[i].id);
                           

                            var options = '';

                           

                            for(var dv=0;dv<response.data[bl].value.length;dv++)
                            {
                              options += '<option label="'+response.data[bl].value[dv].v+'" value="' + response.data[bl].value[dv].r+ '" >'+response.data[bl].value[dv].v+'</option>';
                            }

                           

                            document.getElementById(inputs[i].id).innerHTML = options;
                          

                        }

                    }

                }
                }
                }

            }).catch(error => {
                // business_logic_data=[]

            })

        }

        var inputs = document.getElementsByTagName('input');

        var i = 0

        for (i = 0; i < inputs.length; i++) {

            if (inputs[i].name == name && value != '' && this.state.inputName.indexOf(inputs[i].name + '0') > 0) {
                inputs[i].style.border = '1px solid green'
            } else if (inputs[i].name == name && value == '' && this.state.inputName.indexOf(inputs[i].name + '0') > 0) {
                inputs[i].style.border = '1px solid red'
            }

        }

        var inputs = document.getElementsByTagName('select');

        var i = 0

        for (i = 0; i < inputs.length; i++) {

            if (inputs[i].name == name && value != '' && this.state.inputName.indexOf(inputs[i].name + '0') > 0) {
                inputs[i].style.border = '1px solid green'
            } else if (inputs[i].name == name && value == '' && this.state.inputName.indexOf(inputs[i].name + '0') > 0) {
                inputs[i].style.border = '1px solid red'
            }

        }

        var inputs = document.getElementsByTagName('textarea');

        var i = 0

        for (i = 0; i < inputs.length; i++) {

            if (inputs[i].name == name && value != '' && this.state.inputName.indexOf(inputs[i].name + '0') > 0) {
                inputs[i].style.border = '1px solid green'
            } else if (inputs[i].name == name && value == '' && this.state.inputName.indexOf(inputs[i].name + '0') > 0) {
                inputs[i].style.border = '1px solid red'
            }

        }

    }

    handleClose = () => {

        this.setState({setShow: false})
        this.setState({updateModalCls: false})
        
       
    };

    renderRedirect = () => {
        if (this.state.updateModalCls==false) {
            this.setState({updateModalCls: true})
          return <Redirect to={'/ui/' + this.queryID + '/reg'} />
        }
      }

    handleShow = () => {

        this.setState({setShow: true})

    };

    handleShowReg = () => {

        this.setState({setShow: true})
        this.refresh()

    };
    handleChangeRich = (event) => {
        if (this.editorNameDone < 1) {
            var i,
                n = 0;

            var inputs = document.getElementsByTagName('textarea');
            for (i = 0; i < inputs.length; i++) {

                if (inputs[i].name == '') {
                    inputs[i].name = this.editorName[n]
                    n = n + 1
                    // inputs[i].value='<h1>jisan</h1>'

                }
            }
            this.editorNameDone = 1
        }
        this.setState({
            [this.editorName[0]]: event
        })

    }
    advSerShow = () => {

        this.setState({advSer: true});
        this.advSerUI1 = [];
        this.advSerSL=0;
       
        this.setState({advSerUI:this.advSerUI1})
        
        this.advSerUI(" ");

    };
    advSerHide = () => {

        this.setState({advSer: false})

    };

    advSerUI1 = [];
    advSerSL=0;
    advSerQuery="";

    advSeronchg = (event) => {

        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]:value});
    }
    advSerUI =  (data) => {

      
       
if(data=="Search")
{
    this.advSerQuery=" and ( ";
    var i=1;
    for(i=1;i<=this.advSerSL;i++)
    {
        if(this.state["advSerCol"+i]!='-'&&this.state["advSerCon"+i]!='-')
        {
           

            if(this.state["advSerCon"+i]=="like")
            {
                this.advSerQuery=this.advSerQuery+" "+this.state["advSer_and_or"+i]+" lower("+this.state["advSerCol"+i]+") "+"like"+" '%"+this.state["advSerData" + i].toLowerCase()+"%' ";
            }else
            {
                this.advSerQuery=this.advSerQuery+" "+this.state["advSer_and_or"+i]+" "+this.state["advSerCol"+i]+" "+this.state["advSerCon"+i]+" '"+this.state["advSerData" + i]+"' ";
            }

        }else{
            this.advSerQuery=" and ( 1 "
        }
        
    }
    this.advSerQuery=this.advSerQuery+" )"
  

    this.setState({advSerQueryFinal:this.advSerQuery})

    axios
    .post(window.host + '/dataSearch', {
    qid: this.queryID,
    fq:this.advSerQuery,
})
    .then(response => {
        this.setState({searchValue: ''})
        this.setState({advSer: false})
        this.refresh()


    })
}
else if(data=="SearchAll")
    {
        
        
        this.advSerQuery=" and ( ";
        var i=0,j=0;
        for(i=0;i<this.state.tempSearchOptionLike.length-1;i++)
        {
            this.advSerQuery=this.advSerQuery+" lower("+this.state.tempSearchOptionLike[i]+") like '%"+this.state.searchValue.toLowerCase()+"%' or " ;
            j=i+1
        }
        this.advSerQuery=this.advSerQuery+" lower("+this.state.tempSearchOptionLike[j]+") like '%"+this.state.searchValue.toLowerCase()+"%' " ;
        this.advSerQuery=this.advSerQuery+" )";

        this.setState({advSerQueryFinal:this.advSerQuery})

axios
.post(window.host + '/dataSearch', {
qid: this.queryID,
fq:this.advSerQuery,
})
.then(response => {
    this.setState({searchValue: ''})
    this.refresh()

})
    }
else
{ this.advSerSL=this.advSerSL+1;
    this.setState({["advSerCol"+this.advSerSL]:"-"});
    this.setState({["advSerCon"+this.advSerSL]:"like"});
    this.setState({["advSerData" + this.advSerSL]:""});
    this.advSerUI1.push(
        <tr>
            <th>
                <select
                    type="text"
                    name={"advSerCol"+this.advSerSL}
                    id={"advSerCol"+this.advSerSL}
                    class="form-control float-right"
                    onChange={this.advSeronchg}>
                    {this.state.searchOption}
                </select>
            </th>
            <th> <select
                type="text"
                name={"advSerCon"+this.advSerSL}
                    id={"advSerCon"+this.advSerSL}
                class="form-control float-right"
                onChange={this.advSeronchg}>
             <option value="-">{"<-Condition->"}</option>
             <option value="=">{"="}</option>
               <option value="like">{"Match Any"}</option>
              
               <option value=">">{">"}</option>
               <option value=">=">{">="}</option>
               <option value="<">{"<"}</option>
               <option value="<=">{"<="}</option>
               <option value="!=">{"!="}</option>
               
            </select></th>
            <th>
                <input
                    class="form-control"
                    type="text"
                    name={"advSerData" + this.advSerSL}
                    id={"advSerData" + this.advSerSL}
                    onKeyDown={this._handleKeyDownAdvSearch}
                    onChange={this.advSeronchg}

                ></input>

                
            </th>
        </tr>
    )

    this.setState({advSerUI:this.advSerUI1})
    this.setState({["advSer_and_or" + this.advSerSL]:data})

    
}
      

    };


    constructor()
    {
        super()
        this.state = {
            advSerUI:[],
            updateModalCls:true,
            advSer:false,
            SubmitMSG:'',
            submitBtnEnable:false,
            prvBtnDisable:false,
            rowShow:0,
            tableHeight:'500px',
            tabular_enable:false,
            insert_enable: true,
            edit_privilege: true,
            delete_privilege: true,
            report_enable: true,
            sl_enable: true,
            modalLoad: 0,
            setShow: false,
            show: false,
            colAsc: 0,
            uiData: [],
            dbContent: [],
            isLoading: false,
            uid: "",
            disabled: true,
            tblColHead: [],
            tblRowData: [],
            uiInput: [],
            inputName: [],
            inputFocus: [],
            selectOption: [],
            searchOption: [],
            btnText: "Submit",
            files: [],
            searchCol: '0',
            searchValue: '',
            tabular_data:[],
            dataBrowser:[],
        } 

   

    }

    onchgChkTabular = (event) => {

        var name = event.target.name;
        var value = event.target.value;
       
console.log(this.state.load_on_transport_tabularInput_2_1)


        if (this.queryID == "24b16fede9a67c9251d3e7c7161c83ac" || this.queryID == "ffd52f3c7e12435a724a8f30fddadd9c") {
            document.getElementById("tabularInput_1_" + name.replace('tabularInput_2_', '')).checked = true;
            axios
                .post(window.host + "/ui/tabular", {
                    tbl: this.state.uiData[0][0].table_name,
                    sl: name.replace('tabularInput_2_', ''),
                    status: 1,
                    data: value,

                })
                .then(response => {})
                .catch(error => {})
        } else {
           
            document.getElementById(name).value =value ;
            
            axios
                .post(window.host + "/ui/tabular", {
                    tbl: this.state.uiData[0][0].table_name,
                    sl: name,
                    status: 1,
                    data: Number(value),

                })
                .then(response => {})
                .catch(error => {})
        }


    }
    
   onchgChk = (event) => {

    var name = event.target.name;
    var value = event.target.value;

var updateData=this.state.sms


    if(event.target.checked==true)
    {
        if(this.queryID=="24b16fede9a67c9251d3e7c7161c83ac"||this.queryID=="ffd52f3c7e12435a724a8f30fddadd9c")
        {
            document.getElementById("tabularInput_2_"+value).value = updateData;
        }
        axios
        .post(window.host + "/ui/tabular",{
            tbl:this.state.uiData[0][0].table_name,
            sl:value,
            status:1,
            data:updateData
           
        })
        .then(response => {})
        .catch(error => {})
    }else
    {
        if(this.queryID=="24b16fede9a67c9251d3e7c7161c83ac"||this.queryID=="ffd52f3c7e12435a724a8f30fddadd9c")
        {
            document.getElementById("tabularInput_2_"+value).value = "";
        }
        axios
        .post(window.host + "/ui/tabular",{
            tbl:this.state.uiData[0][0].table_name,
            sl:value,
            status:0,
            data:updateData
           
        })
        .then(response => {})
        .catch(error => {}) 
    }


 /*
  
  if(this.state.tabular_data.length==0)
  {
      this
      .state
      .tabular_data
      .push({sl:"i",data:"i"});

     


  }

    if(event.target.checked==true)
    {
        this
        .state
        .tabular_data
        .push({sl:value,data:value});
       
        if(this.queryID=="24b16fede9a67c9251d3e7c7161c83ac")
        {
            document.getElementById("tabularInput_2_"+value).value = this.state.sms;
        }
       
     
    }else
    {  for(var i = 0; i < this.state.tabular_data.length; i++)
        {
            
          if(this.state.tabular_data[i].sl == value)
          {
           
            
            this.state.tabular_data.splice(i,i);
            document.getElementById("tabularInput_2_"+value).value = '';
           
            
          }
        }

       

    }

    console.log(this.state.tabular_data)*/

   
              //alert(JSON.stringify(this.state.tabular_data))
       // alert('name :' +name+" value: "+value)

        
    }

    resetState()
    {

        var i = 0
        var inputID = ""
        var focus = false;

        this.setState({inputName: []})
        for (i = 0; i < this.state.uiData[0].length; i++) {

            this.setState({
                [this.state.uiData[0][i].col_name]: ""
            })
            inputID = this.state.uiData[0][i].col_name
            this
                .state
                .inputName
                .push(inputID + this.state.uiData[0][i].isnull);

            this
                .state
                .inputFocus
                .push(inputID);

        }
        var editIndex = ''
        if (this.tempEditID != 'reg') {
            for (editIndex = 0; editIndex < this.state.uiData[2].length; editIndex++) {

                if (this.state.uiData[2][editIndex]['sl'] == this.tempEditID) {
                    this.setState({btnText: 'Update'})
                    this.handleShow()
                    if (this.state.modalLoad == 0) {
                        this.setState({modalLoad: 1})
                        this.refresh()
                    }
                    this.setState({uid: this.tempEditID});

                    break;
                }
            }

        }
        var inputs = document.getElementsByTagName('input');
        for (i = 0; i < inputs.length; i++) {

            if (focus == false & (this.state.inputName.indexOf(inputs[i].name + '0') >= 0 || this.state.inputName.indexOf(inputs[i].name + '1') >= 0)) {
                inputs[i].focus()
                focus = true
            }

            if (inputs[i].type == 'file') {
                inputs[i].className = "custom-file-input"
                inputs[i].style.border = '1px solid red'
                this.setState({files: []})

            }

            if (this.state.inputName.indexOf(inputs[i].name + '0') >= 0) {
                inputs[i].value = '';
                inputs[i].style.border = '1px solid red'

                if (this.tempEditID != 'reg') {
                    inputs[i].value = this.state.uiData[2][editIndex][inputs[i].name]
                    this.setState({
                        [inputs[i].name]: this.state.uiData[2][editIndex][inputs[i].name]
                    })
                    inputs[i].style.border = '1px solid green'
                } else {
                    
                    if (inputs[i].name == 'branch') {
                        inputs[i].value = window.branch;
                        this.setState({['branch']: window.branch})
                    } else if (inputs[i].name == 'org_id') {
                        inputs[i].value = window.org_id;
                        this.setState({['org_id']: window.org_id})
                    }
                    else if (inputs[i].name == 'dml_by') {
                        inputs[i].value = window.uid;
                        this.setState({['dml_by']: window.uid})
                    }
                }

            } else if (this.state.inputName.indexOf(inputs[i].name + '1') >= 0) {
                inputs[i].value = '';
                inputs[i].style.border = '1px solid green'
                if (this.tempEditID != 'reg') {
                    inputs[i].value = this.state.uiData[2][editIndex][inputs[i].name]
                    this.setState({
                        [inputs[i].name]: this.state.uiData[2][editIndex][inputs[i].name]
                    })
                    inputs[i].style.border = '1px solid green'
                }

            }

        }

        var inputs = document.getElementsByTagName('select');
        for (i = 0; i < inputs.length; i++) {

            if (focus == false & (this.state.inputName.indexOf(inputs[i].name + '0') >= 0 || this.state.inputName.indexOf(inputs[i].name + '1') >= 0)) {
                inputs[i].focus()
                focus = true
            }

            if (this.state.inputName.indexOf(inputs[i].name + '0') >= 0) {
                inputs[i].value = '';
                inputs[i].style.border = '1px solid red'
                if (this.tempEditID != 'reg') {
                    inputs[i].value = this.state.uiData[2][editIndex][inputs[i].name]
                    this.setState({
                        [inputs[i].name]: this.state.uiData[2][editIndex][inputs[i].name]
                    })
                    inputs[i].style.border = '1px solid green'
                }

            } else if (this.state.inputName.indexOf(inputs[i].name + '1') >= 0) {
                inputs[i].value = '';
                inputs[i].style.border = '1px solid green'
                if (this.tempEditID != 'reg') {
                    inputs[i].value = this.state.uiData[2][editIndex][inputs[i].name]
                    this.setState({
                        [inputs[i].name]: this.state.uiData[2][editIndex][inputs[i].name]
                    })
                    inputs[i].style.border = '1px solid green'
                }

            }

        }

        var inputs = document.getElementsByTagName('textarea');
        for (i = 0; i < inputs.length; i++) {

            if (focus == false & (this.state.inputName.indexOf(inputs[i].name + '0') >= 0 || this.state.inputName.indexOf(inputs[i].name + '1') >= 0)) {
                inputs[i].focus()
                focus = true
            }

            if (this.state.inputName.indexOf(inputs[i].name + '0') >= 0) {
                inputs[i].value = '';
                inputs[i].style.border = '1px solid red'
                if (this.tempEditID != 'reg') {
                    inputs[i].value = this.state.uiData[2][editIndex][inputs[i].name]
                    this.setState({
                        [inputs[i].name]: this.state.uiData[2][editIndex][inputs[i].name]
                    })
                    inputs[i].style.border = '1px solid green'
                }

            } else if (this.state.inputName.indexOf(inputs[i].name + '1') >= 0) {
                inputs[i].value = '';
                inputs[i].style.border = '1px solid green'
                if (this.tempEditID != 'reg') {
                    inputs[i].value = this.state.uiData[2][editIndex][inputs[i].name]
                    this.setState({
                        [inputs[i].name]: this.state.uiData[2][editIndex][inputs[i].name]
                    })
                    inputs[i].style.border = '1px solid green'
                }

            }

        }

    }

    refresh = async e => {
        if(this.state.rowShow<=0)
        {
            this.setState({prvBtnDisable:true})
        }else{
            this.setState({prvBtnDisable:false})
        }
        this.setState({isLoading: true});
        this.uiGenerator()
        axios
            .get(window.host + "/ui")
            .then(response => {
                NotificationManager.success('Successful', 'Reloaded', 1000);
                this.setState({dbContent: response.data[1]})
                this.resetState()
                this.setState({isLoading: false});

                this.setState({tblRowData: []});
                var tempTblRowData = this
                    .state
                    .tblRowData
                    .slice();
                var i = 0,
                    j = 0;
                for (i = 0; i <= this.state.dbContent.length - 1; i++) {
                    tempTblRowData.push(
                        <tr></tr>
                    )
                    try {
                        var colName = Object.keys(this.state.uiData[1][0]);

                        for (j = 0; j <= colName.length - 1; j++) {
                            if (this.state.edit_privilege == true || this.tblNameRepresent.replace(/_/g, " ").replace(/_/g, " ").initCap() == 'Pages') {
                                if (j == 0) {
                                    tempTblRowData.push(
                                        <td class="align-middle">
                                            <Link
                                                to={'/ui/' + this.queryID + '/' + this.state.dbContent[i][colName[j]]}
                                                className="nav-link">
                                                <i className="nav-icon fas fa-edit"></i>
                                            </Link>
                                        </td>

                                    )
                                }
                            }
                            if (j == 0) {

                                if (this.state.tabular_enable == true ){
                                var tabular_enable_check_id=""
                                tabular_enable_check_id=this.state.dbContent[i][colName[j]]
                                tempTblRowData.push(
                                    <td class="align-middle">
                                     
                                      <input type="checkbox" value={tabular_enable_check_id}  onChange={this.onchgChk}  name= {"tabularInput_1_"+tabular_enable_check_id} id= {"tabularInput_1_"+tabular_enable_check_id}/>

                                     
                                      
                                    </td>

                                    

                                )}
                                tempTblRowData.push(
                                    <td class="align-middle">
                                        {i+1}
                                    </td>

                                    

                                )
                                
                            }
                            
                            if (colName[j] != 'image' && colName[j].indexOf('image_')<0 &&colName[j] != 'sl'  ) {
                                var dHtml = this.state.dbContent[i][colName[j]]

                                if(this.state.tabular_enable == true)
                                {
                                    if(colName[j].indexOf('(textarea)')>=0)
                                    {
                                        tempTblRowData.push(
                                            <td class="align-middle">
                                                <textarea
                                                 class="form-control"
                                                name= {"tabularInput_2_"+tabular_enable_check_id}
                                                id= {"tabularInput_2_"+tabular_enable_check_id}
                                                onChange={this.onchgChkTabular}
                                                value={this.state.dbContent[i][colName[j]]}></textarea>
                                            </td>
                                        )
                                    }else  if(colName[j].indexOf('(number)')>=0)
                                    {
                                        this.setState({[colName[j].replace('(number)','_')+"tabularInput_2_"+tabular_enable_check_id]:this.state.dbContent[i][colName[j]]})
                                        tempTblRowData.push(
                                            <td class="align-middle">
                                                <input
                                                class="form-control"
                                                type="number"
                                                name= {colName[j].replace('(number)','_')+"tabularInput_2_"+tabular_enable_check_id}
                                                id= {colName[j].replace('(number)','_')+"tabularInput_2_"+tabular_enable_check_id}
                                                onChange={this.onchgChkTabular}
                                                ></input>
                                            </td>
                                        )
                                    }
                                    else
                                    {
                                        tempTblRowData.push(
                                            <td class="align-middle">
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                    __html: dHtml
                                                }}></div>
                                            </td>
                                        )
                                    }
                               }
                                else
                                {
                                    tempTblRowData.push(
                                        <td class="align-middle">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                __html: dHtml
                                            }}></div>
                                        </td>
                                    )
                                }
                            }  else if(colName[j]=='sl'){
                                
                            
                                if(this.state.sl_enable == true || this.tblNameRepresent.replace(/_/g, " ").replace(/_/g, " ").initCap() == 'Pages'){
                                    tempTblRowData.push(
                                        <td class="align-middle">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                __html: this.state.dbContent[i][colName[j]]
                                            }}></div>
                                        </td>
                                    )

                                }
                            }
                            else if(colName[j]=='image'){
                                tempTblRowData.push(
                                    <td class="align-middle" ><img
                                        style={{
                                        width: "150px",
                                        height: "150px"
                                    }}
                                        src={window.host + "/userFiles/" + window.uid + '/' + window.password + '/' + this.state.dbContent[i][colName[j]]}
                                        class={"img-thumbnail"}/></td>
                                )

                            }
                            else if(colName[j].indexOf('image_')>=0) {
                                tempTblRowData.push(
                                    <td class="align-middle"><img
                                        style={{
                                        width: "150px",
                                        height: "150px"
                                    }}
                                        src={ this.state.dbContent[i][colName[j]]}
                                        class={"img-thumbnail"}/></td>
                                )

                            }

                        }
                    } catch (ex) {}
                    if (this.state.delete_privilege == true || this.tblNameRepresent.replace(/_/g, " ").replace(/_/g, " ").initCap() == 'Pages') {
                        tempTblRowData.push(
                            <td class="align-middle">

                                <Link
                                    to={this.route}
                                    className="nav-link"
                                    data-toggle="modal"
                                    data-target={"#delete" + this.state.dbContent[i].sl}>
                                    <i
                                        style={{
                                        color: "red"
                                    }}
                                        class="fa fa-trash"></i>
                                </Link>

                                <div
                                    className="modal fade"
                                    id={"delete" + this.state.dbContent[i].sl}
                                    tabIndex={-1}
                                    role="dialog"
                                    aria-labelledby="exampleModalCenterTitle"
                                    aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLongTitle">Alert</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                Are You Want to Delete ? <span style={{color:"red"}}> &nbsp;&nbsp;
                                                All related data will be deleted. </span>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    name="uid"
                                                    id="uid"
                                                    value={this.state.dbContent[i].sl}
                                                    onClick={this.delete}
                                                    data-dismiss="modal">Confirm</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </td>
                        )
                    }
                    tempTblRowData.push(
                        <tr></tr>
                    )
                }

                this.setState({tblRowData: tempTblRowData});
                if(this.state.dbContent.length<10)
                {
                    
                    this.setState({nxtBtnDisable:true});
                }else if(this.state.dbContent.length>10)
                {
                    
                    this.setState({nxtBtnDisable:true});
                }
                else
                {
                    this.setState({nxtBtnDisable:false});
                }

            })
            .catch(error => {

                NotificationManager.error('Failed', 'Reloaded', 1000);
                console.log(error)
            })

            
          

    }

    tblRst = async e => {
        this.refresh();
        this.setState({rowShow:0})
        axios
            .post(window.host + '/tblRst',)
            .then(response => {})
    }

    next = async e => {
        
        axios
            .post(window.host + '/next',{rowShow:this.state.rowShow+10})
            .then(response => {
                this.setState({rowShow:this.state.rowShow+10})
                this.refresh()
                
                
            })
    }

    prv = async e => {
        
        axios
            .post(window.host + '/prv',{rowShow:this.state.rowShow-10})
            .then(response => {
                this.setState({rowShow:this.state.rowShow-10})
                this.refresh()
            })
    } 

    submit = async e => {

        var inputs = document.getElementsByTagName('input');

        var i = 0

        var submit = true;

        for (i = 0; i < inputs.length; i++) {

            if (this.state.inputName.indexOf(inputs[i].name + '0') >= 0) {

                if (inputs[i].value == '') {
                    console.log('name: '+inputs[i].name+' value: '+inputs[i].value)
                    submit = false;

                }

            }

        }
        var inputs = document.getElementsByTagName('select');
        
        for (i = 0; i < inputs.length; i++) {
            
            if (this.state.inputName.indexOf(inputs[i].name + '0') >= 0) {

                if (inputs[i].value == '') {
                    console.log('name: '+inputs[i].name+' value: '+inputs[i].value)
                    submit = false;

                }

            }

        }
        if (submit == false) {
            NotificationManager.warning('Fill up', 'Mandatory Field', 1000);
        } else {
            if (this.state.btnText == 'Update') {
                this.setState({isLoading: true});

                axios
                    .put(window.host + this.route, this.state)
                    .then(response => {
                        this.refresh()
                        this.setState({isLoading: false});

                        NotificationManager.success('Successful', 'Submission', 1000);
                        this.setState({SubmitMSG:''})

                        this
                            .props
                            .history
                            .push('/ui/' + this.queryID + '/reg');
                    })
                    .catch(error => {
                        NotificationManager.error('Failed', 'Submission', 1000);
                        this.setState({isLoading: false});

                        this.setState({btnText: 'Update'})
                        console.log(error)
                    });
                this.setState({btnText: 'Submit'})
            } else {
                this.setState({isLoading: true});
                axios
                    .post(window.host + this.route, this.state)
                    .then(response => {
                        this.refresh()
                        this.setState({isLoading: false});
                        NotificationManager.success('Successful', 'Submission', 1000);
                        this.setState({SubmitMSG:''})
                        this
                            .props
                            .history
                            .push('/ui/' + this.queryID + '/reg');
                    })
                    .catch(error => {
                        NotificationManager.error('Failed', 'Submission', 1000);
                        this.setState({isLoading: false});
                        console.log(error)
                    })

            }
        }
        this.handleClose()
    }

    delete = (event) => {
        var name = event.target.name;
        var value = event.target.value;

        axios
            .delete(window.host + this.route, {
            data: {
                uid: value
            }
        })
            .then(response => {
                this.refresh()
                this
                    .props
                    .history
                    .push('/ui/' + this.queryID + '/reg');
            })
            .catch(error => {
                NotificationManager.error('Failed', 'Submission', 1000);
            });

    }

    render() {

        return (
            <div class="content-wrapper">
 {this.renderRedirect()}
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h4></h4>
                            </div>
                        </div>
                    </div>
                </section>
                {this.state.insert_enable == true || this
                    .tblNameRepresent
                    .replace(/_/g, " ")
                    .replace(/_/g, " ")
                    .initCap() == 'Pages'
                    ? <section className="content">

                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {/* Default box */}
                                        <div class="card card-dark collapsed-card">
                                            <div className="card-header">
                                                <h3 class="card-title">{this
                                                        .tblNameRepresent
                                                        .replace(/_/g, " ")
                                                        .replace(/_/g, " ")
                                                         + " Information Registry"}</h3>&nbsp;&nbsp; <span><a href={this.state.helpLink} target="_blank"><i class="fa fa-question-circle" aria-hidden="true"></i></a></span>
                                                <div className="card-tools">
                                                    <button
                                                        type="button"
                                                        className="btn btn-tool"
                                                        data-card-widget="collapse"
                                                        data-toggle="tooltip"
                                                        title="Collapse">
                                                        <i className="fas fa-plus"/></button>

                                                </div>
                                            </div>

                                            <div class="card-body">

                                                {/************** Start Dynamic Input Tag ****************/}

                                                {this.state.uiInput}

                                                {/************** End Dynamic Input Tag ****************/}

                                            </div>
                                          

                                            { this.state.tabular_enable == false?<div class="card-footer">
                                               
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
                                                        disabled={this.state.submitBtnEnable}
                                                        class="btn btn-primary">
                                                        {this.state.btnText}
                                                    </button>}
                                                &nbsp;&nbsp;
                                                
                                                <Link to={'/ui/' + this.queryID + '/reg'} class="btn btn-primary">Cancel
                                                </Link>
                                                <span style={{color:"red"}}> &nbsp;&nbsp;
                                               {this.state.SubmitMSG}</span>
                                             
                                                

                                            </div>:<></>}

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>
                    : <></>}

                {/****Start Table */}

                {this.state.report_enable == true || this
                    .tblNameRepresent
                    .replace(/_/g, " ")
                    .replace(/_/g, " ")
                    .initCap() == 'Pages'
                    ? <div class="container-fluid">
                            <div class="col-12">

                                <div
                                    class="card card-dark"
                                    style={{
                                    marginBottom: "60px"
                                }}>
                                    <div class="card-header">
                                        <h3 class="card-title">
                                            {this
                                                .tblNameRepresent
                                                .replace(/_/g, " ")
                                                .replace(/_/g, " ")
                                                + " Information"}&nbsp;&nbsp; <span><a href={this.state.helpLink} target="_blank"><i class="fa fa-question-circle" aria-hidden="true"></i></a></span>
                                            {this.state.isLoading
                                                ? <div>
                                                        <div class="spinner-grow text-primary" role="status"></div>
                                                        <div class="spinner-grow text-secondary" role="status"></div>
                                                        <div class="spinner-grow text-success" role="status"></div>
                                                        <div class="spinner-grow text-danger" role="status"></div>
                                                        <div class="spinner-grow text-warning" role="status"></div>
                                                        <div class="spinner-grow text-info" role="status"></div>
                                                    </div>
                                                : ""}
                                        </h3>

                                        <div class="card-tools">
                                            
                                            <div class="input-group input-group-sm" style={{}}>

                                            {/*
<select
                                                    type="text"
                                                    name="searchCol"
                                                    id="searchCol"
                                                    class="form-control float-right"
                                                    onChange={this.onchg}>
                                                    {this.state.searchOption}
                                                </select>
<input
                                                    type="text"
                                                    name="searchValue"
                                                    id="searchValue"
                                                    class="form-control float-right"
                                                    placeholder="Search"
                                                    onChange={this.onchg}
                                                    value={this.state.searchValue}
                                                    onKeyDown={this._handleKeyDownDataSearch}/>

                                                <div class="input-group-append">
                                                    <button onClick={this.dataSearch} type="submit" class="btn btn-default">
                                                        <i class="fas fa-search"></i>
                                                    </button>
                                                </div>

                                            */}
                                            <input
                                                    type="text"
                                                    name="searchValue"
                                                    id="searchValue"
                                                    class="form-control float-right"
                                                    placeholder="Search"
                                                    onChange={this.onchg}
                                                    value={this.state.searchValue}
                                                    onKeyDown={this._handleKeyDownDataSearch}/>
                                                 <div class="input-group-append">
                                                    <button  onClick={() => this.advSerUI('SearchAll')}  type="submit" class="btn btn-default">
                                                        <i class="fas fa-search"></i>
                                                    </button>
                                                </div>
                                               
                                                <div class="input-group-append">
                                                    <button onClick={this.advSerShow} type="submit" class="btn btn-default">
                                                        <i class="fa fa-search-plus"></i>
                                                    </button>
                                                </div>
                                                <div class="input-group-append">
                                                    <button type="submit" class="btn btn-default" onClick={this.tblRst}>
                                                        <i class="fas fa-sync"></i>
                                                    </button>
                                                </div>
                                                {/*this.state.insert_enable == true || this
                                                    .tblNameRepresent
                                                    .replace(/_/g, " ")
                                                    .replace(/_/g, " ")
                                                    .initCap() == 'Pages'
                                                    ? <div class="input-group-append">
                                                            <button type="submit" class="btn btn-default" onClick={this.handleShowReg}>
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                : <></>*/}

                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="card-body table-responsive p-0"
                                        style={{
                                        height: this.state.tableHeight
                                    }}>
                                        <table class="table table-head-fixed text-wrap table-hover table-bordered">
                                            <thead>
                                                <tr>

                                                    {/************** Start Table Dynamic Coloumn Heading ****************/}

                                                    {this.state.tblColHead}

                                                    {/************** End Table Dynamic Coloumn Heading ****************/}

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {/************** Start Table Dynamic Row ****************/}

                                                {this.state.tblRowData}

                                                {/************** End Table Dynamic Row ****************/}

                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="card-footer clearfix">
                <button disabled={this.state.prvBtnDisable} class="btn btn-sm btn-info float-left" onClick={this.prv}><i class="fa fa-arrow-left" aria-hidden="true"></i> Previous</button>
                <button disabled={this.state.nxtBtnDisable} class="btn btn-sm btn-info float-right" onClick={this.next}>Show Next <i class="fa fa-arrow-right" aria-hidden="true"></i></button>
              </div>
                                </div>

                            </div>
                            {/* modal start*/}
                            <> <Modal show={this.state.setShow} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{this
                                            .tblNameRepresent
                                            .replace(/_/g, " ")
                                            .replace(/_/g, " ")
                                             + " Information Update"}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div class="card-body">

                                        {this.state.uiInput}

                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                <span style={{color:"red"}}> &nbsp;&nbsp;
                                               {this.state.SubmitMSG}</span>
                                    <Button variant="primary" onClick={this.handleClose}>
                                        Cancel
                                    </Button>

                                    
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
                                            disabled={this.state.submitBtnEnable}
                                            class="btn btn-primary">
                                            {this.state.btnText}
                                        </button>}
                                </Modal.Footer>
                            </Modal>
                        </>
                        {/* modal end--*/}
                    </div>
                    : <></>}


                   {/*** Search Option Start */}
                   <Modal show={this.state.advSer} onHide={this.advSerHide}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Advance Search</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                        <div class="card-body">

                            <table style={{ width: '100%' }}>
                                <tbody>
                                   
                                    {this.state.advSerUI}
                                </tbody></table>


                        </div>
                                </Modal.Body>
                                <Modal.Footer>
                       
                        <button  onClick={() => this.advSerUI('and')} class="btn btn-primary">AND</button>
                        <button  onClick={() => this.advSerUI('or')} class="btn btn-primary">OR</button>
                        <button  onClick={() => this.advSerUI('Search')}  class="btn btn-primary">Search</button>
                           

                          
                            
                                            
                                </Modal.Footer>
                            </Modal>
                   {/*** Search Option End */}

                <NotificationContainer/>
               

            </div>
        )
    }
}
export default DynamicUI;