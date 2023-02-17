import React, {Component} from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import {Route, Link, BrowserRouter as Router} from '../../node_modules/react-router-dom'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import FileBase64 from 'react-file-base64';
import ReactDataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';


class Dt extends Component {
     columns = [
        { key: 'id', name: 'id' },
        { key: 'title', name: 'title' },
        { key: 'count', name: 'count' } ]
      
       rows = [{id: 0, title: 'row1', count: 20}, {id: 1, title: 'row1', count: 40}, {id: 2, title: 'row1', count: 60}];

    
    render() {
       
            return <ReactDataGrid
            columns={this.columns}
            rows={this.rows}
            minHeight={50} />
      }
}

export default Dt;