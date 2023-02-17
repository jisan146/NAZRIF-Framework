var con = require('./dbConfig');
var notification = require('./pushNotification');
const fs = require('fs');
var md5 = require('md5');
var globalVariable = require('./globalVariable');
var apiSecurity = require('./apiSecurity');
module.exports = function (app) {

    /******* Start Login *********/

    app
        .get(globalVariable.apiRewrite + '/userContact/:name/:phone/:email/:submit/:message', function (req, res, next) {

            con
                .query("insert into user_query values(null,?,?,?,?, now(),0,0,null,null)", [
                    req.params.name, req.params.phone, req.params.email, req.params.message
                ], function (err, result, fields) {
                    if (err) {
                        res.send('failed')

                    } else {
                        res.send(' message received')

                    }

                });

        });
    app.post(globalVariable.apiRewrite + '/fb_info_feed', (req, res) => {
        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy()
        } else {
            // console.log(req.body.data)
            sql = "delete from user_fb_feed where user_id=" + req.headers.uid + ";";
            for (var i = req.body.data.length - 1; i >= 0; i--) {
                sql = sql + "insert into user_fb_feed values (null,'" + req.body.data[i].id + "','" + req.body.data[i].message + "','" + req.body.data[i].details + "','" + req.body.data[i].full_picture + "','" + req.body.data[i].picture + "','" + req.headers.orgid + "','" + req.headers.branch + "','" + req.headers.uid + "','0');\n"
            }

            sql = sql.replace(/'undefined'/g, "'-'");

            con
                .query(sql, function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {
                        res.send('')

                    }

                });

        }
    })

    app.post(globalVariable.apiRewrite + '/fb_info', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy()
        } else {
            var sql = "delete from user_fb_groups_temp where user_id='" + req.headers.uid + "';";
            sql = sql + "delete from user_fb_groups where group_id='" + req.body.userID + "';";

            sql = sql + "insert into user_fb_groups_temp values (null,'" + req.headers.uid + "','" + req.body.userID + "','-',1,'" + req.headers.orgid + "','" + req.headers.orgid + "');\n"


            var i;

            for (i = 0; i < req.body.groups.data.length; i++) {
                sql = sql + "insert into user_fb_groups_temp values (null,'" + req.headers.uid + "','" + req.body.groups.data[i].id + "','" + req
                    .body
                    .groups
                    .data[i]
                    .name
                    .replace(/'/g, '') + "',1,'" + req.headers.orgid + "','" + req.headers.orgid + "');\n"

            }
            sql = sql + "insert into user_fb_groups_temp values (null,'" + req.headers.uid + "','" + req.headers.uid + "','NAZRIF',1,'" + req.headers.orgid + "','" + req.headers.orgid + "');\n"
            sql = sql + "delete from user_fb_groups where group_id not in (select group_id from user_fb_g" +
                "roups_temp where user_id=?) and user_id='" + req.headers.uid + "';\n";
            sql = sql + "update user_fb_groups t0,user_fb_groups_temp t1 SET t0.group_name=t1.group_name " +
                "where t0.group_id=t1.group_id;\n"

            sql = sql + "insert INTO user_fb_groups SELECT null, `user_id`, `group_id`, `group_name`, `ac" +
                "tive`, `org_id`, `branch` FROM user_fb_groups_temp where group_id not in (select" +
                " group_id from user_fb_groups where  user_id='" + req.headers.uid + "');"

            con.query(sql + "update user_fb_details set active=0 where user_id=?;insert into user_fb_details " +
                "values (null,?,?,?,?,1,?,?)",
                [
                    req.headers.uid,
                    req.headers.uid,
                    req.headers.uid,
                    req.body.userID,
                    req.body.name,
                    req.body.accessToken,
                    req.headers.orgid,
                    req.headers.branch
                ], function (err, result, fields) {
                    if (err) {
                        console.log(err);

                    } else {
                        res.send('1')

                    }

                });

        }

    });

    app.post(globalVariable.apiRewrite + '/fb_info_get', (req, res) => {

        con
            .query("select token from user_fb_details where sl=(SELECT max(sl) FROM user_fb_details " +
                "where user_id=?) and active=1",
                [req.body.uid], function (err, result, fields) {
                    if (err) {
                        console.log('get');

                    } else {
                        try {

                            if (result[0].token.length > 50) {
                                res.send({ fbCon: false, token: result[0].token })
                            } else {
                                res.send({ fbCon: true })
                            }
                        } catch { }

                    }

                });

    });

    app.post(globalVariable.apiRewrite + '/profile_deshboard', (req, res) => {
        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {


            con
                .query("select  count(*) a  from pos_product_social_media t0, pos_product t1,user_fb_groups t2 ,org_details t3,user_keyword t4  where  t0.product_pk=t1.sl and t0.group_id=t2.group_id and t3.org_id=t0.org_id and t3.branch=t0.branch and t1.price_hide in(2,3) and   t1.sale_close!=1 and t4.keyword_for=t1.sl and t4.keyword_dictionary in (select keyword_dictionary from user_keyword where branch=t0.branch and org_id=t0.org_id); select  count(*) b   from pos_product_social_media t0, pos_product t1,user_fb_groups t2 ,org_details t3,user_keyword t4 where  t0.product_pk=t1.sl and t0.group_id=t2.group_id and t3.org_id=t0.org_id and t3.branch=t0.branch and t1.price_hide =4  and   t1.sale_close!=1 and t4.keyword_for=t1.sl and t4.keyword_dictionary in (select keyword_dictionary from user_keyword where branch=t0.branch and org_id=t0.org_id)",
                    [req.body.uid], function (err, result, fields) {
                        if (err) {
                            console.log(error);

                        } else {
                            res.send(result)

                        }

                    });
        }

    });

    app.post(globalVariable.apiRewrite + '/updPassword', function (req, res, next) {

        con
            .query("update users set password=sha2(?,512) where sl=? and password=sha2(?,512)", [
                req.body.newPassword, req.body.loginID, req.body.password
            ], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    req
                        .connection
                        .destroy()
                } else {
                    res.send('1')

                }

            });

    })
    app.post(globalVariable.apiRewrite + '/matchPassword', function (req, res, next) {

        con
            .query("select count(*) chk from users where sl=? and password=sha2(?,512)", [
                req.body.loginID, req.body.password
            ], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    req
                        .connection
                        .destroy()
                } else {
                    if (String(result[0].chk) == "1") {
                        res.send('1')
                    } else {
                        req
                            .connection
                            .destroy()
                    }

                }

            });

    })
    app.post(globalVariable.apiRewrite + '/chkNewUser', function (req, res, next) {
        var msg;
        con.query("select count(*) phone from users where phone=?", [req.body.loginID], function (err, result, fields) {
            if (String(result[0].phone) == '1') {
                msg = 'Phone number Already used';
                res.send(msg);

            } else {

                con
                    .query("select count(*) email from users where phone=?", [req.body.loginID], function (err, result, fields) {

                        if (String(result[0].email) == '1') {
                            msg = 'Email Already used';

                            res.send(msg);
                        } else if (String(result[0].email) == '0') {

                            if (req.body.service == '') {
                                msg = 'Please Select Service'

                                res.send(msg);
                            } else {

                                if (req.body.password != req.body.confirmPassword) {
                                    msg = 'Confirm Password not Match'

                                    res.send(msg);
                                } else {
                                    res.send('1');
                                }
                            }

                        }

                    });
            }

        });

    });


    app.post(globalVariable.apiRewrite + '/getLoginID', function (req, res, next) {

        if (req.body.name != '') {
            if (req.body.chkNewUser == '1') {
                con
                    .query('insert into users (sl,password,phone,active,access,email,org_id,branch,image) values (null,sha2(?,512),?,1,?,?,0,0,?);insert into employee (sl,name,designation,salary,org_id,branch,id_setup,gender,blood_group,dml_by,image,phone_sms) select sl,?,4,1,null,null,1,22,9,0,image,phone from users where sl not in (select sl from employee);insert into org_details(sl)values(null);insert into branch(sl)values(null);update users set org_id=(select max(sl) from org_details),branch=(select max(sl) from branch) where phone=?;update org_details set org_id=(select max(sl) from org_details),branch=(select max(sl) from branch) where org_id is null;update branch set org_id=(select max(sl) from org_details),branch=(select max(sl) from branch) where org_id is null;update users t0,employee t1 set t1.org_id=t0.org_id, t1.branch=t0.branch where t0.sl=t1.sl and t0.phone=?;',
                        [
                            req.body.password,
                            req.body.loginID,
                            req.body.service,
                            req.body.loginID,
                            '7f2ed90f-58c3-4f7d-b9e7-cc0c2d921579.png',
                            req.body.name,
                            req.body.loginID,
                            req.body.loginID
                        ], function (err, result, fields) {
                            if (err) {
                                console.log(err);

                                fs.appendFileSync(__dirname + '/sql/log.txt', err);
                                req
                                    .connection
                                    .destroy();
                            }
                        });

                con
                    .query("update users t0, employee t1 set t0.sl=concat(date_format(now(),'%y'),t0.org_id,t0.branch,1,lpad(1,4,0)),t1.sl=concat(date_format(now(),'%y'),t0.org_id,t0.branch,1,lpad(1,4,0)) where  t0.sl=t1.sl and  t0.phone=?;insert into unique_key_gen(employee,student,receipt,org_id,branch,other_member) select 1,0,0,org_id,branch,0 from users where phone=?;", [
                        req.body.loginID, req.body.loginID
                    ], function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            req
                                .connection
                                .destroy()
                        } else {



                        }

                    });
            }
        }




        con
            .query(" SELECT sl FROM users WHERE sl=? or email=? or phone=?", [
                req.body.loginID, req.body.loginID, req.body.loginID
            ], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    req
                        .connection
                        .destroy()
                } else {

                    res.send(result)

                }

            });

    })
    app.post(globalVariable.apiRewrite + '/login', function (req, res, next) {


        con
            .query("insert into user_chat_status select null,sl,2,org_id,branch,sl,now() from users where sl not in (select user_id from user_chat_status);",  function (err, result, fields) {
                if (err) {
                    console.log(err);
                    req
                        .connection
                        .destroy()
                } else {



                }

            });


        //  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var a = req.connection.remoteAddress
        var b = req.headers['x-forwarded-for']
        var ip = "R: " + a + " F: " + b
        // console.log(ip) console.log(req.headers['user-agent']);

        con.query("select count(*) chk,md5(concat(sl,password)) token ,org_id,branch,ifnull((select link from user_first_page_link where user_id=?),'/Profile')landingPage from users whe" +
            "re sl=? and password=sha2(?,512) and active=1",
            [
                req.body.uid, req.body.uid, req.body.password
            ], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    req
                        .connection
                        .destroy()
                } else {

                    if (String(result[0].chk) == "1") {
                        notification.pushNotification(0, req.body.uid, 'Login Success !!! From ' + ip + ' Details:' + req.headers['user-agent'], 1, ip)


                        fs.writeFileSync(__dirname + '/token/' + md5(String(req.body.uid)), result[0].token);
                        con
                            .query("update user_chat_status set chat_status=1 where user_id=?;", [
                                req.body.uid
                            ], function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                    req
                                        .connection
                                        .destroy()
                                } else {




                                }

                            });

                        res.send(result);
                    } else {
                        notification.pushNotification(0, req.body.uid, 'Login Failed !!! From ' + ip + ' Details:' + req.headers['user-agent'], 1, ip)
                        req
                            .connection
                            .destroy()
                    }

                }

            });

    });
    /******* End Login *********/

    /******* Start Profile *********/
    app.post(globalVariable.apiRewrite + '/profile', function (req, res, next) {




        con
            .query("select count(*) c from user_fb_groups where group_id=?", [req.body.uid], function (err, result, fields) {
                if (err) { } else {

                    if (result[0].c == 0) {
                        con
                            .query("insert into user_fb_groups values (null,'" + req.body.uid + "','" + req.body.uid + "','NAZRIF',1,'" + req.headers.orgid + "','" + req.headers.orgid + "');\n", function (err, result, fields) {
                                if (err) {
                                    console.log(err)
                                } else {

                                }
                            });
                    }
                }
            });

        con
            .query("select  case (select COUNT(*)  from employee where sl=?) when 0 then (select case (select COUNT(*)  from edu_student_information where sl=?) when 0 then 3 else 2 end) else 1 end chk;",
                [req.body.uid,req.body.uid], function (err, chk, fields) {
                    if (err) { } else {
                        console.log(chk)
                        var user_profile_query = " "
                        if (chk[0].chk == 1) {
                            user_profile_query = "select name,d.designation designation,e.image from users u,designation d,employee e where e.sl=u.sl and d.sl=e.designation and u.sl=?"
                        } else  if (chk[0].chk == 2){
                            user_profile_query = "select name,'Student' designation,s.image from edu_student_information s, edu_class c, users u where s.class=c.sl and u.sl=s.sl and u.sl=?"
                        }
                        else  if (chk[0].chk == 3){
                            user_profile_query = "select name_en name, concat('Membership : ',t1.other_member_category) designation,t0.image from other_member t0, other_member_category t1 ,users t2 where t0.sl=t2.sl and t0.category=t1.sl and t2.sl=?"
                        }

                        con
                            .query(user_profile_query,
                                [req.body.uid], function (err, result, fields) {
                                    if (err) { } else {
                                        res.send(result);
                                    }
                                });
                    }
                });



    });

    /******* End Profile *********/

    /******* Start Page *********/

    app.post(globalVariable.apiRewrite + '/page', function (req, res, next) {

        con
            .query("insert into menu_pages values(null,?,?,?,?,null,null)", [
                req.body.page, req.body.link, req.body.icon, req.body.menu
            ], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send('ok')
                }
            });

    });

    app.get(globalVariable.apiRewrite + '/page', function (req, res, next) {

        con
            .query("select * from menu_pages ", function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send(result)
                }
            });

    });

    app.put(globalVariable.apiRewrite + '/page', function (req, res, next) {

        con
            .query("update menu_pages set page=?,link=?,icon=?,menu=? where sl=?", [
                req.body.page, req.body.link, req.body.icon, req.body.menu, req.body.uid
            ], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send(result)
                }
            });

    });

    app.post(globalVariable.apiRewrite + '/pageDelete', function (req, res, next) {

        con
            .query("delete from menu_pages where sl=?", [req.body.uid], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send(result)
                }
            });

    });
    /******* End Page *********/

    /******* Start Menu *********/
    app.post(globalVariable.apiRewrite + '/menu', function (req, res, next) {

        con
            .query("SELECT m.sl msl,p.sl psl,m.menu menu,m.left_icon  left_icon,m.right_icon right_i" +
                "con,p.page page,p.link link,p.icon icon,p.query_id query_id FROM menu m, menu_pa" +
                "ges p ,menu_access_control a, users u where m.sl=p.menu and a.page=p.sl and u.ac" +
                "cess=a.group_id and u.sl=? order by m.viewsl,a.view_sl",
                [req.body.uid], function (err, result, fields) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send(result);
                    }
                });

    });

    app.post(globalVariable.apiRewrite + '/menu_access_group', function (req, res, next) {

        con
            .query("insert into menu_access_group values(null,?)", [req.body.group_name], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send('ok')
                }
            });

    });

    app.get(globalVariable.apiRewrite + '/menu_access_group', function (req, res, next) {

        con
            .query("select * from menu_access_group ", function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send(result)
                }
            });

    });

    app.post(globalVariable.apiRewrite + '/menu_access_group_delete', function (req, res, next) {

        con
            .query("delete from menu_access_group where sl=?", [req.body.uid], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send(result)
                }
            });

    });

    app.post(globalVariable.apiRewrite + '/menu_access_group_edit', function (req, res, next) {

        con
            .query("update menu_access_group set group_name=? where sl=?", [
                req.body.group_name, req.body.uid
            ], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send(result)
                }
            });

    });

    app.post(globalVariable.apiRewrite + '/menuReg', function (req, res, next) {

        con
            .query("insert into menu values(null,?,?,?,?)", [
                req.body.menu, req.body.left_icon, req.body.right_icon, req.body.viewsl
            ], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    //req.connection.destroy();
                    res.send('ok')
                }
            });

    });

    app.post(globalVariable.apiRewrite + '/menuUpdate', function (req, res, next) {

        con
            .query("update menu set menu=?,left_icon=?,right_icon=?,viewsl=? where sl=?", [
                req.body.menu, req.body.left_icon, req.body.right_icon, req.body.viewsl, req.body.uid
            ], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    //req.connection.destroy();
                    res.send('ok')
                }
            });

    });

    app.get(globalVariable.apiRewrite + '/menuView', function (req, res, next) {

        con
            .query("select * from menu", function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {

                    res.send(result)
                }
            });

    });

    app.post(globalVariable.apiRewrite + '/menuDelete', function (req, res, next) {

        con
            .query("delete from menu where sl=?", [req.body.uid], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {

                    res.send(result)
                }
            });

    });
    /******* End Menu *********/

};