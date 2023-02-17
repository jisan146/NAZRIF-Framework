const fs = require('fs');
var md5 = require('md5');
var con = require('./dbConfig');
function errIns(api,appErr)
{
 
 
    con.query("insert into error_monitoring values(null,?,?,'NAZRIF',now(),0,0);",[api,con.escape(JSON.stringify(appErr) )], function (err, group, fields) {
    
    });

}

function dmlIns(old_data,new_data,tblName,org_id,branch,dml_by)
{
 
 
    con.query("insert into backup values(null,?,?,now(),?,?,?,?);",[con.escape(JSON.stringify(old_data)),con.escape(JSON.stringify(new_data)),tblName,org_id,branch,dml_by], function (err, group, fields) {
    
    });

}
module.exports = {
    errIns,dmlIns
  };