var con = require('./dbConfig');
var notification = require('./pushNotification');
var globalVariable = require('./globalVariable');
module.exports = function (app) {

    app.post(globalVariable.apiRewrite+'/notification', function(req, res, next) {
  
       
      
          con.query("select (select count(*) from notification_history where receiver=? and notification_status=0) notify,count(notification_type)type,case notification_type when 1 then 'fas fa-exclamation-triangle mr-2' when 2 then 'fa fa-envelope mr-2' end icon,case notification_type when 1 then 'Login Alert' when 2 then 'Message' end msg,date_format(max(dml_time),'%d-%b-%y %H:%i') date FROM notification_history  where  receiver=? and notification_status=0 group by notification_type",[req.body.uid,req.body.uid], function (err, result, fields) {
            if (err)  {req.connection.destroy();}else {res.send(result);} 
          });
        });
        

      
      app.post(globalVariable.apiRewrite+'/notificationDetails', function(req, res, next) {
        
       
   
          con.query("select sl,sender,message msg,date_format(dml_time,'%d-%b-%y %r')date,case when notification_type='1' and instr(message,'Login Success')>0 then 'badge badge-warning' when notification_type='1' and instr(message,'Login Failed')>0 then 'badge badge-danger' end status,case notification_type when 1 then 'Login' end type from notification_history where notification_type=1 and notification_status=0 and receiver=? order by sl desc limit 10",[req.body.uid], function (err, result, fields) {
            if (err)  {console.log(err);req.connection.destroy();}else {res.send(result);} 
          });
   
        
      });
      
      app.post(globalVariable.apiRewrite+'/msgDetails', function(req, res, next) {
        
   ///a
          con.query("select sl,sender,message msg,date_format(dml_time,'%d-%b-%y %r')date,case when notification_type='1' and instr(message,'Login Success')>0 then 'badge badge-warning' when notification_type='1' and instr(message,'Login Failed')>0 then 'badge badge-danger' end status,case notification_type when 1 then 'Login' end type from notification_history where notification_type=1 and notification_status=0 and receiver=? order by sl desc limit 10",[req.body.uid], function (err, result, fields) {
            if (err)  {req.connection.destroy();}else {res.send(result);} 
          });
    
      });
      
      app.post(globalVariable.apiRewrite+'/notificationUpd', function(req, res, next) {
       
       
          con.query("update notification_history set notification_status=1 where sl=?",[req.body.sl], function (err, result, fields) {
            if (err)  {req.connection.destroy();}else {res.send(result);} 
          });
       
      });
      
      app.post(globalVariable.apiRewrite+'/sendMSG', function(req, res, next) {

        var a=req.connection.remoteAddress
        var b=req.headers['x-forwarded-for']
        var ip="R: "+a+" F: "+b
       
      //  notification.pushNotification(req.headers.uid,req.body.chatRcv,req.body.sndMsg,2,ip,req.headers.orgid,req.headers.branch)
      
        res.send('1');
        
      });

};