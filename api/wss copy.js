// Minimal amount of secure websocket server
var fs = require('fs');

// read ssl certificate

var privateKey = fs.readFileSync(__dirname + '/sslKey/ssl/private.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/sslKey/ssl/certificate.crt', 'utf8');

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

wss.on('connection', function connection(ws,req) {
    ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
     
        wss.clients.forEach(function (client) {

           // client.send(message);
           if (message === 'exit') {
            ws.close();
          } else {
      
            wss.clients.forEach(function(client) {
              client.send(message);
            });
      
          }
           
         
           
           });
    });

    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    const headers=req.headers['sec-websocket-key']
    const url=req.url
    ws.send('This is a crime to use our service without our permission.')
    ws.send('so destroy your connection immediately.')
    ws.send('Your ip : '+ip)
    ws.send('Connected Port : '+port)
    ws.send('Headers : '+headers)
    ws.send('url : '+url)
    ws.send('{"port":"'+port+'"}')
    
});