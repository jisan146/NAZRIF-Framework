var con = require('./dbConfig');
var globalVariable = require('./globalVariable');
const fetch = require('node-fetch');
const https = require('https');


 
// add iframe replacement to express as middleware (adds res.merge method)


const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
module.exports = function (app) {


      const fetch = require('node-fetch');
      const https = require('https');
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      app.get(globalVariable.apiRewrite +'/report/:report_name/:repFormat/:p1/:p2/:p3/:p4/:p5/:title', function (req, res) {
    

        
    
    
        var http = require('http');

       
    
        
    
        report_name = req.params.report_name
        repFormat = req.params.repFormat
        p1 = req.params.p1
        p2 = req.params.p2
        p3 = req.params.p3
        p4 = req.params.p4
        p5 = req.params.p5
  
        
    
       
    
        if(report_name=='receipt_pos'||report_name=='salary_receipt_pos')
        {
          url = "http://print_report.nazrif.com/report/report?_repName=/nazrif_report/"
          print_final_url = url + report_name + "&_repFormat=" + "xls" + "&_dataSource=default&_outFilename=print.xls&_repLocale=de_DE&_repEncoding=UTF-8&parameter1=" + p1 + "&parameter2="+p2+"&parameter3="

          final_url=url + report_name + "&_repFormat=" + "pdf" + "&_dataSource=default&_repLocale=de_DE&_repEncoding=UTF-8&parameter1=" + p1 + "&parameter2="+p2+"&parameter3="
          con
          .query("delete from receipt_print_cmd where user_id=?;insert into receipt_print_cmd(user_id,report_url)values(?,?);",[p2,p2,print_final_url],
              function (err, result, fields) {
                  if (err) {
  
  
                  } else {
                     
  
                  }
              });
              res.redirect('http://nazrif.com/report/'+report_name+'/'+repFormat+'/'+p1+'/'+p2+'/'+p3+'/b47145ac48477190d0c3bf116da9b141/4ae4a6fbd82a73f0ef4852638257c585/'+req.params.title)
        /*  var request = http.request(final_url, function (response) {
            var data = [];
      
            response.on('data', function (chunk) {
              data.push(chunk);
            });
      
            response.on('end', function () {
              console.log('ok')
              data = Buffer.concat(data); // do something with data 
             
              if(repFormat.toLowerCase()!='pdf')
              {
                res.writeHead(200, {
                  'Content-Type': 'application/'+repFormat,
                   'Content-Disposition': 'attachment; filename='+req.params.title+'.'+repFormat,
                  'Content-Length': data.length
                });
              }
              else
              {
                res.writeHead(200, {
                 // 'Content-Type': 'application/rtf',
                   //'Content-Disposition': 'attachment; filename=some_file.rtf',
                  'Content-Length': data.length
                });
              }
              res.end(Buffer.from(data, 'binary'));
            });
          });
      
      
      
          request.end();*/
        }else
        {
/*select standard_hash ( '230049008251111', 'SHA512')
from dual;*/
          //http://192.168.0.10:8080/jasperserver/flow.html?_flowId=viewReportFlow&j_username=jasperadmin&j_password=jasperadmin&reportUnit=/reports/res3_sub3&parameter1=74&output=pdf
         /* res.redirect('http://192.168.0.10:8080/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports&reportUnit=/reports/res3_sub3&standAlone=false&j_username=jasperadmin&j_password=jasperadmin&parameter1=90&output=pdf&decorate=no');*/

         url = "http://report.nazrif.com/jasperserver/flow.html?_flowId=viewReportFlow&j_username=report_viewer&j_password=report_viewer&reportUnit=/reports/"

         final_url = url + report_name + "&output=" + repFormat + "&parameter1=" + p1 + "&parameter2="+p2+"&parameter3="

       //  res.send('<iframe style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" src="'+final_url+'" title="'+req.params.title+'">');

        res.redirect('http://nazrif.com/report/'+report_name+'/'+repFormat+'/'+p1+'/'+p2+'/'+p3+'/'+p4+'/'+p5+'/'+req.params.title)

        //res.redirect(final_url)
       //res.send('<!DOCTYPE html><html><body><button id="openReport">Open Sample Report</button><iframe  src="http://report.nazrif.com/jasperserver/flow.html?_flowId=viewReportFlow&j_username=report_viewer&j_password=report_viewer&viewAsDashboardFrame=false&reportUnit=/reports/dicche_receipt&output=pdf&parameter1=1000&parameter2=1002&parameter3="></iframe></body></html>');
        
      
       //res.render("reportView"); 
      
      }
        
    
    
    
    
    
      });

/* app.get(globalVariable.apiRewrite +'/printReceipt/:report/:sl', function (req, res) {
      
        url = "http://localhost:8080/JasperReportsIntegration/report?_repName=/nazrif_report/"

        report_name = req.params.report
        repFormat = 'pdf'
        p1 = req.params.sl
        final_url = url + report_name + "&_repFormat=" + repFormat + "&_dataSource=default&_outFilename=&_repLocale=de_DE&_repEncoding=UTF-8&parameter1=" + p1 + "&parameter2=&parameter3="
    
        res.statusCode = 302;
        res.setHeader("Location", final_url);
        res.end();
      });*/

};