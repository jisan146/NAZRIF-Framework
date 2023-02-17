var con = require('./dbConfig');
var notification = require('./pushNotification');
const fs = require('fs');
var md5 = require('md5');
var globalVariable = require('./globalVariable');
var apiSecurity = require('./apiSecurity');
module.exports = function (app) {

    /******* Start Login *********/

    app
        .post(globalVariable.apiRewrite + '/biogasData', function (req, res, next) {

            con
                .query("select `sl`, `temperature`, `pressure`, `humidity`, `gas_resistance`, `readAltitude`, `org_id`, `branch`, `dml_by`, date_format(dml_time,'%d-%b-%y %r')dml_time, case when methane<=100 then 10 when methane<=200 then 20 when methane<=300 then 30 when methane<=400 then 40 when methane<=500 then 50 when methane<=600 then 60 when methane<=700 then 70 when methane<=800 then 80 when methane<=100 then 95 end methane from jismbdco_bio_gas_plant.bme680 where sl=(select max(sl) from jismbdco_bio_gas_plant.bme680)", function (err, result, fields) {
                    if (err) {
                        res.send('failed')

                    } else {
                        res.send(result)

                    }

                });

        });

        app
        .get(globalVariable.apiRewrite + '/biogasDataEntry/:a/:b/:c/:d/:e/:f/:g', function (req, res, next) {

            con
                .query("insert into jismbdco_bio_gas_plant.bme680 values (null,?,?,?,?,?,72,72,20727210001,now(),?,?);",
                [

                    req.params.a,
                    req.params.b,
                    req.params.c,
                    req.params.d,
                    req.params.e,
                    req.params.f,
                    req.params.g,
                   
                ], function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        res.send('f')

                    } else {
                        res.send("s")

                    }

                });

               

        });
    /******* End Menu *********/

};