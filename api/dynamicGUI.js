var con = require('./dbConfig');
var apiSecurity = require('./apiSecurity');
var errInsert = require('./errorMonitoring');
var globalVariable = require('./globalVariable');
var attendance = require('./businessLogic/attendance');
var accounts_tabular = require('./businessLogic/accounts_tabular');
const fs = require('fs');
var uuidv4 = require('uuid/v4');
var md5 = require('md5');
const axios = require('axios');
const fetch = require('node-fetch');
const { query } = require('./dbConfig');
module.exports = function (app) {

    /***************** Start *******************/

 /*   var gl,gli;
gl=JSON.parse(fs.readFileSync("G:/laptop/react_node_js_frame_work/api/gl/bd-postcodes.json",'utf8'));
console.log(gl);
for(gli=0;gli<gl.postcodes.length;gli++)
{
   

    con
    .query("insert into postcodes values(null,?,?,?,?,?,0,0,1000,now());",
    [
        gl.postcodes[gli].division_id,
        gl.postcodes[gli].district_id,
        gl.postcodes[gli].upazila,
        gl.postcodes[gli].postOffice,
        gl.postcodes[gli].postCode,

    ],
        function (err, result, fields) {
            if (err) {
                console.log(err)

            } else {

            }});
}*/

    
    function get_all_keyword(uid, table_name) {



        con
            .query("select concat(keyword,',')keyword,sl,org_id,branch from pos_product where published is null and nvl(length(keyword),0)>0 and sale_close!=1 and price_hide!=1",
                function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {
                        console.log(result)
                        for (var j = 0; j < result.length; j++) {
                            con
                                .query("delete from user_keyword where table_name=? and keyword_for=?", [table_name, result[j].sl],
                                    function (err, result, fields) {
                                        if (err) {
                                            console.log(err)

                                        } else {

                                        }
                                    });
                            extract_keyword(result[j].keyword, uid, result[j].sl, table_name, result[j].org_id, result[j].branch)

                        }
                    }
                });


    }


    function extract_keyword(keyword, uid, pk, table_name, org_id, branch) {


        temp_keyword = ''
        for (var i = 0; i <= keyword.length; i++) {

            if (keyword.substr(i, 1) == ',') {
                console.log(temp_keyword);




                con
                    .query("insert into user_keyword values (null,?,?,?,?,?,?);", [uid, temp_keyword, pk, table_name, org_id, branch],
                        function (err, result, fields) {
                            if (err) {
                                console.log(err)

                            } else {

                            }
                        });
                temp_keyword = ''
            } else {
                temp_keyword = temp_keyword + keyword.substr(i, 1)

            }
        }
    }


    app.get(globalVariable.apiRewrite + '/userFiles/:uid/:password/:fName', (req, res) => {
        if (apiSecurity.authentication(req.params.uid) != req.params.password) {} else {

            res.sendFile(__dirname + '/userFiles/' + req.params.fName)

        }

    });

    const userFiles = __dirname + '/userFiles/';

    function systemFileManage() {
        var i;
        con.query("delete from file_manage_temp;delete from file_manage_system_temp;insert into fil" +
            "e_manage_temp  select null,name from file_manage;",
            function (err, group, fields) {
                if (err) {
                    console.log(err)
                    errInsert.errIns('userFiles', err);
                } else {}
            });

        con.query("select table_name from ui_info where col_name='image'", function (err, group, fields) {
            if (err) {
                console.log(err)
                errInsert.errIns('userFiles', err);
            } else {

                for (i = 0; i < group.length; i++) {

                    con
                        .query("insert into file_manage_temp  select null,image from " + group[i].table_name, function (err, group, fields) {
                            if (err) {
                                console.log(err)
                                errInsert.errIns('userFiles', err);
                            } else {}
                        });
                }

            }
        });

        fs
            .readdirSync(userFiles)
            .forEach(file => {

                con
                    .query("insert into file_manage_system_temp values (null,?)", [file], function (err, group, fields) {
                        if (err) {
                            console.log(err)
                            errInsert.errIns('userFiles', err);
                        } else {}
                    })
            });

        con.query("SELECT * FROM `file_manage_system_temp` where name not in (select name from file" +
            "_manage_temp)",
            function (err, group, fields) {
                if (err) {
                    console.log(err)
                    errInsert.errIns('userFiles', err);
                } else {
                    for (i = 0; i < group.length; i++) {
                        try {
                            // fs.unlinkSync(userFiles + group[i].name)

                        } catch (err) {
                            console.error(err)
                        }
                    }
                }
            })

    }

    //systemFileManage();
    var attached_media = [];

    function unpublishedProduct(uid, orgid, branch, nazrifUserToken) {
        con
            .query("SELECT sl FROM pos_product where org_id=? and branch=?  and price_hide!=1 and pu" +
                "blished is null;",
                [
                    orgid, branch
                ],
                function (err, group, fields) {
                    if (err) {
                        console.log(err)

                        errInsert.errIns('unpublishedProduct', err);
                    } else {
                        var i = 0;
                        for (i = 0; i < group.length; i++) {
                            pos_product_published(uid, orgid, branch, nazrifUserToken, group[i].sl);
                        }
                    }
                });
    }
    async function pos_product_published(uid, orgid, branch, nazrifUserToken, psl) {
        /*   axios.get('http://localhost:2000/node/page').then(resp => {

            console.log(resp.data);
        });*/
        con
            .query("select * from user_fb_groups where active=2 and group_id!=?  and user_id=?", [
                uid, uid
            ], function (err, group, fields) {
                if (err) {
                    console.log(err)
                } else {

                    // console.log(group)
                    var httpSQL = ''
                    var i;
                    for (i = 0; i < group.length; i++) {
                        if (globalVariable.apiRewrite == '/node') {
                            httpSQL = "SELECT  t0.sl ,'" + group[i].group_id + "' group_id,t1.token,t0.details,concat('http://api.nazrif.com/nazrif_api/userFile" +
                                "s/" + uid + "/" + nazrifUserToken + "/','7f2ed90f-58c3-4f7d-b9e7-cc0c2d921579.png') url FROM pos_product t0, user_fb_" +
                                "details t1 ,file_manage t2 where t0.org_id=t1.org_id and t1.branch=t0.branch and" +
                                " t1.active=1 and t2.pk=t0.sl and t0.price_hide!=1  and t0.published is null and " +
                                "t0.org_id=? and t0.branch=? and t0.sl=" + psl;
                        } else {
                            httpSQL = "SELECT  t0.sl ,'" + group[i].group_id + "' group_id,t1.token,t0.details,concat('http://api.nazrif.com/nazrif_api/userFile" +
                                "s/" + uid + "/" + nazrifUserToken + "/',t0.image) url FROM pos_product t0, user_fb_details t1 ,file_manage t2 where t" +
                                "0.org_id=t1.org_id and t1.branch=t0.branch and t1.active=1 and t2.pk=t0.sl and t" +
                                "0.price_hide!=1 and t0.published is null and t0.org_id=? and t0.branch=? and t0." +
                                "sl=" + psl
                        }
                        con
                            .query(httpSQL, [
                                orgid, branch
                            ], async function (err, pos_product, fields) {
                                if (err) {
                                    console.log(err)
                                    errInsert.errIns('async function pos_product_published', err);
                                } else {

                                    var j;
                                    var group_id,
                                        message,
                                        access_token;
                                    attached_media = [];

                                    for (j = 0; j < pos_product.length; j++) {

                                        group_id = pos_product[j].group_id,
                                            message = pos_product[j].details,
                                            access_token = pos_product[j].token;

                                        fbProductImagePost(group_id, pos_product[j].url, message, access_token, pos_product.length, pos_product[j].sl, orgid, branch).then(res => {})

                                    }

                                }

                            });
                    }

                }

            });
        return 1;
    }
    var interval = 2000; // 10 seconds;
    async function sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    /* async function run() {
        for (var i = 0; i <=5; i++) {
            await sleep(2000);
            console.log(i)
        }
    }

    run();*/

    async function fbProductImagePost(group_id, vUrl, details, token, imageCount, product_sl, orgid, branch) {
        await sleep(3000);
        try {
            let res = await axios.post("https://graph.facebook.com/v7.0/" + group_id + "/photos", {
                url: vUrl,
                caption: details,
                published: false,
                access_token: token

            })

            attached_media.push({
                media_fbid: res.data.id
            })
            console.log(product_sl + "|" + attached_media.length + "|" + imageCount)
            errInsert.errIns('fbProductImagePost', attached_media.length + "|" + imageCount);
            if (attached_media.length == imageCount) {
                fbProductPost(group_id, attached_media, details, token, product_sl).then(res => {
                    console.log(res.id);
                    errInsert.errIns('fbProductImagePost', res.id)
                    con.query("delete from pos_product_social_media where product_pk=? and group_id=?;update po" +
                        "s_product set published=1 where sl=?",
                        [
                            group_id, product_sl, product_sl
                        ],
                        function (err, group, fields) {
                            if (err) {
                                console.log(err)
                                errInsert.errIns('fbProductImagePost', err)

                            } else {}
                        })
                    con.query("insert into pos_product_social_media values (null,?,?,now(),?,?,?)", [
                        res.id, product_sl, orgid, branch, group_id
                    ], function (err, group, fields) {
                        if (err) {
                            console.log(err)
                            errInsert.errIns('fbProductImagePost', err)
                        } else {}
                    })

                });
                attached_media = [];
            }
            errInsert.errIns('fbProductImagePost', res.data)
            return res.data
        } catch (err) {
            console.log(err);
            errInsert.errIns('fbProductImagePost', err)
        }
    }

    async function fbProductPost(group_id, vattached_media, details, token) {
        await sleep(3000);
        try {
            let res = await axios.post("https://graph.facebook.com/v7.0/" + group_id + "/feed", {

                message: details,
                access_token: token,
                attached_media: vattached_media

            })
            errInsert.errIns('fbProductPost', res.data)
            return res.data
        } catch (err) {
            console.log(err);
            errInsert.errIns('fbProductPost', err)
        }
    }

    app
        .post(globalVariable.apiRewrite + '/ui/tabular', function (req, res, next) {

            if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
                req
                    .connection
                    .destroy();
            } else {


var query=""
                if(req.headers.queryid=="24b16fede9a67c9251d3e7c7161c83ac"||req.headers.queryid=="ffd52f3c7e12435a724a8f30fddadd9c")
                {
                    query = "update " + req.body.tbl + " set status=" + req.body.status + ", sms ='" + req.body.data + "' where sl=" + req.body.sl;
                }else
                {
                    
                    var tabular_col_name=req.body.sl.substring(0,req.body.sl.indexOf('_tabularInput_2'));
                    var tabular_sl=req.body.sl.substring(req.body.sl.indexOf('_tabularInput_2_')+"_tabularInput_2_".length)
                    query = "update " + req.body.tbl + " set "+tabular_col_name+"=" + req.body.data + " where sl=" + tabular_sl;
                }

                

                con.query(query, function (err, group, fields) {
                    if (err) {
                        console.log(err)
                        errInsert.errIns('/ui/tabular', err)
                        req
                            .connection
                            .destroy();
                    } else {
                        res.send('update')
                    }
                })

            }
        })

    app
        .get(globalVariable.apiRewrite + '/ui', function (req, res, next) {

            if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
                req
                    .connection
                    .destroy();
            } else {

            
               
                if (req.headers.queryid == "00ec53c4682d36f5c4359f4ae7bd7ba1" || req.headers.queryid == "0584ce565c824b7b7f50282d9a19945b") {
                    var attendance_search_user;

                    if (req.headers.queryid == "00ec53c4682d36f5c4359f4ae7bd7ba1") {
                        attendance_search_user = 0
                    }  else if (req.headers.queryid == "0584ce565c824b7b7f50282d9a19945b") {
                        attendance_search_user = req.headers.uid
                    }
                    con
                        .query("delete from attendance_search where sl<(select max(sl) from attendance_search where dml_by=?) and dml_by=?;select date_format(now(),'%m') a,  date_format(now(),'%Y') b,date_format(now(),'%d') c,date_format(now(),'%d') d,0 e;select  case date_format(start_date,'%m') when '00' then date_format(now(),'%m') else  date_format(start_date,'%m')end a,   case date_format(start_date,'%Y') when '00' then date_format(now(),'%Y') else date_format(start_date,'%Y') end b,case date_format(start_date,'%d') when '00' then date_format(now(),'%d') else date_format(start_date,'%d') end c,case date_format(end_date,'%d') when '00' then date_format(now(),'%d') else date_format(end_date,'%d') end d,option e from attendance_search where sl=(select max(sl) from attendance_search where dml_by=?);", [req.headers.uid, req.headers.uid, req.headers.uid],
                            function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                    errInsert.errIns('/ui get', err);
                                    req
                                        .connection
                                        .destroy();
                                } else {
                                    if (result[2].length > 0) {

                                        con
                                            .query("update menu_pages set report_query=? where query_id=?", [attendance.attendace_tabular(result[2][0].a, result[2][0].b, result[2][0].c, result[2][0].d, result[2][0].e, attendance_search_user), req.headers.queryid],
                                                function (err, result, fields) {
                                                    if (err) {
                                                        console.log(err);
                                                        errInsert.errIns('/ui get', err);
                                                        req
                                                            .connection
                                                            .destroy();
                                                    } else {
                                                        console.log('range')
                                                    }
                                                })
                                    } else {
                                        con
                                            .query("update menu_pages set report_query=? where query_id=?", [attendance.attendace_tabular(result[1][0].a, result[1][0].b, result[1][0].c, result[1][0].d, result[1][0].e), req.headers.queryid],
                                                function (err, result, fields) {
                                                    if (err) {
                                                        console.log(err);
                                                        errInsert.errIns('/ui get', err);
                                                        req
                                                            .connection
                                                            .destroy();
                                                    } else {
                                                        console.log('today')

                                                    }
                                                })
                                    }

                                }
                            })



                }
                else if (req.headers.queryid == "bbf94b34eb32268ada57a3be5062fe7d") {
                    accounts_tabular.std_fees_tabular(req.headers.orgid, req.headers.branch)



                }

               /* else if (req.headers.queryid == "a49e9411d64ff53eccfdd09ad10a15b3") {
                    accounts_tabular.employee_salary_tabular(req.headers.orgid, req.headers.branch)



                }*/

                else if (req.headers.queryid == "ddb30680a691d157187ee1cf9e896d03") {
                    accounts_tabular.member_collection_tabular(req.headers.orgid, req.headers.branch)



                }

                                                            
                con
                    .query("SELECT concat(ui_query,report_query,default_report_condition,dynamic_report_cond" +
                        "ition,group_by,order_by,update_query,select_option_query,other_query) QUERY,conditional_c" +
                        "olumn,edit_privilege, delete_privilege, report_enable, insert_enable, sl_enable,tabular_enable " +
                        "from menu_pages where QUERY_id='" + req.headers.queryid + "'",
                        function (err, result, fields) {
                            if (err) {
                                console.log(err);
                                errInsert.errIns('/ui get', err);
                                req
                                    .connection
                                    .destroy();
                            } else {

                                var temp_col_string = result[0].conditional_column;
                                temp_col_string = temp_col_string.replace(/(?:\r\n|\r|\n)/g, ' ');

                                con.query("delete from ui_report_condition where query_id=?", [req.headers.queryid], function (err, result, fields) {
                                    if (err) {
                                        console.log(err);
                                        errInsert.errIns('/ui get', err);

                                    }
                                });
                                if (temp_col_string != 'u') {
                                    var temp_col_name = ''
                                    var org_col_name = ''

                                    var i = 0
                                    var org_col_no = 0;

                                    for (i = 0; i <= temp_col_string.length; i++) {

                                        if (temp_col_string.substring(i, i + 1) != ';') {
                                            org_col_name = org_col_name + temp_col_string.substring(i, i + 1);

                                        } else {
                                            org_col_no = org_col_no + 1;
                                            //console.log(org_col_no); console.log(org_col_name);

                                            con.query('insert into ui_report_condition values (?,?,?)', [
                                                req.headers.queryid, org_col_no, org_col_name
                                            ], function (err, result, fields) {
                                                if (err) {
                                                    console.log(err);
                                                    errInsert.errIns('/ui get', err);

                                                }
                                            });
                                            org_col_name = ''

                                        }
                                    }
                                }

                                var ui_query_generate = result[0]
                                    .QUERY
                                    .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable," + result[0].tabular_enable + " tabular_enable ")

                                ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)
                                ui_query_generate = ui_query_generate.replace(/_u_/g, req.headers.uid);
                                con.query(ui_query_generate, function (err, result, fields) {
                                    if (err) {
                                        console.log(err);
                                        errInsert.errIns('/ui get', err);
                                        errInsert.errIns('/ui', err);
                                        req
                                            .connection
                                            .destroy();
                                    } else {

                                        res.send(result);
                                    }
                                });
                            }
                        });
            }

        });

    app.post(globalVariable.apiRewrite + '/ui', function (req, res, next) {
        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
            .query("delete from edu_student_information where org_id is null;delete from employee where org_id is null;delete from users where org_id is null;",  function (err, result, fields) {
                if (err) {
                    console.log(err);
                    req
                        .connection
                        .destroy()
                } else {
    
                    
    
                }
    
            });

            con
                .query("SELECT concat(ui_query,report_query,default_report_condition,dynamic_report_cond" +
                    "ition,group_by,order_by,update_query,select_option_query,other_query) QUERY ,edit_privile" +
                    "ge, delete_privilege, report_enable, insert_enable, sl_enable,tabular_enable  from menu_pages w" +
                    "here QUERY_id='" + req.headers.queryid + "'",
                    function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            errInsert.errIns('/ui post', err);
                            req
                                .connection
                                .destroy();
                        } else {
                            var ui_query_generate = result[0]
                                .QUERY
                                .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable, " + result[0].tabular_enable + " tabular_enable ");
                            ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)
                            ui_query_generate = ui_query_generate.replace(/_u_/g, req.headers.uid);
                            con.query(ui_query_generate, function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                    errInsert.errIns('/ui post', err);
                                    req
                                        .connection
                                        .destroy();
                                } else {

                                    var tbl = result[0][0].table_name
                                    con.query("desc " + tbl, function (err, result, fields) {
                                        if (err) {
                                            console.log(err);
                                            errInsert.errIns('/ui post', err);
                                            req
                                                .connection
                                                .destroy();
                                        } else {
                                            /* console.log(req.body.files)
  console.log(req.body.files[0].name)
  var ext = req.body.files[0].name.substr(req.body.files[0].name.lastIndexOf('.') + 1);
  console.log(ext)
  console.log(req.body.files[0].type)*/

                                            /*let base64String = req.body.files[0].base64;
  let base64Image = base64String.split(';base64,').pop();

  fs.writeFile(globalVariable.uploadPath+'/'+req.body.files[0].name, base64Image, {encoding: 'base64'}, function(err) {
  });*/

                                            var i = 0;
                                            var sql = "insert into " + tbl + " ( ";
                                            var value = " values ( "
                                            var params = []

                                            for (i = 1; i < result.length; i++) {

                                                if (i < result.length - 1) {
                                                    sql = sql + result[i].Field + ", "
                                                    if (result[i].Field == 'dml_time') {
                                                        value = value + "now(), "
                                                    } else {
                                                        value = value + "?, "
                                                    }

                                                    if (result[i].Field != 'image') {

                                                        if (result[i].Field == 'org_id') {
                                                            params.push(req.headers.orgid)
                                                        } else if (result[i].Field == 'branch') {
                                                            params.push(req.headers.branch)
                                                        } else if (result[i].Field == 'dml_time') {

                                                        } else {
                                                            params.push(req.body[result[i].Field])
                                                        }

                                                    } else {

                                                        var fileName = ''
                                                        try {
                                                            let base64String = req.body.files[0].base64;
                                                            let base64Image = base64String
                                                                .split(';base64,')
                                                                .pop();
                                                            var ext = req
                                                                .body
                                                                .files[0]
                                                                .name
                                                                .substr(req.body.files[0].name.lastIndexOf('.') + 1);
                                                            fileName = uuidv4() + '.' + ext

                                                            fs.writeFile(globalVariable.uploadPath + '/' + fileName, base64Image, {
                                                                encoding: 'base64'
                                                            }, function (err) {});
                                                        } catch (ex) {}

                                                        params.push(fileName)
                                                    }

                                                } else {
                                                    sql = sql + result[result.length - 1].Field + " )";

                                                    if (result[i].Field != 'image') {

                                                        if (result[i].Field == 'org_id') {
                                                            params.push(req.headers.orgid)
                                                        } else if (result[i].Field == 'branch') {
                                                            params.push(req.headers.branch)
                                                        } else if (result[i].Field == 'dml_time') {

                                                        } else {
                                                            params.push(req.body[result[result.length - 1].Field])
                                                        }

                                                    } else {

                                                        var fileName = ''
                                                        try {
                                                            let base64String = req.body.files[0].base64;
                                                            let base64Image = base64String
                                                                .split(';base64,')
                                                                .pop();
                                                            var ext = req
                                                                .body
                                                                .files[0]
                                                                .name
                                                                .substr(req.body.files[0].name.lastIndexOf('.') + 1);
                                                            fileName = uuidv4() + '.' + ext

                                                            fs.writeFile(globalVariable.uploadPath + '/' + fileName, base64Image, {
                                                                encoding: 'base64'
                                                            }, function (err) {});
                                                        } catch (ex) {}
                                                        params.push(fileName)
                                                    }

                                                    if (result[i].Field == 'dml_time') {
                                                        value = value + "now() )"
                                                    } else {
                                                        value = value + "? )"
                                                    }

                                                    sql = sql + value + ";"
                                                }

                                            }

                                            con
                                                .query(sql, params, function (err, result, fields) {
                                                    if (err) {
                                                        console.log(err);
                                                        errInsert.errIns('/ui post', err);
                                                        req
                                                            .connection
                                                            .destroy();
                                                    } else {
                                                        var multiFileIns = 0
                                                        var multiFileNameSql = ''
                                                        if (req.body.files.length > 0) {
                                                            var multiFileInsSQL = ''
                                                            if (tbl == 'pos_product') {
                                                                multiFileInsSQL = "select max(sl) sl  from pos_product where org_id=? and branch=?"
                                                            }
                                                            con
                                                                .query(multiFileInsSQL, [
                                                                    tbl, req.headers.orgid, req.headers.branch
                                                                ], function (err, result, fields) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        errInsert.errIns('/ui post', err);

                                                                    } else {
                                                                        var multiFileTblPK = result[0].sl
                                                                        for (multiFileIns = 0; multiFileIns < req.body.files.length; multiFileIns++) {

                                                                            try {
                                                                                let base64String = req.body.files[multiFileIns].base64;
                                                                                let base64Image = base64String
                                                                                    .split(';base64,')
                                                                                    .pop();
                                                                                var ext = req
                                                                                    .body
                                                                                    .files[multiFileIns]
                                                                                    .name
                                                                                    .substr(req.body.files[multiFileIns].name.lastIndexOf('.') + 1);
                                                                                fileName = uuidv4() + '.' + ext

                                                                                fs.writeFile(globalVariable.uploadPath + '/' + fileName, base64Image, {
                                                                                    encoding: 'base64'
                                                                                }, function (err) {});
                                                                            } catch (ex) {}

                                                                            multiFileNameSql = multiFileNameSql + "insert into file_manage values (null,'" + tbl + "','" + multiFileTblPK + "','" + fileName + "');"
                                                                        }
                                                                    }

                                                                    con
                                                                        .query(multiFileNameSql, function (err, result, fields) {
                                                                            if (err) {
                                                                                console.log('get');
                                                                                errInsert.errIns('/ui post', err);

                                                                            } else {}
                                                                        })
                                                                })

                                                        }
                                                        if (tbl == 'pos_product') {
                                                            get_all_keyword(req.headers.uid, tbl)
                                                            unpublishedProduct(req.headers.uid, req.headers.orgid, req.headers.branch, req.headers.token)
                                                        }
                                                        res.send(result)
                                                    }
                                                });

                                        }
                                    });
                                }
                            });
                        }
                    });

        }

    });

    app.put(globalVariable.apiRewrite + '/ui', function (req, res, next) {
        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("SELECT concat(ui_query,report_query,default_report_condition,dynamic_report_cond" +
                    "ition,group_by,order_by,update_query,select_option_query,other_query) QUERY ,edit_privile" +
                    "ge, delete_privilege, report_enable, insert_enable, sl_enable ,tabular_enable from menu_pages w" +
                    "here QUERY_id='" + req.headers.queryid + "'",
                    function (err, result, fields) {
                        if (err) {
                            req
                                .connection
                                .destroy();
                        } else {
                            var ui_query_generate = result[0]
                                .QUERY
                                .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable," + result[0].tabular_enable + " tabular_enable ");

                            ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)
                            ui_query_generate = ui_query_generate.replace(/_u_/g, req.headers.uid);
                            con.query(ui_query_generate, function (err, result, fields) {
                                if (err) {
                                    req
                                        .connection
                                        .destroy();
                                } else {

                                    var tbl = result[0][0].table_name
                                    con.query("desc " + tbl, function (err, result, fields) {
                                        if (err) {
                                            req
                                                .connection
                                                .destroy();
                                        } else {

                                            var i = 0;
                                            var sql = "update " + tbl + " set ";
                                            var value = ""
                                            var params = []

                                            for (i = 1; i < result.length; i++) {

                                                if (i < result.length - 1) {
                                                    sql = sql + result[i].Field + "=?, "

                                                    if (result[i].Field != 'image') {

                                                        if (result[i].Field == 'org_id') {
                                                            params.push(req.headers.orgid)
                                                        } else if (result[i].Field == 'branch') {
                                                            params.push(req.headers.branch)
                                                        } else {
                                                            params.push(req.body[result[i].Field])
                                                        }

                                                    } else {

                                                        var fileName = ''
                                                        try {
                                                            let base64String = req.body.files[0].base64;
                                                            let base64Image = base64String
                                                                .split(';base64,')
                                                                .pop();
                                                            var ext = req
                                                                .body
                                                                .files[0]
                                                                .name
                                                                .substr(req.body.files[0].name.lastIndexOf('.') + 1);
                                                            fileName = uuidv4() + '.' + ext

                                                            fs.writeFile(globalVariable.uploadPath + '/' + fileName, base64Image, {
                                                                encoding: 'base64'
                                                            }, function (err) {});
                                                        } catch (ex) {}

                                                        params.push(fileName)

                                                    }

                                                } else {

                                                    if (result[i].Field != 'image') {

                                                        if (result[i].Field == 'org_id') {
                                                            params.push(req.headers.orgid)
                                                        } else if (result[i].Field == 'branch') {
                                                            params.push(req.headers.branch)
                                                        } else {
                                                            params.push(req.body[result[result.length - 1].Field])
                                                        }

                                                        sql = sql + result[result.length - 1].Field + "=?";

                                                    } else {

                                                        var fileName = ''

                                                        try {

                                                            let base64String = req.body.files[0].base64;
                                                            let base64Image = base64String
                                                                .split(';base64,')
                                                                .pop();
                                                            var ext = req
                                                                .body
                                                                .files[0]
                                                                .name
                                                                .substr(req.body.files[0].name.lastIndexOf('.') + 1);
                                                            fileName = uuidv4() + '.' + ext

                                                            fs.writeFile(globalVariable.uploadPath + '/' + fileName, base64Image, {
                                                                encoding: 'base64'
                                                            }, function (err) {});

                                                            sql = sql + result[result.length - 1].Field + "=?";

                                                        } catch (ex) {
                                                            sql = sql + result[result.length - 1].Field + "=image";

                                                        }

                                                        params.push(fileName)
                                                    }

                                                    sql = sql + value + " where sl=" + req.body.uid + ";"

                                                }

                                            }
                                            con.query("select * from  " + tbl + "  where sl=?", [req.body.uid], function (err, newData, fields) {
                                                if (err) {
                                                    req
                                                        .connection
                                                        .destroy();
                                                } else {

                                                    errInsert.dmlIns(newData, params, tbl, req.headers.orgid, req.headers.branch, req.headers.uid)

                                                }
                                            })
                                            con
                                                .query(sql, params, function (err, result, fields) {
                                                    if (err) {
                                                        console.log(err);
                                                        errInsert.errIns('/ui put', err);
                                                        req
                                                            .connection
                                                            .destroy();
                                                    } else {
                                                        var multiFileIns = 0
                                                        var multiFileNameSql = ''
                                                        if (req.body.files.length > 0) {
                                                            var multiFileInsSQL = ''

                                                            con.query("select ? sl", [req.body.uid], function (err, result, fields) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    errInsert.errIns('/ui put', err);

                                                                } else {
                                                                    var multiFileTblPK = result[0].sl
                                                                    for (multiFileIns = 0; multiFileIns < req.body.files.length; multiFileIns++) {

                                                                        try {
                                                                            let base64String = req.body.files[multiFileIns].base64;
                                                                            let base64Image = base64String
                                                                                .split(';base64,')
                                                                                .pop();
                                                                            var ext = req
                                                                                .body
                                                                                .files[multiFileIns]
                                                                                .name
                                                                                .substr(req.body.files[multiFileIns].name.lastIndexOf('.') + 1);
                                                                            fileName = uuidv4() + '.' + ext

                                                                            fs.writeFile(globalVariable.uploadPath + '/' + fileName, base64Image, {
                                                                                encoding: 'base64'
                                                                            }, function (err) {});
                                                                        } catch (ex) {}

                                                                        multiFileNameSql = multiFileNameSql + "insert into file_manage values (null,'" + tbl + "','" + multiFileTblPK + "','" + fileName + "');"
                                                                    }
                                                                }
                                                                multiFileNameSql = "delete from file_manage where pk='" + multiFileTblPK + "';" + multiFileNameSql;
                                                                con.query(multiFileNameSql, function (err, result, fields) {
                                                                    if (err) {
                                                                        console.log('get');
                                                                        errInsert.errIns('/ui put', err);

                                                                    } else {}
                                                                })
                                                            })

                                                        } else {
                                                            var updateImageSQL = '';

                                                            updateImageSQL = "update " + tbl + " set image =(select name from file_manage where pk=? and table_name=? order by s" +
                                                                "l LIMIT 1) where sl=?"

                                                            con.query(updateImageSQL, [
                                                                req.body.uid, tbl, req.body.uid
                                                            ], function (err, result, fields) {
                                                                if (err) {
                                                                    console.log('get');
                                                                    errInsert.errIns('/ui put', err);

                                                                } else {}
                                                            })

                                                        }

                                                        if (tbl == 'pos_product') {
                                                            get_all_keyword(req.headers.uid, tbl)
                                                            unpublishedProduct(req.headers.uid, req.headers.orgid, req.headers.branch, req.headers.token)
                                                        }
                                                        ////
                                                        con.query("update " + tbl + " set dml_by=?, dml_time=now() where sl=?", [
                                                            req.headers.uid, req.body.uid
                                                        ], function (err, result, fields) {
                                                            if (err) {


                                                            } else {}
                                                        })
                                                        ////
                                                        res.send(result)
                                                    }
                                                });

                                        }
                                    });
                                }
                            });
                        }
                    });

        }

    });

    app.delete(globalVariable.apiRewrite + '/ui', function (req, res, next) {
        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("SELECT concat(ui_query,report_query,default_report_condition,dynamic_report_cond" +
                    "ition,group_by,order_by,update_query,select_option_query,other_query) QUERY ,edit_privile" +
                    "ge, delete_privilege, report_enable, insert_enable, sl_enable,tabular_enable  from menu_pages wh" +
                    "ere QUERY_id='" + req.headers.queryid + "'",
                    function (err, result, fields) {
                        if (err) {
                            req
                                .connection
                                .destroy();
                        } else {
                            var ui_query_generate = result[0]
                                .QUERY
                                .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable," + result[0].tabular_enable + " tabular_enable");

                            ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)
                            ui_query_generate = ui_query_generate.replace(/_u_/g, req.headers.uid);
                            con.query(ui_query_generate, function (err, result, fields) {
                                if (err) {
                                    req
                                        .connection
                                        .destroy();
                                } else {

                                    var tbl = result[0][0].table_name
                                    con.query("select * from  " + tbl + "  where sl=?", [req.body.uid], function (err, delData, fields) {
                                        if (err) {
                                            req
                                                .connection
                                                .destroy();
                                        } else {

                                            errInsert.dmlIns(delData, '', tbl, req.headers.orgid, req.headers.branch, req.headers.uid)

                                        }
                                    })
                                    con.query("delete from  " + tbl + "  where sl=?", [req.body.uid], function (err, result, fields) {
                                        if (err) {
                                            req
                                                .connection
                                                .destroy();
                                        } else {

                                            res.send(result)
                                        }
                                    });
                                }
                            });
                        }
                    });
        }

    });

    app.post(globalVariable.apiRewrite + '/pgCr', function (req, res, next) {

        var sql,
            i,
            dataType,
            sql2 = '',
            selectNO = 0,
            isnull,
            tempSelectNO = 0,
            selectList = '';
        menuPage = '\n\n',
            reportQuery = 'select t0.sl,',
            reportQueryTbl = req.body.tblPfx + req.body.tblName + ' t0 '
        default_report_condition = ' where _c_',
            dynamic_report_condition = ' ',
            order_by = ' ;',
            conditional_column = 't0.sl;'
        sql = 'create table ' + req.body.tblPfx + req.body.tblName + '\n(\nsl double NOT NULL AUTO_INCREMENT,\n'
        sql2 = "\n\n\ninsert into ui_info values (null,'" + req.body.tblPfx + req.body.tblName + "','sl','sl','number',0,0,1," + req.headers.orgid + "," + req.headers.branch + ",0,4,'-');"
        updateQuery = 'select sl,'


        for (i = 2; i <= req.body.colNo; i++) {

            if (req.body['dataType' + i] == 'i') {
                dataType = 'double'
            } else if (req.body['dataType' + i] == 'lt') {
                dataType = 'text'
            } else if (req.body['dataType' + i] == 't') {
                dataType = 'text'
            } else if (req.body['dataType' + i] == 'f') {
                dataType = 'text'
            } else if (req.body['dataType' + i] == 'd') {
                dataType = 'date'
            } else if (req.body['dataType' + i] == 'dbl') {
                dataType = 'double'
            }
            sql = sql + req.body['colName' + i] + ' ' + dataType + ',\n';

            if (req.body['inputType' + i].indexOf('_r') > 0) {
                isnull = '0'
            } else {
                isnull = '1'
            }

            if (req.body['inputType' + i] == 'select' || req.body['inputType' + i] == 'select_r') {

                selectNO = tempSelectNO + 1
                tempSelectNO = selectNO

                selectList = selectList + "select " + req.body['dtGetFrmView' + i] + " v, " + req.body['dtGetFrmValue' + i] + " r from " + req.body['dtGetFrm' + i] + " t0 where _c_;\n\n"
                reportQueryTbl = reportQueryTbl + ', ' + req.body['dtGetFrm' + i] + ' t' + selectNO;
                default_report_condition = default_report_condition + ' and t0.' + req.body['colName' + i] + '= t' + selectNO + '.' + req.body['dtGetFrmValue' + i]
                reportQuery = reportQuery + 't' + selectNO + '.' + req.body['dtGetFrmView' + i] + ','
                conditional_column = conditional_column + 't' + selectNO + '.' + req.body['dtGetFrmView' + i] + ';'
                updateQuery = updateQuery + req.body['colName' + i] + ","
            } else {
                if (selectNO != 0) {
                    tempSelectNO = selectNO;
                }
                selectNO = 0;
                if (dataType != 'date') {


                    updateQuery = updateQuery + req.body['colName' + i] + ","
                    reportQuery = reportQuery + 't0.' + req.body['colName' + i] + ','
                    conditional_column = conditional_column + 't0.' + req.body['colName' + i] + ';'
                } else {
                    updateQuery = updateQuery + "date_format(" + req.body['colName' + i] + ",''%Y-%m-%d'') " + req.body['colName' + i] + ','
                    reportQuery = reportQuery + "date_format(t0." + req.body['colName' + i] + ",''%d-%b-%y'') " + req.body['colName' + i] + ','
                    conditional_column = conditional_column + "date_format(t0." + req.body['colName' + i] + ",''%d-%b-%y'') " + ';'
                }

            }
            var ui_row_gen,
                ui_row_gen_sql = ' ';
            if (req.body['uiRow' + i] == 'n') {
                ui_row_gen = '0';
                ui_row_gen_sql = ui_row_gen_sql + "update ui_info set row=1 where view_sl=" + i + " and table_name='" + req.body.tblPfx + req.body.tblName + "';";
                ui_row_gen_sql = ui_row_gen_sql + "update ui_info set row=0 where view_sl=" + (i - 1) + " and table_name='" + req.body.tblPfx + req.body.tblName + "';";
            } else {
                ui_row_gen = '1';
            }
            sql2 = sql2 + "\ninsert into ui_info values (null,'" + req.body.tblPfx + req.body.tblName + "','" + req.body['colName' + i] + "','" + req.body['inputLabel' + i] + "','" + req
                .body['inputType' + i]
                .replace('_r', '') + "'," + selectNO + "," + isnull + "," + i + "," + req.headers.orgid + "," + req.headers.branch + "," + ui_row_gen + "," + req.body['uiColSize' + i] + ",'-');"

        }
        sql2 = sql2 + "\ninsert into ui_info values (null,'" + req.body.tblPfx + req.body.tblName + "','org_id','org_id','hidden',0,0," + i + "," + req.headers.orgid + "," + req.headers.branch + ",0,4,'-');"
        sql2 = sql2 + "\ninsert into ui_info values (null,'" + req.body.tblPfx + req.body.tblName + "','branch','branch','hidden',0,0," + (i + 1) + "," + req.headers.orgid + "," + req.headers.branch + ",0,4,'-');"
        sql2 = sql2 + "\ninsert into ui_info values (null,'" + req.body.tblPfx + req.body.tblName + "','dml_by','dml_by','hidden',0,0," + (i + 1) + "," + req.headers.orgid + "," + req.headers.branch + ",0,4,'-');"
        sql2 = sql2 + "\ninsert into ui_info values (null,'" + req.body.tblPfx + req.body.tblName + "','dml_time','dml_time','hidden',0,1," + (i + 1) + "," + req.headers.orgid + "," + req.headers.branch + ",0,4,'-');"
        sql = sql + ' org_id double, branch double,dml_by double,dml_time timestamp, ';
        sql = sql + 'PRIMARY KEY (sl)\n);'

        updateQuery = updateQuery + "org_id,branch,dml_by,dml_time from " + req.body.tblPfx + req.body.tblName + ";"
        console.log(updateQuery)

        reportQuery = reportQuery + 'from ' + reportQueryTbl + '  ';
        reportQuery = reportQuery.replace(',from ', ' from ')
        var ui_info_col = ' sl, table_name, col_name, input_label, input_type, select_sl, isnull, view_sl ,' +
            'row,col_size,business_logic, [p]' + ", ''" + req.body.subMenu + "'' title " + ", ''https://www.youtube.com/watch?v=L9xM7whjCPg'' help "

        menuPage = "insert into menu_pages values (\nnull,'" + req.body.subMenu + "','/ui','far fa-circle nav-icon','" + req.body.selectMenu + "','q','select " + ui_info_col + " from ui_info where table_name=''" + req.body.tblPfx + req.body.tblName + "'' order by view_sl;','select * from (" + reportQuery +' '+default_report_condition+ " ) t0 ','" + ' where 1' + "','" + dynamic_report_condition + "','" + order_by + "','pagination','" + conditional_column + "',' " + updateQuery + "','" + selectList + "','',1,1,1,1,1,'Full Access'," + req.headers.orgid + "," + req.headers.branch + ",0,'');\n\nupdate menu_pages set query_id=md5(sl);\n\ninsert into menu_access_control" +
            " select null,1, max(sl)," + req.headers.orgid + "," + req.headers.branch + "   ,max(sl) from menu_pages;"

        /*  con.query("drop table test; delete from ui_info where table_name='test';delete from menu_pa" +
                "ges where sl>59;delete from menu_access_control where sl>63",
        function (err, result, fields) {
            if (err) {
                console.log('err');

                fs.appendFileSync(__dirname + '/sql/log.txt', err);

            }
        });*/

        con.query(sql + sql2 + menuPage + ui_row_gen_sql, function (err, result, fields) {
            if (err) {
                {
                    console.log(err);
                    errInsert.errIns('/pgcr ', err);
                }

                fs.appendFileSync(__dirname + '/sql/log.txt', err);
                req
                    .connection
                    .destroy();
            }
        });

        res.send('success')
    })

    app.post(globalVariable.apiRewrite + '/pageMenu', function (req, res, next) {
        con
            .query('select menu,sl from menu', function (err, result, fields) {
                if (err) {
                    console.log(err)
                    errInsert.errIns('/pageMenu ', err);
                }
                res.send(result)
            });
    })

    app.post(globalVariable.apiRewrite + '/pageTbl', function (req, res, next) {
        con
            .query('select distinct table_name from ui_info', function (err, result, fields) {
                if (err) {
                    console.log(err)
                    errInsert.errIns('/pageTbl ', err);
                }
                res.send(result)
            });
    })

    app.post(globalVariable.apiRewrite + '/pageCol', function (req, res, next) {

        con
            .query('select  col_name from ui_info where table_name=?', [req.body.tbl], function (err, result, fields) {
                if (err) {
                    console.log(err)
                    errInsert.errIns('/pageCol ', err);
                }
                res.send(result)
            });
    })

    app.post(globalVariable.apiRewrite + '/colOrder', function (req, res, next) {

        con
            .query('update menu_pages set order_by=? where query_id=?', [
                req.body.q, req.body.qid
            ], function (err, result, fields) {
                if (err) {
                    console.log(err)
                    errInsert.errIns('/colOrder ', err);
                }
                res.send(result)
            });

    })

    app.post(globalVariable.apiRewrite + '/dataSearch', function (req, res, next) {

console.log(req.body)

try {
    con
        .query("update menu_pages set dynamic_report_condition=?,order_by='order by 1 ;' where query_id=?", [
            req.body.fq, req.body.qid
        ], function (err, result, fields) {
            if (err) {
                console.log(err)
                errInsert.errIns('/dataSearch ', err);
            }

            res.send('')
        });
} catch (err) {console.log(err)}


/*
        con.query("select report_query from menu_pages where query_id=?", [req.body.qid], function (err, allTables, fields) {
            if (err) {
                console.log(err)

            } else {

                var searchQuery = allTables[0].report_query


                searchQuery = searchQuery.toLowerCase()
                searchQuery = searchQuery.replace(/(\r\n|\n|\r)/gm, " ");
                searchQuery = searchQuery.replace('select ', '')

                searchQuery = searchQuery.substr(0, searchQuery.lastIndexOf(' from ')) + ","
                var conditional_columnGen = '',
                    conditional_columnGenFinal = ''
                var bracet = 0;
                //console.log(searchQuery+"\n")
                for (var sqGen = 0; sqGen <= searchQuery.length; sqGen++) {


                    if (searchQuery.substr(sqGen, 1) == ',' && bracet == 0) {

                        //console.log(conditional_columnGen)
                        if (conditional_columnGen.indexOf(' ') > 0) {

                            if (conditional_columnGen.indexOf('(') >= 0) {
                                conditional_columnGen = conditional_columnGen.substr(0, conditional_columnGen.lastIndexOf(')') + 1) + ";"
                            } else {
                                conditional_columnGen = conditional_columnGen.substr(0, conditional_columnGen.indexOf(' ')) + ";"
                            }
                            if (conditional_columnGen.indexOf(' as ') >= 0) {
                                conditional_columnGen = conditional_columnGen.substr(0, conditional_columnGen.indexOf(' as '))
                            }
                            conditional_columnGenFinal = conditional_columnGenFinal + conditional_columnGen
                            // console.log(conditional_columnGen)

                        } else {
                            if (conditional_columnGen.indexOf(' as ') >= 0) {
                                conditional_columnGen = conditional_columnGen.substr(0, conditional_columnGen.indexOf(' as '))
                            }
                            conditional_columnGen = conditional_columnGen + ";"
                            conditional_columnGenFinal = conditional_columnGenFinal + conditional_columnGen
                            //console.log(conditional_columnGen)
                        }

                        conditional_columnGen = ''
                    } else {
                        conditional_columnGen = conditional_columnGen + searchQuery.substr(sqGen, 1)
                        if (searchQuery.substr(sqGen, 1) == '(') {
                            bracet = bracet + 1
                        } else if (searchQuery.substr(sqGen, 1) == ')') {
                            bracet = bracet - 1

                        }
                        //console.log(bracet)

                    }



                }

                con.query("update menu_pages set  conditional_column =? where query_id=?", [conditional_columnGenFinal, req.body.qid], function (err, allTables, fields) {
                    if (err) {
                        console.log(err)

                    } else {
                        //  console.log(conditional_columnGenFinal)


                    }
                })

            }
        })

        if (req.body.c > 0) {
            con
                .query("select concat(' and lower(',col,') like ',lower(''?''),' ') q from ui_report_con" +
                    "dition where query_id=? and sl=?",
                    [
                        '%' + req.body.q + '%',
                        req.body.qid,
                        req.body.c
                    ],
                    function (err, result, fields) {
                        if (err) {
                            {
                                console.log(err);
                                errInsert.errIns('/dataSearch ', err);
                            }
                        }
                        try {
                            con
                                .query("update menu_pages set dynamic_report_condition=? where query_id=?", [
                                    result[0].q, req.body.qid
                                ], function (err, result, fields) {
                                    if (err) {
                                        console.log(err)
                                        errInsert.errIns('/dataSearch ', err);
                                    }

                                    res.send('')
                                });
                        } catch (err) {}

                    });
        } else if (req.body.c == 0) {
            con
                .query("select concat(' ',' lower(',col,') like ',lower(''?''),' ') q from ui_report_condition where query_id=? ",
                    [
                        '%' + req.body.q + '%',
                        req.body.qid
                    ],
                    function (err, result, fields) {
                        if (err) {
                            {
                                console.log(err);
                                errInsert.errIns('/dataSearch ', err);
                            }
                        }
                        var allCol = ' and ( '
                        try {
                            var i;
                            for (i = 0; i < result.length; i++) {

                                if (i == result.length - 1) {
                                    allCol = allCol + result[i].q + ' )';
                                } else {
                                    allCol = allCol + result[i].q + ' or';
                                }

                            }
                            //console.log(allCol)
                            try {
                                con
                                    .query("update menu_pages set dynamic_report_condition=? where query_id=?", [
                                        allCol, req.body.qid
                                    ], function (err, result, fields) {
                                        if (err) {
                                            console.log(err)
                                            errInsert.errIns('/dataSearch ', err);
                                        }

                                        res.send('')
                                    });
                            } catch (err) {}
                        } catch (err) {
                            console.log(err)
                            errInsert.errIns('/dataSearch ', err);
                        }

                    })
        }
*/
    })

    app.post(globalVariable.apiRewrite + '/next', function (req, res, next) {

        con
            .query("update menu_pages set dynamic_report_condition=' ', order_by='order by 1 desc limit " + req.body.rowShow + ",10;' " +
                "where query_id=?",
                [req.headers.queryid],
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        errInsert.errIns('/next ', err);
                    }
                    res.send('')
                });
    })

    app.post(globalVariable.apiRewrite + '/prv', function (req, res, next) {

        con
            .query("update menu_pages set dynamic_report_condition=' ', order_by='order by 1 desc limit " + req.body.rowShow + ",10;' " +
                "where query_id=?",
                [req.headers.queryid],
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        errInsert.errIns('/prv ', err);
                    }
                    res.send('')
                });
    })

    app.post(globalVariable.apiRewrite + '/tblRst', function (req, res, next) {

       var query=""
        if(req.headers.queryid=="28f0b864598a1291557bed248a998d4e")
        {
            query="update menu_pages set dynamic_report_condition=' ', order_by='order by 1 ;' " +
            "where query_id='"+req.headers.queryid+"'"
        }else
        {
            query="update menu_pages set dynamic_report_condition=' ', order_by='order by 1 desc limit 10;' " +
            "where query_id='"+req.headers.queryid+"'"
        }
       
        con
            .query(query,
               
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        errInsert.errIns('/tblRst ', err);
                    }
                    res.send('')
                });
    })


   

    /***************** End *******************/

};