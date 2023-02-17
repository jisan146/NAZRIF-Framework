var con = require('./dbConfig');
var apiSecurity = require('./apiSecurity');
var errInsert = require('./errorMonitoring');
var globalVariable = require('./globalVariable');
const fs = require('fs');
var uuidv4 = require('uuid/v4');
var md5 = require('md5');
const axios = require('axios');
const fetch = require('node-fetch');
module.exports = function (app) {

    /***************** Start *******************/

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
                        fs.unlinkSync(userFiles + group[i].name)

                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        })

    }

    systemFileManage();
    var attached_media = [];
    function unpublishedProduct(uid, orgid, branch, nazrifUserToken) {
        con
            .query("SELECT sl FROM pos_product where org_id=? and branch=?  and published is null;", [
                orgid, branch
            ], function (err, group, fields) {
                if (err) {
                    console.log(err)

                    errInsert.errIns('unpublishedProduct', err);
                } else {
                    var i = 0;
                    for (i = 0; i < group.length; i++) {
                        pos_product_published(uid, orgid, branch, nazrifUserToken,group[i].sl);
                    }
                }
            });
    }
    async function pos_product_published(uid, orgid, branch, nazrifUserToken,psl) {
        /*   axios.get('http://localhost:2000/node/page').then(resp => {

            console.log(resp.data);
        });*/
        con
            .query("select * from user_fb_groups where active=2 and user_id=?", [uid], function (err, group, fields) {
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
                                    " t1.active=1 and t2.pk=t0.sl and t0.price_hide!=1 and t0.published is null and t" +
                                    "0.org_id=? and t0.branch=? and t0.sl="+psl;
                        } else {
                            httpSQL = "SELECT  t0.sl ,'" + group[i].group_id + "' group_id,t1.token,t0.details,concat('http://api.nazrif.com/nazrif_api/userFile" +
                                    "s/" + uid + "/" + nazrifUserToken + "/',t0.image) url FROM pos_product t0, user_fb_details t1 ,file_manage t2 where t" +
                                    "0.org_id=t1.org_id and t1.branch=t0.branch and t1.active=1 and t2.pk=t0.sl and t" +
                                    "0.price_hide!=1 and t0.published is null and t0.org_id=? and t0.branch=? and t0." +
                                    "sl="+psl
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

    async function fbProductImagePost(group_id, vUrl, details, token, imageCount, product_sl, orgid, branch) {
        try {
            let res = await axios.post("https://graph.facebook.com/v7.0/" + group_id + "/photos", {
                url: vUrl,
                caption: details,
                published: false,
                access_token: token

            })

            attached_media.push({media_fbid: res.data.id})
            console.log(attached_media.length + "|" + imageCount)
            errInsert.errIns('fbProductImagePost', attached_media.length + "|" + imageCount);
            if (attached_media.length == imageCount) {
                fbProductPost(group_id, attached_media, details, token, product_sl).then(res => {
                    console.log(res.id);
                    errInsert.errIns('fbProductImagePost', res.id)
                    con.query("update pos_product set published=1 where sl=?", [product_sl], function (err, group, fields) {
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
    //  pos_product_published('1000', '0', '0');

    async function fbProductPost(group_id, vattached_media, details, token) {
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
        .get(globalVariable.apiRewrite + '/ui', function (req, res, next) {

            if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
                req
                    .connection
                    .destroy();
            } else {

                con
                    .query("SELECT concat(ui_query,report_query,default_report_condition,dynamic_report_cond" +
                            "ition,order_by,update_query,select_option_query,other_query) QUERY,conditional_c" +
                            "olumn,edit_privilege, delete_privilege, report_enable, insert_enable, sl_enable " +
                            "from menu_pages where QUERY_id='" + req.headers.queryid + "'", function (err, result, fields) {
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
                                .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable")

                            ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)

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
                .query("SELECT concat(ui_query,report_query,default_report_condition,dynamic_report_cond" +
                        "ition,order_by,update_query,select_option_query,other_query) QUERY ,edit_privile" +
                        "ge, delete_privilege, report_enable, insert_enable, sl_enable  from menu_pages w" +
                        "here QUERY_id='" + req.headers.queryid + "'", function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        errInsert.errIns('/ui post', err);
                        req
                            .connection
                            .destroy();
                    } else {
                        var ui_query_generate = result[0]
                            .QUERY
                            .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable");
                        ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)
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
                                                value = value + "?, "
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
                                                sql = sql + result[result.length - 1].Field + " )";

                                                if (result[i].Field != 'image') {

                                                    if (result[i].Field == 'org_id') {
                                                        params.push(req.headers.orgid)
                                                    } else if (result[i].Field == 'branch') {
                                                        params.push(req.headers.branch)
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

                                                value = value + "? )"
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
                        "ition,order_by,update_query,select_option_query,other_query) QUERY ,edit_privile" +
                        "ge, delete_privilege, report_enable, insert_enable, sl_enable  from menu_pages w" +
                        "here QUERY_id='" + req.headers.queryid + "'", function (err, result, fields) {
                    if (err) {
                        req
                            .connection
                            .destroy();
                    } else {
                        var ui_query_generate = result[0]
                            .QUERY
                            .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable");

                        ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)

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

    app.delete(globalVariable.apiRewrite + '/ui', function (req, res, next) {
        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("SELECT concat(ui_query,report_query,default_report_condition,dynamic_report_cond" +
                        "ition,order_by,update_query,select_option_query,other_query) QUERY ,edit_privile" +
                        "ge, delete_privilege, report_enable, insert_enable, sl_enable from menu_pages wh" +
                        "ere QUERY_id='" + req.headers.queryid + "'", function (err, result, fields) {
                    if (err) {
                        req
                            .connection
                            .destroy();
                    } else {
                        var ui_query_generate = result[0]
                            .QUERY
                            .replace('[p]', result[0].edit_privilege + " edit_privilege, " + result[0].delete_privilege + " delete_privilege , " + result[0].report_enable + " report_enable , " + result[0].insert_enable + " insert_enable , " + result[0].sl_enable + " sl_enable");

                        ui_query_generate = ui_query_generate.replace(/_c_/g, ' t0.org_id=' + req.headers.orgid + ' and t0.branch=' + req.headers.branch)

                        con.query(ui_query_generate, function (err, result, fields) {
                            if (err) {
                                req
                                    .connection
                                    .destroy();
                            } else {

                                var tbl = result[0][0].table_name
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
        sql = 'create table ' + req.body.tblPfx + req.body.tblName + '\n(\nsl int NOT NULL AUTO_INCREMENT,\n'
        sql2 = "\n\n\ninsert into ui_info values (null,'" + req.body.tblPfx + req.body.tblName + "','sl','sl','number',0,0,1," + req.headers.orgid + "," + req.headers.branch + ",0,4,'-');"
        for (i = 2; i <= req.body.colNo; i++) {

            if (req.body['dataType' + i] == 'i') {
                dataType = 'bigint'
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
            } else {
                if (selectNO != 0) {
                    tempSelectNO = selectNO;
                }
                selectNO = 0;
                reportQuery = reportQuery + 't0.' + req.body['colName' + i] + ','
                conditional_column = conditional_column + 't0.' + req.body['colName' + i] + ';'

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
        sql = sql + ' org_id int, branch int, ';
        sql = sql + 'PRIMARY KEY (sl)\n);'

        reportQuery = reportQuery + 'from ' + reportQueryTbl + '  ';
        reportQuery = reportQuery.replace(',from ', ' from ')
        var ui_info_col = ' sl, table_name, col_name, input_label, input_type, select_sl, isnull, view_sl ,' +
                'row,col_size,business_logic, [p]';
        menuPage = "insert into menu_pages values (\nnull,'" + req.body.subMenu + "','/ui','far fa-circle nav-icon','" + req.body.selectMenu + "','q','select " + ui_info_col + " from ui_info where table_name=''" + req.body.tblPfx + req.body.tblName + "'' order by view_sl;','" + reportQuery + "','" + default_report_condition + "','" + dynamic_report_condition + "','" + order_by + "','pagination','" + conditional_column + "','select * from " + req.body.tblPfx + req.body.tblName + ";','" + selectList + "','',1,1,1,1,1,'Full Access'," + req.headers.orgid + "," + req.headers.branch + ");\n\nupdate menu_pages set query_id=md5(sl);\n\ninsert into menu_access_control" +
                " select null,1, max(sl)," + req.headers.orgid + "," + req.headers.branch + " from menu_pages;"

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

        if (req.body.c > 0) {
            con
                .query("select concat(' and lower(',col,') like ',lower(''?''),' ') q from ui_report_con" +
                        "dition where query_id=? and sl=?",
                [
                    '%' + req.body.q + '%',
                    req.body.qid,
                    req.body.c
                ], function (err, result, fields) {
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
                .query("select concat(' ',' lower(',col,') like ',lower(''?''),' ') q from ui_report_con" +
                        "dition where query_id=? ",
                [
                    '%' + req.body.q + '%',
                    req.body.qid
                ], function (err, result, fields) {
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

    })

    app.post(globalVariable.apiRewrite + '/tblRst', function (req, res, next) {
        con
            .query("update menu_pages set dynamic_report_condition=' ', order_by='order by 1 desc;' " +
                    "where query_id=?",
            [req.headers.queryid], function (err, result, fields) {
                if (err) {
                    console.log(err)
                    errInsert.errIns('/tblRst ', err);
                }
                res.send('')
            });
    })

    /***************** End *******************/

};