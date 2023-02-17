var con = require('./dbConfig');
const fetch = require('node-fetch');
module.exports = function (app) {
    var schedule = require('node-schedule');

    var i = 0
    var j = schedule.scheduleJob('* * * * *', function () {
        i = i + 1;

        // console.log("###########################")
        con.query("insert into attendance (user_id,dml_time,org_id,branch,status) select t0.sl,now() ,t0.org_id,t0.branch,0 from users t0 where t0.sl not in (select user_id from attendance a   where date_format(a.dml_time,'%d-%b-%y')=date_format(now(),'%d-%b-%y')) ;", function (err, result, fields) {
            if (err) {
                console.log(err)
            } else {


            }
        });


    });


    var k = schedule.scheduleJob('* * * * * *', function () {

        // console.log("m")

        smsSendFromServer()



    });

    var l = schedule.scheduleJob('* * * * * *', function () {

      

        attendanceEntrySMS()



    });

    function attendanceEntrySMS()
    {
 con.query("insert into sms select null,(select phone_sms from employee where sl=t0.user_id) phone,concat('আপনি অফিসে ',date_format(entry_time,' %d-%b-%y %r '),'সময়ে  প্রবেশ করছেন।') sms,'67' status ,org_id,branch,user_id,now(),user_id,null from attendance t0 where org_id=67 and date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and status=1 and user_id not in (select unique_id from sms_business_rule where date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and sms_type=1);insert into sms select null,'01911308753',concat((select name from employee where sl=t0.user_id),' অফিসে ',date_format(entry_time,' %d-%b-%y %r '),'সময়ে  প্রবেশ করছেন।') sms,'67' status ,org_id,branch,user_id,now(),user_id,null from attendance t0 where org_id=67 and date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and status=1 and user_id not in (select unique_id from sms_business_rule where date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and sms_type=1);insert into sms_business_rule  select null,user_id,1,org_id,branch,user_id,now() from attendance where org_id=67 and date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and status=1 and user_id not in (select unique_id from sms_business_rule where date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and sms_type=1);", function (err, result, fields) {
            if (err) {
                console.log(err)
            } else {


            }
        });
    }

    function attendanceExitSMS()
    {
 con.query("insert into sms select null,(select phone_sms from employee where sl=t0.user_id) phone,concat('আপনি অফিস হতে ',date_format(dml_time,' %d-%b-%y %r '),'সময়ে  বের হয়েছেন।') sms,'67' status ,org_id,branch,user_id,now(),user_id,null from attendance t0 where org_id=67 and date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and status=2 and user_id not in (select unique_id from sms_business_rule where date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and sms_type=2);insert into sms_business_rule  select null,user_id,2,org_id,branch,user_id,now() from attendance where org_id=67 and date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and status=2 and user_id not in (select unique_id from sms_business_rule where date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and sms_type=2);", function (err, result, fields) {
            if (err) {
                console.log(err)
            } else {


            }
        });
    }

function smsSendFromServer()
{
 

    con.query("select t0.sl,t1.sms_server_api,t1.sms_title,t0.sms,t0.phone from sms t0, org_details t1 where (isnull(status)=1 or status='' or status in('67'))and t0.org_id=t1.org_id and (t1.sms_server=1 or status in('67')) and isnull(t1.sms_server_api)!=1 limit 1;", function (err, result, fields) {
        if (err) {
            console.log(err)
        } else {

            if(result.length>0)
            {
                var feedBack = "";
                var sms_status="";
                const {
                    URLSearchParams
                } = require('url');
                const params = new URLSearchParams();
                params.append('token', result[0].sms_server_api);
                params.append('to', result[0].phone);
                params.append('message', result[0].sms_title+"\n"+result[0].sms);
            
                fetch('http://api.greenweb.com.bd/api.php', {
                        method: 'POST',
                        body: params
                    })
                    .then(Response => {
                            feedBack = Response.body._outBuffer.toString("utf-8");
                           // console.log(Response)
                           
                            if(feedBack.indexOf("Invalid Token")>=0)
                            {
                                sms_status="Failed"
                            }else if(feedBack.indexOf("SMS Sent Successfully")>=0)
                            {
                                sms_status="Send"
                            }
                            else if(feedBack.indexOf("SMS Sent Successfully")<0)
                            {
                                sms_status="Failed"
                            }
                           
                            sms_status="Send"
                            con.query("update sms set status=? where sl=?",[sms_status,result[0].sl], function (err, result, fields) {
                                if (err) {
                                    console.log(err)
                                } else {
                    
                    
                                }
                            });
            
            
                        }
            
                    )
            }


        }
    });


    
}
    






}