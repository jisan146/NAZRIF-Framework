var con = require('./dbConfig');
var globalVariable = require('./globalVariable');
const fetch = require('node-fetch');

module.exports = function (app) {








    app.get(globalVariable.apiRewrite + '/rfid/:device_id/:card_no/:time', function (req, res, next) {


        con
            .query("update card_registration set card_no=? where org_id=(select org_id from device_info where id=?) and branch=(select branch from device_info where id=?);update employee set card_no =? where org_id is not null and sl=(select user_id from card_registration where card_no=?);update edu_student_information set card_no =? where  org_id is not null and sl=(select user_id from card_registration where card_no=?); select date_format(now(),'%h:%i %p %d%b%y') d;select sl from users where sl=(select sl from employee where card_no=?) or sl=(select sl from edu_student_information where card_no=?);delete from card_registration where org_id=(select org_id from device_info where id=?) and branch=(select branch from device_info where id=?); ", [
                req.params.card_no,
                req.params.device_id,
                req.params.device_id,
                req.params.card_no,
                req.params.card_no,
                req.params.card_no,
                req.params.card_no,
                req.params.card_no,
                req.params.card_no,
                req.params.device_id,
                req.params.device_id,
               ],
                function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {
                        
                        //res.send(result);
                       if (result[4].length > 0) {
                            res.send(result[3][0].d+"|"+String(result[4][0].sl))
                        } else {
                            res.send(result[3][0].d+"|"+req.params.card_no)
                        }

                    }
                });


    });


    app.get(globalVariable.apiRewrite + '/chk_finger_registration/:device_id', function (req, res, next) {


        con
            .query("select 1;select count(*) a, ifnull((select reset_data+re_program from device_info where id=? and password='NazrifRep@gram'),0) b from finger_print_info f where device_id=? and finger_id=0 limit 1; ", [req.params.device_id, req.params.device_id, req.params.device_id],
                function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {
                        //res.send("0")
                        res.send(String(result[1][0].a + result[1][0].b))

                    }
                });


    });

   // extract_data("s268e000000001_fid_2NAZRIF|23|_2_fid_00012345678|000000000000000000000000000000000000000000000000000fs1_09-Sep-20_18:35:02fefs1_09-Sep-20_18:48:05fefs1_09-Sep-20_18:48:11fefs1_09-Sep-20_18:48:15fefs1_09-Sep-20_18:48:20fefs1_09-Sep-20_18:48:32fefs5_21-Sep-20_09:51:02fe", "50:02:91:E0:59:B8")
    function extract_data(str, device_id) {


      /*  con
        .query("insert into edu_a_del_now(bangla) values (?);", [str],
            function (err, result, fields) {
                if (err) {
                    console.log(err)

                } else {



                }
            });*/


        
        console.log("**********")
        var data = str;

        var extract_data = []



        for (i = 99; i <= 1000; i++) {
            var p1 = data.indexOf("fs", i);
            var p2 = data.indexOf("fe", i);
            fid = data.substring(p1 + 2, data.indexOf("_", p1));
            time = data.substring(data.indexOf("_", p1) + 1, p2)
           
            if (p2 >= 0) {

                console.log("**********")
                console.log(p1)
                console.log(p2)
                console.log(fid)
                console.log(time)
                console.log("#########")

                con
                    .query("select 1;update attendance t0,finger_print_info t1 set  status=case status when 0 then 1 when 1 then 2  else status end , entry_time=case status when 0 then STR_TO_DATE(?,'%d-%b-%y_%H:%i') else entry_time end , exit_time=case status when 1 then STR_TO_DATE(?,'%d-%b-%y_%H:%i') else exit_time end  where t0.user_id=t1.user_id and t1.device_id=? and t1.finger_id=? and date_format(t0.dml_time,'%d-%b-%y')=date_format(STR_TO_DATE(?,'%d-%b-%y_%H:%i'),'%d-%b-%y') ;  ", [time, time, device_id,fid, time],
                        function (err, result, fields) {
                            if (err) {
                                console.log(err)

                            } else {



                            }
                        });




                i = p2
            } else {
                break;
            }

        }




    }

    

    app.get(globalVariable.apiRewrite + '/atd/:id/:fid/:time', function (req, res, next)

        {
            console.log(req.params.id)
            console.log(req.params.fid)
            console.log(req.params.time)


            con
                .query("select 1;select t1.name,t1.sl from finger_print_info t0, employee t1 where device_id=? and finger_id=? and t0.user_id=t1.sl;update attendance t0,finger_print_info t1 set  status=case status when 0 then 1 when 1 then 2  else status end , entry_time=case status when 0 then now() else entry_time end , exit_time=case status when 1 then now() else exit_time end  where t0.user_id=t1.user_id and t1.device_id=? and t1.finger_id=? and date_format(t0.dml_time,'%d-%b-%y')=date_format(now(),'%d-%b-%y');select status,t0.user_id uid from attendance t0, finger_print_info t1 where t0.user_id=t1.user_id and t1.device_id=? and t1.finger_id=? and date_format(t0.dml_time,'%d-%b-%y')=date_format(now(),'%d-%b-%y');",
                    [req.params.id, req.params.fid, req.params.id, req.params.fid,req.params.id,req.params.fid],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            if(result[3].length>0)
                            {
                               if(result[3][0].status=="1")
                               {
                                res.send("ID: " + result[3][0].uid + "|" + ">>>> Entry! <<<<")
                               }else if(result[3][0].status=="2")
                               {
                                res.send("ID: " + result[3][0].uid + "|" + "### Go  Home ###")
                               }
                                
                            }
                            else
                            {
                                res.send("       ID       |   Not  Found   ")
                            }
                           

                        }
                    });







        });

       
    app.post(globalVariable.apiRewrite + '/device_sync', function (req, res, next)

        {

            extract_data(req.body.data, req.body.deviceID)


            console.log(req.body)
          /*  if (req.body.req == "1") {

                console.log("a")
                res.send('NAZRIF|')
            } else
            if (req.body.req == "2") {

                console.log("b")
                res.send('12345678|')
            } else
            if (req.body.req == "3") {
                console.log("c")
                res.send('save')
            }*/
            res.send('save')

           // res.send({a:"z"})


        });




    app.get(globalVariable.apiRewrite + '/regu/:id/:fid', function (req, res, next) {
        var id = req.params.id;
        var fid = req.params.fid;

        con.query("update finger_print_info set finger_id=? where device_id=? and finger_id=0;", [fid, id], function (err, result, fields) {
            if (err) {
                console.log(err)
            } else {

                console.log('reg')
                res.send('0');
            }
        });

    });

   
  


 
 
   










};