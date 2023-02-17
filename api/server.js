/************Start  Basic Configuration *********************/
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const port = process.env.PORT || 2000
var globalVariable = require('./globalVariable');
var fs = require('fs');
var path = require('path');
var privateKey = fs.readFileSync(__dirname + '/sslKey/ssl/private.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/sslKey/ssl/certificate.crt', 'utf8');
var credentials = {
  key: privateKey,
  cert: certificate
};




var https = require('https').Server(credentials, app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


var globalVariable = require('./globalVariable');
if (globalVariable.apiRewrite == '/node') {
  https.listen(port, () => {

    console.log('Server Listening on ' + port);

  })

  //app.listen(2000);
} else {
  app.listen(2000);
}


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,UID,Token,QueryID,orgID,branch");
  next();
});

app.get(globalVariable.apiRewrite + '/serviceRun', function (req, res, next) {
  res.send('1')
});

app
  .get(globalVariable.apiRewrite + '/client_side_update', function (req, res, next) {



    res.sendFile(__dirname + "/client_side_files/server.js");


  });



/************End  Basic Configuration *********************/

/********** Start Include Module  ***********/
allApi = require('./install')(app);
allApi = require('./login')(app);
allApi = require('./notification')(app);
allApi = require('./menu_access_control')(app);
allApi = require('./dynamicGUI')(app);
allApi = require('./businessLogic/dynamicBusinessLogin')(app);
allApi = require('./dynamicHtml/invoice')(app);
allApi = require('./sms')(app);
allApi = require('./device')(app);

allApi = require('./biogas')(app);
allApi = require('./schoolDashboard')(app);
allApi = require('./printReport')(app);
allApi = require('./sensorData/dht11')(app);


if (globalVariable.apiRewrite == '/node') {
  

} else {
  allApi = require('./cronJob')(app);
}



//allApi = require('./businessLogic/tableMigrate')(app);

if (globalVariable.apiRewrite == '/node') {
  webRTC = require('./videoCallApi');
  webSocket = require('./wss');

}

/********** Start Dynamic Code  ***********/

'use strict';
var vm = require('vm');

const code = `
console.log('Server running at http://127.0.0.1:8124/');`;
vm.runInThisContext(code);


//vm.runInThisContext(code)(require);


/********** End Dynamic Code  ***********/



/********** End Include Module  ***********/

/*app.post('/userChk', function(req, res, next) {


    con = mysql.createConnection(db_config);

    con.connect(function(err) {
      con.query("select count(*) chk from users where uid=?",[req.body.uid], function (err, result, fields) {
        if (err)  {}else {res.send(String(result[0].chk));}
      });
    });

  });*/
