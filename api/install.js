var con = require('./dbConfig');
const fs = require('fs');

module.exports = function (app) {
    let date_ob = new Date();

    // current date adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes +
    // ":" + seconds);
    fs.writeFileSync(__dirname + '/sql/log.txt', '----------------')
    fs.appendFileSync(__dirname + '/sql/log.txt', year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    fs.appendFileSync(__dirname + '/sql/log.txt', '----------------')
    var sql = fs.readFileSync(__dirname + '/sql/init.sql', "utf8");

    con.query(sql, function (err, result, fields) {
        if (err) {}

    });

    con.query("select * from init where sl=1", function (err, result, fields) {
        if (err) {
            console.log('Something Error');
            console.log('Please see log');
            console.log('\n');
            fs.appendFileSync(__dirname + '/sql/log.txt', err);
        } else {

            if (result[0].status != 'Done') {
                console.log('Instaling....')
                con
                    .query("update init set status='Done' where sl=1", function (err, result, fields) {
                        if (err) {
                            console.log('Something Error');
                            console.log('Please see log');
                            console.log('\n');
                            fs.appendFileSync(__dirname + '/sql/log.txt', err);
                        }
                    })

                console.log('Instaling........')

                var sql = fs.readFileSync(__dirname + '/sql/tbl.sql', "utf8");
                con.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('Something Error');
                        console.log('Please see log');
                        console.log('\n');
                        fs.appendFileSync(__dirname + '/sql/log.txt', err);
                    }
                });
                console.log('Instaling............')
                
                con
                .query("SELECT distinct TABLE_NAME tbl FROM information_schema.`COLUMNS` where TABLE_SCHEMA='nazrif';", function (err, result, fields) {
                    if (err) {
                        console.log('Something Error');
                        console.log('Please see log');
                        console.log('\n');
                        fs.appendFileSync(__dirname + '/sql/log.txt', err);
                    }else
                    {
                       
                        var i;
                        for(i=0;i<result.length;i++)
                        {
                            
                            con.query("insert into nazrif.ui_info(TABLE_NAME,col_name,input_label,isnull)SELECT TABLE_NAME,column_name,column_name,1 FROM information_schema.`COLUMNS` where TABLE_SCHEMA='nazrif' and table_name=? and column_name not in (select col_name from nazrif.ui_info where table_name=?);",[String(result[i].tbl),String(result[i].tbl)], function (err, result, fields) {
                                if (err) {
                                    console.log('Something Error');
                                    console.log('Please see log');
                                    console.log('\n');
                                    fs.appendFileSync(__dirname + '/sql/log.txt', err);
                                }
                            })
                        }
                    }
                })
              

                console.log('Sucessfully Install')
                console.log('server is running')

            } else {
                console.log('server is running')
              

            }
        }

    });

};