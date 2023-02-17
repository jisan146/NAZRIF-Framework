var con = require('../dbConfig');
var apiSecurity = require('../apiSecurity');
var globalVariable = require('../globalVariable');



/***************** Start *******************/

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];



function attendace_tabular(m, y, is, ie, t,u) {

    var select = "SELECT user_id,org_id,branch,";
    var sql = "";
    var total = "";
    var colAlias = "";
    var finalSql = "";



    var i = is;

    if (ie > 0) {
        var vie = ie;
    } else {
        var vie = daysInMonth(m, y);
    }
    var month_number;

    var selectedMonthName = months[m - 1];


    for (i; i < vie; i++) {

        if (i.toString().length == 1) {

            month_number = "0" + i;


        } else {
            month_number = "" + i;

        }

        if (t == 0 || t == 1) {
            sql = sql + "\nMAX(CASE date_format(entry_time,'%d')  WHEN '" + month_number + "' then 'P' else '-'   END) as " + '"' + selectedMonthName + "_" + month_number + '",'
        }else  if (t == 2)
        {
            sql = sql + "\nMAX(CASE date_format(entry_time,'%d')  WHEN '" + month_number + "' then  concat(date_format(entry_time,'%h:%i'),' - ',ifnull(date_format(exit_time,'%h:%i'),''),' | ',ifnull(SEC_TO_TIME( (TIME_TO_SEC(timediff(exit_time, entry_time)))),'') ) else '-'   END) as " + '"' + selectedMonthName + "_" + month_number + '",'
        }
       

        colAlias = colAlias + selectedMonthName + "_" + month_number + ','


        total = total + "\nMAX(CASE date_format(entry_time,'%d')  WHEN '" + month_number + "' then 1 else 0   END) +"





    }

    if (i.toString().length == 1) {

        month_number = "0" + i;


    } else {
        month_number = "" + i;

    }
    if (t == 0 || t == 1) {
        sql = sql + "\nMAX(CASE date_format(entry_time,'%d')  WHEN '" + month_number + "' then 'P' else '-'   END) as " + '"' + selectedMonthName + "_" + month_number + '",'

    }else  if (t == 2)
    {
        sql = sql + "\nMAX(CASE date_format(entry_time,'%d')  WHEN '" + month_number + "' then  concat(date_format(entry_time,'%h:%i'),' - ',ifnull(date_format(exit_time,'%h:%i'),''),' | ',ifnull(SEC_TO_TIME( (TIME_TO_SEC(timediff(exit_time, entry_time)))),'') ) else '-'   END) as " + '"' + selectedMonthName + "_" + month_number + '",'
    }
   


    total = total + "\nMAX(CASE date_format(entry_time,'%d')  WHEN '" + month_number + "' then 1 else 0   END) as Total"

    

    if(u>0)
{
    sql = sql + "\n" + total + "_p" + "\nFROM attendance t0 where _c_ and user_id="+u+" group by user_id"
}else
{
    sql = sql + "\n" + total + "_p" + "\nFROM attendance t0 where _c_ group by user_id"
}


    colAlias = colAlias + selectedMonthName + "_" + month_number


    finalSql = "select user_id,(select name from employee where sl=t0.user_id) name,(select designation from designation where sl=(select designation from employee where sl=t0.user_id))category, total," + colAlias + " from ( " + select + total + "," + sql + " )t0";

    return (finalSql)



}



module.exports = {
    attendace_tabular,

};
/***************** End *******************/