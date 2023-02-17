var con = require('../dbConfig');
var notification = require('../pushNotification');
const fs = require('fs');
var md5 = require('md5');
var globalVariable = require('../globalVariable');
var apiSecurity = require('../apiSecurity');
module.exports = function (app) { 

    /******* Start Login *********/

    app
    .post(globalVariable.apiRewrite + '/PoultryFarmData', function (req, res, next) {

        con
            .query("select `sl`, date_format(t1.dml_time,'%d-%b-%y %r') dml_time,t1.humidity,t1.temperature from jismbdco_bio_gas_plant.dht11 t1 where sl=(select max(sl) from jismbdco_bio_gas_plant.dht11);", function (err, result, fields) {
                if (err) {
                    res.send('failed')

                } else {
                    res.send(result)

                }

            });

    });

        app
        .get(globalVariable.apiRewrite + '/dht11/:a/:b/:c', function (req, res, next) {
 
            con
                .query("insert into jismbdco_bio_gas_plant.dht11 values (null,?,?,?,now());",
                [
                    req.params.a,
                    req.params.b,
                    req.params.c,

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