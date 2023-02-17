var con = require('../dbConfig');
var apiSecurity = require('../apiSecurity');
var globalVariable = require('../globalVariable');

module.exports = function (app) {

    /***************** Start *******************/
    con.query("SELECT t2.page v, t1.page r FROM users t0, menu_access_control t1,menu_pages t2 where t0.access=t1.group_id and t2.sl=t1.page and t0.sl=20636320002", function (err, allPageView, fields) {
        if (err) {
            console.log(err)
    
        } else {

            //console.log(allPageView)
        }})



   
   

    con.query("desc employee", function (err, allTables, fields) {
        if (err) {
            console.log(err)
    
        } else {
           
            var col_name='',serCol=''
            for(var t=0;t<allTables.length;t++)
            {
             
                if(allTables[t].Field.toLowerCase()!='dml_by'&&allTables[t].Field.toLowerCase()!='dml_time'&&allTables[t].Field.toLowerCase()!='org_id'&&allTables[t].Field.toLowerCase()!='branch')
                {
                    col_name=col_name+"t0."+allTables[t].Field+','
                    serCol=serCol+"t0."+allTables[t].Field+';'
                }
            
            }
            //console.log(col_name)
          //  console.log(serCol)
        }
    })


/*con.query("SELECT distinct table_name FROM information_schema.cOLUMNS WHERE TABLE_SCHEMA='jismbdco_smartedu'", function (err, allTables, fields) {
    if (err) {
        console.log(err)

    } else {
       // console.log(allTables)
        for(var t=0;t<allTables.length;t++)
        {
           // console.log((t+1)+" - "+allTables[t].table_name)
          // tableMigrate('edu_'+allTables[t].table_name)
        }
    }
})
*/


function tableMigrate(tbl){

    var tblName = tbl;
    con.query("desc jismbdco_smartedu." + tblName.replace('edu_', ''), function (err, result, fields) {
        if (err) {
            console.log(err)

        } else {
            var del="delete from ui_info where table_name='" + tblName + "';\n"
           

          //  del='';
           
            var sql = "create table " + tblName + " \n(\n";
            sql = sql + "sl double NOT NULL AUTO_INCREMENT,\n";
            var sql2 = ''
            sql2 = "\n\n\ninsert into ui_info values (null,'" + tblName + "','sl','sl','number',0,0,1," + 0 + "," + 0 + ",0,4,'-');";
            var ui_info_col = "t0.sl,",
                conditional_column = "t0.sl;";

            var col_name = ''
            var menuPage = '';
            var inputType='text';
            var dataEntryCol="insert into "+tblName+" select null,";
           
            for (var i = 0; i < result.length - 1; i++) {
                dataEntryCol=dataEntryCol+result[i].Field.toLowerCase()+",";
                if (result[i].Field.toLowerCase() == 'sl') {

                    col_name = "sl_old"
                    ui_info_col = ui_info_col + "t0." + col_name + ",";
                    conditional_column = conditional_column + "t0." + col_name + ";";

                } else if (result[i].Field.toLowerCase() == 'branch') {

                    col_name = "branch_old"
                    ui_info_col = ui_info_col + "t0." + col_name + ",";
                    conditional_column = conditional_column + "t0." + col_name + ";";
                } else {

                    col_name = result[i]
                        .Field
                        .toLowerCase()
                    ui_info_col = ui_info_col + "t0." + col_name + ",";
                    conditional_column = conditional_column + "t0." + col_name + ";";
                }

if(result[i].Type.toLowerCase().indexOf('int')>=0)
{
    inputType='number'
}
else if(result[i].Type.toLowerCase().indexOf('double')>=0)
{
    inputType='number'
}
else if(result[i].Type.toLowerCase().indexOf('text')>=0)
{
    inputType='text'
}
else if(result[i].Type.toLowerCase().indexOf('char')>=0)
{
    inputType='text'
}
else if(result[i].Type.toLowerCase().indexOf('blob')>=0)
{
    inputType='file'
}
else if(result[i].Type.toLowerCase().indexOf('time')>=0)
{
    inputType='date'
}
else if(result[i].Type.toLowerCase().indexOf('date')>=0)
{
    inputType='date'
}

else if(result[i].Type.toLowerCase().indexOf('float')>=0)
{
    inputType='number'
}
else
{
    inputType='text' 
}

                sql = sql + col_name + " " + result[i].Type + ", \n";
                sql2 = sql2 + "\ninsert into ui_info values (null,'" + tblName + "','" + col_name + "','" + col_name + "','"+inputType+"',0,1," + (i + 2) + "," + 0 + "," + 0 + ",0,4,'-');"
            }
            dataEntryCol=dataEntryCol+result[result.length - 1].Field.toLowerCase()+',0,now(),0,0 from jismbdco_smartedu.'+tblName.replace('edu_', '')+";";
            if (result[result.length - 1].Field.toLowerCase() == 'sl') {

                col_name = "sl_old"
                ui_info_col = ui_info_col + "t0." + col_name + ",";
                conditional_column = conditional_column + "t0." + col_name + ";";
            } else if (result[result.length - 1].Field.toLowerCase() == 'branch') {

                col_name = "branch_old"
                ui_info_col = ui_info_col + "t0." + col_name + ",";
                conditional_column = conditional_column + "t0." + col_name + ";";
            } else {

                col_name = result[result.length - 1]
                    .Field
                    .toLowerCase()
                ui_info_col = ui_info_col + "t0." + col_name + ",";
                conditional_column = conditional_column + "t0." + col_name + ";";

            }

            sql = sql + col_name + " " + result[result.length - 1].Type + ",\n";
            sql = sql + 'dml_by double,\n';
            sql = sql + 'dml_time timestamp,\n';
            sql = sql + 'org_id double,\n';
            sql = sql + 'branch double,\n';
            sql = sql + 'PRIMARY KEY (sl)\n);'
            if(result[i].Type.toLowerCase().indexOf('int')>=0)
{
    inputType='number'
}
else if(result[i].Type.toLowerCase().indexOf('double')>=0)
{
    inputType='number'
}
else if(result[i].Type.toLowerCase().indexOf('text')>=0)
{
    inputType='text'
}
else if(result[i].Type.toLowerCase().indexOf('char')>=0)
{
    inputType='text'
}
else if(result[i].Type.toLowerCase().indexOf('blob')>=0)
{
    inputType='file'
}
else if(result[i].Type.toLowerCase().indexOf('time')>=0)
{
    inputType='date'
}
else if(result[i].Type.toLowerCase().indexOf('date')>=0)
{
    inputType='date'
}

else if(result[i].Type.toLowerCase().indexOf('float')>=0)
{
    inputType='number'
}
else
{
    inputType='text' 
}
            sql2 = sql2 + "\ninsert into ui_info values (null,'" + tblName + "','" + col_name + "','" + col_name + "','"+inputType+"',0,1," + (result.length + 1) + "," + 0 + "," + 0 + ",0,4,'-');"

            ui_info_col = ui_info_col + "t0.org_id,";
            conditional_column = conditional_column + "t0.org_id;";

            ui_info_col = ui_info_col + "t0.branch";
            conditional_column = conditional_column + "t0.branch";
            sql2 = sql2 + "\ninsert into ui_info values (null,'" + tblName + "','dml_by','dml_by','hidden',0,0," + (result.length + 1+1) + "," + 0 + "," + 0 + ",0,4,'-');"
            sql2 = sql2 + "\ninsert into ui_info values (null,'" + tblName + "','dml_time','dml_time','hidden',0,0," + (result.length + 1+1+1) + "," + 0 + "," + 0 + ",0,4,'-');"
            sql2 = sql2 + "\ninsert into ui_info values (null,'" + tblName + "','org_id','org_id','hidden',0,0," + (result.length + 1+1+1+1) + "," + 0 + "," + 0 + ",0,4,'-');"

            sql2 = sql2 + "\ninsert into ui_info values (null,'" + tblName + "','branch','branch','hidden',0,0," + (result.length + 1+1+1+1+1) + "," + 0 + "," + 0 + ",0,4,'-');"
            

            menuPage = "insert into menu_pages values (\nnull,'" + tblName + "','/ui','far fa-circle nav-icon','12','q','select   sl, table_name, col_name, in" +
                    "put_label, input_type, select_sl, isnull, view_sl ,row,col_size,business_logic, " +
                    "[p], ''" + tblName + "'' title  from ui_info where table_name=''" + tblName + "'' order by view_sl;','select " + ui_info_col + " from " + tblName + " t0 ',' where _c_ ',' ','order by 1 desc; ','pagination','" + conditional_column + ";','select * from " + tblName + ";',' ','',1,1,1,1,1,'Full Access',0,0);\n\nupdate menu_pages set query_id=md5(sl" +
                    ");\n\ninsert into menu_access_control select null,1, max(sl),0,0 from menu_pages" +
                    ";"

           // console.log(sql2)
//console.log(dataEntryCol);
          con.query(del+sql + sql2+menuPage+dataEntryCol, function (err, result, fields) {
                if (err) {
                    console.log(tbl)

                } else {}
            })
        }
    })

}

    /***************** End *******************/

};