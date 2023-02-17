var con = require('./dbConfig');
var globalVariable = require('./globalVariable');
const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
module.exports = function (app) {






    app.get(globalVariable.apiRewrite + '/SmsSendToClientModem/:d', function (req, res, next) {

        var pdu = require('sms-pdu-node');


        con
            .query("select 1;select 2;select t0.sl,t2.sms_title,t0.phone,t0.sms from sms t0, device_info t1, org_details t2 where t2.org_id=t1.org_id and t0.org_id=t1.org_id and t0.branch=t1.branch  and (isnull(t0.status)=1 or t0.status='') and length(t0.phone)=11 and t2.sms_server=2 and t1.id='" + req.params.d + "' limit 1;",
                function (err, result, fields) {
                    if (err) {


                    } else {

                        /* var pduDate=pdu(result[2][0].sms, "+88"+result[2][0].phone,null,16);
                         res.send([{testsl:testSL,sl:result[2][0].sl,phone:pduDate.command,sms:pduDate.pdu}]) */

                        if (result[2].length > 0) {
                            const smsPdu = require('node-sms-pdu');
                            const text = result[2][0].sms_title + " -\n" + result[2][0].sms

                            const pdu_list = smsPdu.generateSubmit("+880" + parseInt(result[2][0].phone), text, { encoding: 'ucs2' });
                            //console.log(pdu_list)
                            finalData = []
                            var i = 0, output = '{"loopLength":"' + pdu_list.length + '","sl":"' + result[2][0].sl + '","phone":"+880' + parseInt(result[2][0].phone) + '",';
                            for (i = 0; i < pdu_list.length; i++) {
                                //console.log(pdu_list[i].hex  )

                                output = output + '"hex' + i + '":"' + pdu_list[i].hex + '",';
                                output = output + '"length' + i + '":"' + pdu_list[i].length + '",';
                                finalData.push(
                                    {
                                        sl: result[2][0].sl,
                                        phone: "+880" + parseInt(result[2][0].phone),
                                        sms: text,
                                        hex: pdu_list[i].hex,
                                        length: pdu_list[i].length
                                    }
                                );
                            }
                            // console.log(output+'"AT":"OK"}')
                            //console.log(JSON.parse(output+'"AT":"OK"}'));
                            res.send(JSON.parse(output + '"AT":"OK"}'))
                            //AT+CUSD=1,"*121*1*2#",15
                        } else {
                            finalData = [];
                            finalData.push(
                                {
                                    sl: 0,
                                    phone: 0,
                                    sms: 0,
                                    hex: 0,
                                    length: 0
                                }
                            );
                            res.send({ sl: "0" })
                        }

                    }
                });


    });

    app.get(globalVariable.apiRewrite + '/SmsSendToClient/:org_id', function (req, res, next) {

        var pdu = require('sms-pdu-node');

        con
            .query("select sms_title, mobile_ip,server_ip from org_details where org_id=" + req.params.org_id + ";select count(*) c from sms where (isnull(status)=1 or status='') and org_id=" + req.params.org_id + ";select sl,phone,sms from sms where (isnull(status)=1 or status='')  and org_id=" + req.params.org_id + " limit 1;select sms_server from org_details where org_id=" + req.params.org_id + ";",
                function (err, result, fields) {
                    if (err) {


                    } else {

                        res.send(result)

                    }
                });


    });

    app.get(globalVariable.apiRewrite + '/SmsSendToClientDesktop/:uid/:pass', function (req, res, next) {



        con
            .query("select (select count(*) from receipt_print_cmd where user_id=t1.sl) print_on,(select report_url from receipt_print_cmd where user_id=t1.sl) print_url,count(*) total,t2.mobile_ip, t0.sl,t2.sms_title,t0.phone,t0.sms,t0.status from sms t0, org_details t2,users t1 where t2.org_id=t0.org_id   and (isnull(t0.status)=1 or t0.status='') and t2.sms_server=2 and t1.org_id=t0.org_id and t0.branch=t1.branch and t1.sl=?  limit 1;", [
                req.params.uid
                
            ],
                function (err, result, fields) {
                    if (err) {


                    } else {

                        // res.send(result) 
                       
                        con
                        .query("delete from receipt_print_cmd where user_id=?;",[req.params.uid],
                            function (err, result, fields) {
                                if (err) {
                
                
                                } else {
                                   
                
                                }
                            });
                        if (result.length > 0) {
                            res.send({
                                sl: result[0].sl,
                                total: result[0].total,
                                phone: result[0].phone,
                                sms: result[0].sms_title + "-\n" + result[0].sms,
                                status: result[0].status,
                                mobile_ip: result[0].mobile_ip,
                                print_on: result[0].print_on,
                                print_url: result[0].print_url
                            })
                        }
                        else {
                            res.send({
                                total: 0,
                                print_on:0

                            })

                        }


                    }
                });


    });

    app.get(globalVariable.apiRewrite + '/updateSMS/:sl/:status', function (req, res, next) {


        con
            .query("update sms set status='" + req.params.status + "' where sl=" + req.params.sl,
                function (err, result, fields) {
                    if (err) {


                    } else {
                        res.send(result)

                    }
                });


    });


    function test() {

        con
            .query("SELECT * FROM information_schema.COLUMNS where TABLE_SCHEMA='jismbdco_nazrif' and data_type='int'  ",
                function (err, result, fields) {
                    if (err) {


                    } else {
                        for (var i = 0; i < result.length; i++) {

                            console.log(result[i].COLUMN_NAME)
                            var q = "ALTER TABLE " + result[i].TABLE_NAME + " CHANGE " + result[i].COLUMN_NAME + " " + result[i].COLUMN_NAME + " DOUBLE NULL ;"
                            console.log(q)
                            con
                                .query(q,
                                    function (err, result, fields) {
                                        if (err) {


                                        } else {
                                            console.log("ok")

                                        }
                                    });

                        }



                    }
                });


    }
    // test()



};