// Minimal amount of secure websocket server
const { json } = require('body-parser');
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

wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

let connections = {}; 
wss.on('connection', function connection(ws,req) {

  //  ws.id = wss.getUniqueID();

    ws.on('message', function incoming(message) {
        console.log('Client.ID: ' +  ws.id);
    
        wss.clients.forEach(function (client) {

           
            

        
         try{
          //  console.log(JSON.parse(message));
            var test=JSON.parse(message)
console.log(test.uid)

ws.id = test.uid;

connections[ws.id] = req;
         }
         catch{
           // console.log(message);
         }
         console.log(message);
           if (message == 'exit') {
            ws.close();
          } else {
      
            if(client.id=='1000'||client.id=='20727210001'||client.id=='3000')
            {
                delete connections['3000'];
                client.send(message);
            }else
            {
                
            }
            
              
           
      
          }
           
         
           
           });
    });

    var ip = req.connection.remoteAddress;
    ip = req.headers['x-forwarded-for'];
   
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
    ws.send('{"id":"'+ ws.id+'"}')
   
    
});