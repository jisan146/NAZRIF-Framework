var con = require('../dbConfig');
var apiSecurity = require('../apiSecurity');
var globalVariable = require('../globalVariable');



/***************** Start *******************/

function std_fees_tabular(org_id,branch)
{
    con
    .query("select replace(description,' ','_') description,base_fees,sl from edu_revenue_type where org_id="+org_id+" and ifnull(base_fees,0)>0 and branch="+branch, 
        function (err, result, fields) {
            if (err) {
                console.log(err)

            } else {
               
var sql="",due=""
                
                sql=sql+"select sl Student_ID,name,"
                for( i=0;i<result.length;i++)
                {
                    due=due+"    ifnull((select min(due) from edu_student_fees_collection where description="+result[i].sl+" and student_id=t0.sl),ifnull((select pay from edu_waiver_list where fees="+result[i].base_fees+" and student_id=t0.sl),(select pay from edu_class_pay where class=t0.class and description="+result[i].base_fees+")))+"
                }
                sql=sql+due+"0 due ,"
                for( i=0;i<result.length;i++)
                {
                   
                    sql=sql+"ifnull((select max(amount) from edu_student_fees_collection where description="+result[i].sl+" and student_id=t0.sl),0)"+'"'+result[i].description+'_Paid",'
                    
                    sql=sql+"    ifnull((select min(due) from edu_student_fees_collection where description="+result[i].sl+" and student_id=t0.sl),ifnull((select pay from edu_waiver_list where fees="+result[i].base_fees+" and student_id=t0.sl),(select pay from edu_class_pay where class=t0.class and description="+result[i].base_fees+")))"+'"'+result[i].description+'_Due",'

                    

                    

                    
                }

                sql=sql+due+"0 Total_Due "+"from  edu_student_information t0   where _c_ "
               
                 con
                                            .query("update menu_pages set report_query=?,default_report_condition=' where 1 ' where query_id=?;",['select * from ('+sql+') t0 ','bbf94b34eb32268ada57a3be5062fe7d'], 
                                                function (err, result, fields) {
                                                    if (err) {
                                                        console.log(err)
                                        
                                                    } else {
                    
                                                    }})
               

            }
        });
}



function employee_salary_tabular(org_id,branch)
{
    con
    .query("select replace(description,' ','_') description,base_salary,sl from edu_revenue_type where org_id="+org_id+" and ifnull(base_salary,0)>0 and branch="+branch, 
        function (err, result, fields) {
            if (err) {
                console.log(err)

            } else {
               
var sql="",due=""
                
                sql=sql+"select sl employee_ID,name,"
                for( i=0;i<result.length;i++)
                {
                    due=due+"    ifnull((select min(due) from employee_fees_collection where description="+result[i].sl+" and employee_id=t0.sl),ifnull((select salary from employee_non_scale_salary where base_salary="+result[i].base_salary+" and employee_ID=t0.sl),(select salary from employee_payment_scale where designation=t0.designation and description="+result[i].base_salary+")))+"
                }
                sql=sql+due+"0 due ,"
                for( i=0;i<result.length;i++)
                {
                   
                    sql=sql+"ifnull((select max(amount) from employee_fees_collection where description="+result[i].sl+" and employee_id=t0.sl),0)"+'"'+result[i].description+'_Paid",'
                    
                    sql=sql+"    ifnull((select min(due) from employee_fees_collection where description="+result[i].sl+" and employee_id=t0.sl),ifnull((select salary from employee_non_scale_salary where base_salary="+result[i].base_salary+" and employee_id=t0.sl),(select salary from employee_payment_scale where designation=t0.designation and description="+result[i].base_salary+")))"+'"'+result[i].description+'_Due",'
                    
                }

                sql=sql+due+"0 Total_Due "+"from  employee t0   where _c_ "
              
                 con
                                            .query("update menu_pages set report_query=?,default_report_condition=' where 1 ' where query_id=?;",['select * from ('+sql+') t0 ','a49e9411d64ff53eccfdd09ad10a15b3'], 
                                                function (err, result, fields) {
                                                    if (err) {
                                                        console.log(err)
                                        
                                                    } else {
                    
                                                    }})
               

            }
        });
}

function member_collection_tabular(org_id,branch)
{
    con
    .query("select replace(description,' ','_') description,membership_sector,sl from edu_revenue_type where org_id="+org_id+" and ifnull(membership_sector,0)>0 and branch="+branch, 
        function (err, result, fields) {
            if (err) {
                console.log(err)

            } else {
               
var sql="",due=""
                
                sql=sql+"select sl member_id,name_en,"
                for( i=0;i<result.length;i++)
                { //member_id,sector,payment
                    due=due+"    ifnull((select min(due) from member_transection_collection where description="+result[i].sl+" and student_id=t0.sl),ifnull((select payment from member_non_package where sector="+result[i].membership_sector+" and member_id=t0.sl),(select pay from membership_wise_payment where membership=t0.category and description="+result[i].membership_sector+")))+"
                }
                sql=sql+due+"0 due ,"
                for( i=0;i<result.length;i++)
                {
                   
                    sql=sql+"ifnull((select max(amount) from member_transection_collection where description="+result[i].sl+" and student_id=t0.sl),0)"+'"'+result[i].description+'_Paid",'
                    
                    sql=sql+"    ifnull((select min(due) from member_transection_collection where description="+result[i].sl+" and student_id=t0.sl),ifnull((select payment from member_non_package where sector="+result[i].membership_sector+" and member_id=t0.sl),(select pay from membership_wise_payment where membership=t0.category and description="+result[i].membership_sector+")))"+'"'+result[i].description+'_Due",'
                    
                }
 
                sql=sql+due+"0 Total_Due "+"from  other_member t0   where _c_ "
               
              
                 con
                                            .query("update menu_pages set report_query=?,default_report_condition=' where 1 ' where query_id=?;",['select * from ('+sql+') t0 ','ddb30680a691d157187ee1cf9e896d03'], 
                                                function (err, result, fields) {
                                                    if (err) {
                                                        console.log(err)
                                        
                                                    } else {
                    
                                                    }})
               

            }
        });
}

module.exports = {
    std_fees_tabular, employee_salary_tabular,member_collection_tabular,

};
/***************** End *******************/