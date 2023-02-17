  console.log('jisan 123 123')


  module.exports = function (app) {


    const fetch = require('node-fetch');
    const https = require('https');
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    var exec = require('child_process').execFile;
    
    var fun = function () {
     
      exec(__dirname + "/receiptPrint/receiptPrint/bin/Debug/receiptPrint.exe", function (err, data) {
        console.log(err)
        console.log(data.toString());
      });
    }
    app.get('/report/:report_name/:repFormat/:p1/:title', function (req, res, next) {

      fetch("https://localhost/", {
        method: 'get',
        agent: httpsAgent,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(data => {}).catch(error => {})


      var http = require('http');

      url = "http://localhost:8080/JasperReportsIntegration/report?_repName=/nazrif_report/"

      report_name = req.params.report_name
      repFormat = req.params.repFormat
      p1 = req.params.p1
      final_url=url + report_name + "&_repFormat=" + repFormat + "&_dataSource=default&_outFilename=&_repLocale=de_DE&_repEncoding=UTF-8&parameter1=" + p1 + "&parameter2=&parameter3="

      print_final_url=url + report_name + "&_repFormat=" + "xls" + "&_dataSource=default&_outFilename=print.xls&_repLocale=de_DE&_repEncoding=UTF-8&parameter1=" + p1 + "&parameter2=&parameter3="
    

      if (report_name == "receipt_pos") {

        var http = require('http'),
          fs = require('fs');

        var request = http.get(print_final_url, function (response) {
          if (response.statusCode === 200) {
            var file = fs.createWriteStream(__dirname + "/receiptPrint/receiptPrint/bin/Debug/print.xls");
            response.pipe(file);
          }
          // Add timeout.
          request.setTimeout(12000, function () {
            request.abort();
          });
        });

        fun();
      }

      var request = http.request(final_url, function (response) {
        var data = [];

        response.on('data', function (chunk) {
          data.push(chunk);
        });

        response.on('end', function () {
          console.log('ok')
          data = Buffer.concat(data); // do something with data 
          res.writeHead(200, {
            //'Content-Type': 'application/pdf',
            // 'Content-Disposition': 'attachment; filename=some_file.pdf',
            'Content-Length': data.length
          });
          res.end(Buffer.from(data, 'binary'));
        });
      });



      request.end();





    });

    var apiRewrite = '/node'

    var server = '/cl'
    app.get(apiRewrite + '/LocalSmsReq/:org_id', function (req, res, next) {


      fetch("https://localhost/", {
        method: 'get',
        agent: httpsAgent,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(data => {}).catch(error => {})

      var req_url = ""
      if (server == '/node') {
        req_url = "https://localhost:2000/node"
      } else {
        req_url = "https://api.nazrif.com/nazrif_api"
      }

      fetch(req_url + "/SmsSendToClient/" + req.params.org_id, {
          method: 'get',

          agent: httpsAgent,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json()

        )
        .then(data => {



          var phone = data[2][0].phone;
          var sms = data[2][0].sms;
          var mobile_ip = data[0][0].mobile_ip;
          var sms_title = data[0][0].sms_title;
          var sms_sl = data[2][0].sl;

          fetch("http://" + data[0][0].mobile_ip + ":1688/services/api/status/", {
              method: 'get',
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(response => response.json()

            )
            .then(data => {

              fetch("http://" + mobile_ip + ":1688/services/api/messaging/?to=" + phone + "&Message=" + encodeURIComponent(sms_title + "\n" + sms), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
                .then(response => response.json()

                )
                .then(data => {


                  fetch(req_url + "/updateSMS/" + sms_sl + "/" + data.isSuccessful, {
                      method: 'get',
                      agent: httpsAgent,
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    })
                    .then(response => response.json()

                    )
                    .then(data => {


                      res.send(data)
                    })
                    .catch(error => {

                      res.send('nc')
                    })
                })
                .catch(error => {

                  res.send('nc')
                })




            })
            .catch(error => {


              res.send('Mobile Not Connected')

            })



        })
        .catch(error => {

          res.send("Contact to Support")

        })



    });








  };