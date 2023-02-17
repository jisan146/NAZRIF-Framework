import React, {Component} from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route, Link, BrowserRouter as Router} from '../../node_modules/react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import FileBase64 from 'react-file-base64';

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
            QueryID: this.queryID
        }

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
                QueryID: this.queryID
            }
            this.tempQueryID = this.queryID
            this.tempEditID = this.editID
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
                    .table_name
                    .replace(/_/g, " ")
                this.tblNameRepresent = this
                    .state
                    .uiData[0][0]
                    .table_name
                    .initCap()
                document.title = this
                    .tblNameRepresent
                    .replace(/_/g, " ")
                    .replace(/_/g, " ")
                    .initCap()

                this.setState({tblColHead: []})
                this.setState({uiInput: []})
                var tempTblColHead = this
                    .state
                    .tblColHead
                    .slice();
                var tempUiInput = this
                    .state
                    .uiInput
                    .slice();
                var i = 0
                for (i = 0; i <= this.state.uiData[0].length - 1; i++) {

                    if (i > 0) {
                        if (this.state.uiData[0][i].col_name == 'image') {
                            tempUiInput.push(
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

                            tempUiInput.push(
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
                            )
                        } else if (this.state.uiData[0][i].input_type == 'textarea') {
                            tempUiInput.push(
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
                            )
                        } else if (this.state.uiData[0][i].input_type == 'hidden') {
                            tempUiInput.push(
                                <div class="form-group">

                                    <input
                                        class="form-control"
                                        required
                                        type={this.state.uiData[0][i].input_type}
                                        name={this.state.uiData[0][i].col_name}
                                        id={this.state.uiData[0][i].col_name}
                                        onChange={this.onchg}
                                        onKeyDown={this._handleKeyDown}></input>

                                </div>
                            )
                        } else if (this.state.uiData[0][i].input_type == 'readonly') {
                            tempUiInput.push(
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
                            )
                        } else {
                            tempUiInput.push(
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
                                        type={this.state.uiData[0][i].input_type}
                                        name={this.state.uiData[0][i].col_name}
                                        id={this.state.uiData[0][i].col_name}
                                        onChange={this.onchg}
                                        onKeyDown={this._handleKeyDown}></input>

                                </div>
                            )
                        }

                    }
                }

                try {
                    var colName = Object.keys(this.state.uiData[1][0]);
                    var tempSearchOption = []
                    tempTblColHead.push(
                        <th>
                            <button
                                style={{
                                background: 'none',
                                border: 'none',
                                padding: '0',
                                color: '#069',
                                fontFamily: 'arial, sans-serif',
                                cursor: 'pointer'
                            }}
                            disabled>
                                <b>Edit</b>
                            </button>
                        </th>
                    )
                    tempSearchOption.push(
                        <option value={'0'}>{'All  →'}</option>
                    )
                    this.setState({searchCol:'0'})
                    for (i = 0; i <= colName.length - 1; i++) {
                        tempSearchOption.push(
                            <option value={i + 1}>{colName[i]
                                    .replace(/_/g, " ")
                                    .initCap() + '  →'}</option>
                        )
                        tempTblColHead.push(
                            <th>
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
                                    id={i+1}>
                                    <b>{colName[i]
                                            .replace(/_/g, " ")
                                            .initCap()}</b>
                                </button>
                            </th>
                        )
                    }
                    tempTblColHead.push(
                        <th>
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
                } catch (ex) {}

                this.setState({tblColHead: tempTblColHead});
                this.setState({searchOption: tempSearchOption});
                this.setState({uiInput: tempUiInput});

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
    dataSearch= (event) =>
    {
        
        axios
                    .post(window.host +'/dataSearch', {qid:this.queryID,q:this.state.searchValue,c:this.state.searchCol})
                    .then(response => {
                        this.refresh()
                    })
    }
    colOrder = (event) => {
        var name = event.target.innerHTML.replace('<b>','').replace('</b>','').replace('⠀↓','').replace('⠀↑','')
        

        var inputs = document.getElementsByTagName('button');
        var i = 0
        for (i = 0; i < inputs.length; i++) {
            inputs[i].innerHTML = inputs[i].innerHTML.replace('⠀↑','').replace('⠀↓','');
            if (inputs[i].name == name) {
                
                if(this.state.colAsc=='0')
                {
                    this.setState({['colAsc']:'1'})
                    inputs[i].innerHTML = "<b>"+name+"⠀↑</b>";
                    axios
                    .post(window.host +'/colOrder', {qid:this.queryID,q:' order by '+inputs[i].id+' ;'})
                    .then(response => {
                        this.refresh()
                    })
                }else
                {axios
                    .post(window.host +'/colOrder', {qid:this.queryID,q:' order by '+inputs[i].id+' desc;'})
                    .then(response => {
                        this.refresh()
                    })
                    this.setState({['colAsc']:'0'})
                    inputs[i].innerHTML = "<b>"+name+"⠀↓</b>";
                }
                
            }}
            
       

       

    }
    onchg = (event) => {

        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]: value})

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

    constructor()
    {
        super()
        this.state = {
            colAsc:0,
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
            searchCol:'0',
            searchValue:''
        }

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

                            if (colName[j] != 'image') {
                                tempTblRowData.push(
                                    <td class="align-middle">{this.state.dbContent[i][colName[j]]}</td>
                                )
                            } else {
                                tempTblRowData.push(
                                    <td class="align-middle"><img
                                        style={{
                                        width: "150px",
                                        height: "150px"
                                    }}
                                        src={window.imageLoc + "/" + this.state.dbContent[i][colName[j]]}
                                        class={"img-thumbnail"}/></td>
                                )

                            }

                        }
                    } catch (ex) {}
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
                                            Are You Want to Delete ?
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
                    tempTblRowData.push(
                        <tr></tr>
                    )
                }

                this.setState({tblRowData: tempTblRowData});

            })
            .catch(error => {

                NotificationManager.error('Failed', 'Reloaded', 1000);
                console.log(error)
            })
            
            
    }

    tblRst = async e =>
    {
        this.refresh();
        axios
            .post(window.host + '/tblRst', )
            .then(response => {})
    }

    submit = async e => {

        var inputs = document.getElementsByTagName('input');

        var i = 0

        var submit = true;

        for (i = 0; i < inputs.length; i++) {

            if (this.state.inputName.indexOf(inputs[i].name + '0') >= 0) {

                if (inputs[i].value == '') {
                    submit = false;

                }

            }

        }
        var inputs = document.getElementsByTagName('select');
        for (i = 0; i < inputs.length; i++) {

            if (this.state.inputName.indexOf(inputs[i].name + '0') >= 0) {

                if (inputs[i].value == '') {
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

                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h4></h4>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
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
                                                .initCap() + " Information Registry"}</h3>
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

                                    <div class="card-footer">
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
                                                {this.state.btnText}
                                            </button>}
                                        &nbsp;&nbsp;
                                        <Link to={'/ui/' + this.queryID + '/reg'} class="btn btn-primary">Cancel
                                        </Link>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/****Start Table */}
                <section class="content-header">

                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1></h1>

                        </div>

                    </div>

                </section>

                <div class="container-fluid">
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
                                        .initCap() + " Information"}
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
                                            onChange={this.onchg}/>

                                        <div class="input-group-append">
                                            <button onClick={this.dataSearch} type="submit" class="btn btn-default">
                                                <i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                        <div class="input-group-append">
                                            <button type="submit" class="btn btn-default" onClick={this.tblRst}>
                                                <i class="fas fa-sync"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="card-body table-responsive p-0"
                                style={{
                                height: "500px"
                            }}>
                                <table class="table table-head-fixed text-wrap">
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

                        </div>

                    </div>

                </div>

                <NotificationContainer/>

            </div>
        )
    }
}
export default DynamicUI;