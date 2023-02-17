var con = require('./dbConfig');
var notification = require('./pushNotification');
const fs = require('fs');
var md5 = require('md5');
var globalVariable = require('./globalVariable');
var apiSecurity = require('./apiSecurity');
module.exports = function (app) {

    /******* Start Login *********/
    
    app
        .post(globalVariable.apiRewrite + '/SchoolDashBoard', function (req, res, next) {
            org_info=" where org_id="+req.headers.orgid+" and branch="+req.headers.branch;
            only_org_info="  t0.org_id="+req.headers.orgid+" and t0.branch="+req.headers.branch;


            var sql="select count(*) activeSTD from edu_student_information "+org_info+" and active=1;select count(*) activeEMP from employee "+org_info+" and active=1;select ifnull(sum(paid),0)+ifnull((select sum(amount)from account_entry , other_account_sector , edu_revenue_type  where other_account_sector.sl=account_entry.fees_type and edu_revenue_type.sl=account_entry.description   and (account_entry.receipt_no is not null and account_entry.receipt_no!=0) and edu_revenue_type.type=2 and account_entry.branch="+req.headers.branch+" and  account_entry.org_id="+req.headers.orgid+" and date_format(account_entry.dml_time,'%d%b%y')=date_format(now(),'%d%b%y')),0) collection from edu_student_fees_collection"+org_info+" and date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y');select t0.sl,name,t1.designation,image ,ifnull((select sum(paid)  from edu_student_fees_collection where  date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and dml_by=t0.sl),0)+ifnull((select sum(amount)from account_entry , other_account_sector , edu_revenue_type   where other_account_sector.sl=account_entry.fees_type and edu_revenue_type.sl=account_entry.description   and account_entry.dml_by=t0.sl  and (account_entry.receipt_no is not null and account_entry.receipt_no!=0) and edu_revenue_type.type=2 and date_format(account_entry.dml_time,'%d%b%y')=date_format(now(),'%d%b%y')),0)collection from employee t0, designation t1 where  t0.designation=t1.sl and (t0.sl in(select dml_by from edu_student_fees_collection) or t0.sl in(select dml_by from account_entry) )   and "+only_org_info+" order by collection desc;select ifnull(sum(paid),0)+(select ifnull(sum(amount),0)from account_entry , other_account_sector , edu_revenue_type  where other_account_sector.sl=account_entry.fees_type and edu_revenue_type.sl=account_entry.description   and (account_entry.receipt_no is not null and account_entry.receipt_no!=0) and edu_revenue_type.type=3 and account_entry.branch="+req.headers.branch+" and  account_entry.org_id="+req.headers.orgid+" and date_format(account_entry.dml_time,'%d%b%y')=date_format(now(),'%d%b%y')) spend from employee_fees_collection  "+org_info+" and date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y');select t0.sl,name,t1.designation,image ,ifnull((select ifnull(sum(paid),0)  from employee_fees_collection where  date_format(dml_time,'%d%b%y')=date_format(now(),'%d%b%y') and dml_by=t0.sl),0)+ifnull((select sum(amount)from account_entry , other_account_sector , edu_revenue_type   where other_account_sector.sl=account_entry.fees_type and edu_revenue_type.sl=account_entry.description   and account_entry.dml_by=t0.sl  and (account_entry.receipt_no is not null and account_entry.receipt_no!=0) and edu_revenue_type.type=3 and date_format(account_entry.dml_time,'%d%b%y')=date_format(now(),'%d%b%y')),0)spend from employee t0, designation t1 where  t0.designation=t1.sl and (t0.sl in(select dml_by from edu_student_fees_collection) or t0.sl in(select dml_by from account_entry) )   and   t0.org_id="+req.headers.orgid+" and t0.branch="+req.headers.branch+" order by spend desc;"


           // console.log(sql)
            con
                .query(sql, function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        res.send('failed')

                    } else {
                        res.send(result)

                    }

                });

        });

       
    /******* End Menu *********/

};