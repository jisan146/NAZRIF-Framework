// Minimal amount of secure websocket server
var fs = require('fs');

// read ssl certificate

var privateKey = fs.readFileSync(__dirname + '/sslKey/ssl/private.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/sslKey/ssl/certificate.crt', 'utf8');
var notification = require('./pushNotification');
var con = require('./dbConfig');
var credentials = { key: privateKey, cert: certificate };
var https = require('https');

//pass in your credentials to create an https server
var httpsServer = https.createServer(credentials);
httpsServer.listen(4001);
console.log('Web Socket Listening on 4001')

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    server: httpsServer
});

let connections = {};
wss.on('connection', function connection(ws, req) {


    ws.on('message', function incoming(message) {
        //  console.log('received: %s', message);
        var jsonMSG = JSON.parse(message);


        ws.id = jsonMSG.uid;


        connections[ws.id] = req;
        var a = req.connection.remoteAddress
        var b = req.headers['x-forwarded-for']
        var ip = "R: " + a + " F: " + b

        if (jsonMSG.notify == 2) {
            notification.pushNotification(jsonMSG.uid, jsonMSG.receiver, jsonMSG.msg, 2, ip, jsonMSG.orgID, jsonMSG.branch)
            var modMSG = ""

            con.query("select sl,date_format(dml_time,'%d-%b-%y %r')dt from notification_history where sl=(select max(sl) from notification_history where sender=?);", [jsonMSG.uid], function (err, result, fields) {
                if (err) { console.log('wss err') } else {

                    modMSG = {
                        uid: jsonMSG.uid,
                        uPort: jsonMSG.uPort,
                        uName: jsonMSG.uName,
                        uImage: jsonMSG.uImage,
                        msg: jsonMSG.msg,
                        receiver: jsonMSG.receiver,
                        receiverPort: jsonMSG.receiverPort,
                        notify: jsonMSG.notify,
                        orgID: jsonMSG.orgID,
                        branch: jsonMSG.branch,
                        msgSL: result[0].sl,
                        date: result[0].dt
                    }





                    modMSG = JSON.stringify(modMSG)


                    console.log("**********")
                    console.log(modMSG)
                    wss.clients.forEach(function (client) {

                        console.log(client.id)
                        con
                            .query("update user_chat_status set chat_status=1 where user_id=?;", [
                                client.id
                            ], function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                    req
                                        .connection
                                        .destroy()
                                } else {



                                }

                            });
                        client.send(modMSG);

                    });
                    console.log("**********")
                }
            });



        } else {
            wss.clients.forEach(function (client) {

                client.send(message);
                console.log("------")
                console.log(client.id)
                console.log("----")

                con
                .query("update user_chat_status set chat_status=1 where user_id=?;", [
                    client.id
                ], function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        req
                            .connection
                            .destroy()
                    } else {



                    }

                });
            });
        }

    });

    ws.on('close', function(reasonCode, description) {

        con
                            .query("update user_chat_status set chat_status=2 where user_id=?;", [
                                ws.id
                            ], function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                    req
                                        .connection
                                        .destroy()
                                } else {

                                    console.log( ws.id+ ' disconnected.');

                                }

                            });

       
    });

    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    const headers = req.headers['sec-websocket-key']
    const url = req.url
    ws.send('This is a crime to use our service without our permission.')
    ws.send('so destroy your connection immediately.')
    ws.send('Your ip : ' + ip)
    ws.send('Connected Port : ' + port)
    ws.send('Headers : ' + headers)
    ws.send('url : ' + url)
    ws.send('{"port":"' + port + '"}')
});