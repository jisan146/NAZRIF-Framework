var con = require('../dbConfig');
var apiSecurity = require('../apiSecurity');
var globalVariable = require('../globalVariable');
const vm = require('vm');
module.exports = function (app) {

    /***************** Start *******************/
/*
var inputName;
var inputValue;
var clientSideInput="{";
var i;
for(i=0;i<req.body.length;i++)
{
    inputName=Object.keys(req.body[i]);
    inputValue=req.body[i][inputName[0]];
    clientSideInput=clientSideInput+'"'+inputName[0]+'":"'+inputValue+'",'
 

    
}
clientSideInput=clientSideInput+'"a":"a"}'
clientSideInput=JSON.stringify(clientSideInput);
clientSideInput=JSON.parse(clientSideInput)
console.log(clientSideInput[0].query_id)
console.log(req.headers.queryid)
*/

function bodyDataFind(bodyData,query)
{
    var i=0;

    for(i=0;i<bodyData.length;i++)
    {
       a=Object.keys(bodyData[i])
        if(a[0]==query)
        {
          // console.log(req.body[i].description) 
          return bodyData[i][query];
        }
    }
}
app.post(globalVariable.apiRewrite + '/7449', (req, res) => {

    if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
        req
            .connection
            .destroy();
    } else {

       
        if (req.headers.queryid == '2421fcb1263b9530df88f7f002e78ea5') {
            var member_id = bodyDataFind(req.body, 'member_id')
            var sector = bodyDataFind(req.body, 'sector')
            var tbleName = 'member_non_package'
            var dynamicSql="select * from "+tbleName+" where member_id='"+member_id+"' and sector='"+sector+"';"
        }
        //
        else if (req.headers.queryid == 'e7b24b112a44fdd9ee93bdf998c6ca0e') {
            var student_id = bodyDataFind(req.body, 'student_id')
            var fees = bodyDataFind(req.body, 'fees')
            var tbleName = 'edu_waiver_list'
            var dynamicSql="select * from "+tbleName+" where student_id='"+student_id+"' and fees='"+fees+"';"
        }
        else if (req.headers.queryid == 'bac9162b47c56fc8a4d2a519803d51b3') {
            var employee_id = bodyDataFind(req.body, 'employee_id')
            var base_salary = bodyDataFind(req.body, 'base_salary')
            var tbleName = 'employee_non_scale_salary'
            var dynamicSql="select * from "+tbleName+" where employee_id='"+employee_id+"' and base_salary='"+base_salary+"';"
        }
        else if (req.headers.queryid == 'd96409bf894217686ba124d7356686c9') {
            var Class = bodyDataFind(req.body, 'class')
            var description = bodyDataFind(req.body, 'description')
            var tbleName = 'edu_class_pay'
            var dynamicSql="select * from "+tbleName+" where class='"+Class+"' and description='"+description+"';"
        }
        else if (req.headers.queryid == 'c3e878e27f52e2a57ace4d9a76fd9acf') {
            var designation = bodyDataFind(req.body, 'designation')
            var description = bodyDataFind(req.body, 'description')
            var tbleName = 'employee_payment_scale'
            var dynamicSql="select * from "+tbleName+" where designation='"+designation+"' and description='"+description+"';"
        }
        else if (req.headers.queryid == '6ecbdd6ec859d284dc13885a37ce8d81') {
            var membership = bodyDataFind(req.body, 'membership')
            var description = bodyDataFind(req.body, 'description')
            var tbleName = 'membership_wise_payment'
            var dynamicSql="select * from "+tbleName+" where membership='"+membership+"' and description='"+description+"';"
        }


        
       
        con
            .query(dynamicSql,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        res.send([
                            {
                                type: '',
                                name: '1',
                                value: ''
                            },  {
                                type: 'state',
                                name: 'submitBtnEnable',
                                value: false
                            }, {
                                type: 'state',
                                name: 'SubmitMSG',
                                value: ''
                            }


                        ]);

                    } else {
                        if(result.length>0)
                        {
                            
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                },  {
                                    type: 'state',
                                    name: 'submitBtnEnable',
                                    value: true
                                }, {
                                    type: 'state',
                                    name: 'SubmitMSG',
                                    value: 'Already Entry'
                                }


                            ]);
                        }
                        else
                        {
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                },  {
                                    type: 'state',
                                    name: 'submitBtnEnable',
                                    value: false
                                }, {
                                    type: 'state',
                                    name: 'SubmitMSG',
                                    value: ''
                                }


                            ]);
                        }

                      

                    }
                });

    }
});
app.post(globalVariable.apiRewrite + '/30', (req, res) => {

    if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
        req
            .connection
            .destroy();
    } else {
        var page=bodyDataFind(req.body,'page')
        var group_id=bodyDataFind(req.body,'group_id')

        if(req.headers.uid=='1000')
        {
            var dynamicSql="select sl, page v,ROW_NUMBER() OVER (ORDER BY m.sl) r from menu_pages m where menu=(select menu from menu_pages where sl="+page+")  and sl in (select page from menu_access_control where group_id="+group_id+")"
        }else
        {
            var dynamicSql="select sl, page v,ROW_NUMBER() OVER (ORDER BY m.sl) r from menu_pages m where menu=(select menu from menu_pages where sl="+page+")  and sl in (select page from menu_access_control where group_id="+group_id+")"
        }
       
        con
            .query(dynamicSql,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        res.send([
                            {
                                type: '',
                                name: '1',
                                value: ''
                            }, {
                                type: 'select',
                                name: 'view_sl',
                                value: [{ v: 'First Position', r: 0 }]
                            }
                        ]);

                    } else {
                        if(result.length>0)
                        {
                            
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'select',
                                    name: 'view_sl',
                                    value: result
                                }
                            ]);
                        }
                        else
                        {
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'select',
                                    name: 'view_sl',
                                    value: [{ v: 'First Position', r: 0 }]
                                }
                            ]);
                        }

                      

                    }
                });

    }
});
app.post(globalVariable.apiRewrite + '/29', (req, res) => {

    if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
        req
            .connection
            .destroy();
    } else {
        var group_id=bodyDataFind(req.body,'group_id')

        if(req.headers.uid=='1000')
        {
            var dynamicSql="SELECT Page v, sl r FROM menu_pages where sl not in(select page from menu_access_control where group_id= "+group_id+") order by sl;"
        }else
        {
            var dynamicSql="SELECT t2.page v, t1.page r FROM users t0, menu_access_control t1,menu_pages t2 where t0.access=t1.group_id and t2.sl=t1.page and t0.sl="+req.headers.uid+" and  t1.page not in (select page from menu_access_control where group_id= "+group_id+") order by t1.page"
        }
       
        con
            .query(dynamicSql,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {
                        if(result.length>0)
                        {
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'search',
                                    name: 'page',
                                    value: result
                                }
                            ]);
                        }
                        else
                        {
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }
                            ]);
                        }

                      

                    }
                });

    }
});
app.post(globalVariable.apiRewrite + '/7411', (req, res) => {

    if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
        req
            .connection
            .destroy();
    } else {
        var student_id=bodyDataFind(req.body,'student_id')
        var amount=bodyDataFind(req.body,'amount')
        con
            .query("select t0.description v,t0.sl r from membership_wise_transactions t0, membership_wise_payment t1, other_member t2 where t0.sl=t1.description and t1.membership=t2.category and t2.sl=? order by t0.sl;", [student_id],
                function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {

                        con
                            .query("select  concat('Name: ',t0.name_en,' Membership: ',t1.other_member_category) info ,(select nvl(sum(amount),0) from member_transection_collection where (payment_status is null or payment_status=0) and dml_by=?) totalTK from other_member t0, other_member_category t1 where t0.category=t1.sl and t0.sl=?", [req.headers.uid, student_id],
                                function (err, info, fields) {
                                    if (err) {
                                        console.log(err)

                                    } else {
                                        var stdInfo = '', total = '0';
                                        if (info.length > 0) {
                                            stdInfo = info[0].info
                                            total = info[0].totalTK
                                        }
                                        res.send([
                                            {
                                                type: '',
                                                name: '1',
                                                value: ''
                                            }, {
                                                type: 'select',
                                                name: 'fees_type',
                                                value: result
                                            }, {
                                                type: 'input',
                                                name: 'student_info',
                                                value: stdInfo
                                            }
                                            , {
                                                type: 'input',
                                                name: 'total',
                                                value: (total + amount)
                                            }
                                        ]);

                                    }
                                })

                    }
                });

    }
});

app.post(globalVariable.apiRewrite + '/7410', (req, res) => {

    if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
        req
            .connection
            .destroy();
    } else {
        var student_id=bodyDataFind(req.body,'student_id')
        var fees_type=bodyDataFind(req.body,'fees_type')
        con
            .query("select description v, sl r  from edu_revenue_type where membership_sector=? and sl not in (select description from member_transection_collection where student_id=? and due=0 ) and date_format(dml_time,'%Y')>=(select date_format(dml_time,'%Y') from other_member where sl=?)", [fees_type, student_id, student_id],
                function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {

                        res.send([
                            {
                                type: '',
                                name: '1',
                                value: ''
                            }, {
                                type: 'select',
                                name: 'description',
                                value: result
                            }


                        ]);



                    }
                })



    }
});

    app.post(globalVariable.apiRewrite + '/businessLogic', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
           
            con
            .query("select * from business_logic",
                function (err, logic, fields) {
                    if (err) {
                        console.log(err)

                    } else {

                        var fs = require('fs');
                        data=res;
                        ClientReq=req;
                        const script = new vm.Script(fs.readFileSync(__dirname + '/dynamic/test.js', 'utf8'));

                        script.runInThisContext()(require);

                      //  vm.runInThisContext(code)(require);




                    }})


                   
            


        }
    });
    app.post(globalVariable.apiRewrite + '/visitors_phone', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select * from visitors where phone=? and org_id=? and branch=?", [req.body[0].phone,req.headers.orgid,req.headers.branch],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                            if (result.length > 0) {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    },  {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: true
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: 'Phone Number Already Entry'
                                    }


                                ]);
                            }
                            else {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    },  {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: false
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: ''
                                    }


                                ]);
                            }
                        }
                    })



        }
    });
    app.post(globalVariable.apiRewrite + '/sms_email', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            console.log(req.body[2].email)
            con
                .query("select phone,sl from users where email=?", [req.body[2].email],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                            if (result.length > 0) {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'phone',
                                        value: result[0].phone
                                    }
                                    , {
                                        type: 'input',
                                        name: 'user_id',
                                        value: result[0].sl
                                    }


                                ]);
                            } else {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'phone',
                                        value: ""
                                    }


                                ]);
                            }



                        }
                    })



        }
    });

    app.post(globalVariable.apiRewrite + '/sms_user_id', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select case (select count(*) from employee where sl=?) when 1 then (select phone_sms from employee where sl=?) else (select case isnull(phone_sms) when 1 then '' else phone_sms end from edu_student_information where sl=?)end phone,(select email from users where sl=?) email;", [req.body[0].user_id, req.body[0].user_id, req.body[0].user_id, req.body[0].user_id],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            console.log(result[0].phone)
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'input',
                                    name: 'phone',
                                    value: result[0].phone
                                }
                                , {
                                    type: 'input',
                                    name: 'email',
                                    value: result[0].email
                                }


                            ]);



                        }
                    })



        }
    });

    app.post(globalVariable.apiRewrite + '/edu_student_information_class', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select section v, sl r from edu_section where class=?", [req.body[4].class],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'select',
                                    name: 'section',
                                    value: result
                                }


                            ]);



                        }
                    })



        }
    });

    app.post(globalVariable.apiRewrite + '/users_phone', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select sl from users where email=? or phone=?", [req.body[2].email, req.body[3].phone],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            if (result.length > 1) {
                                submitBtnEnable = true
                                SubmitMSG = 'Email or Phone already used.'
                            }
                            else if (result.length == 1 && result[0].sl != req.headers.uid) {
                                submitBtnEnable = true
                                SubmitMSG = 'Email or Phone already used.'
                            }
                            else if (result.length == 1 && result[0].sl == req.headers.uid) {
                                submitBtnEnable = false
                                SubmitMSG = ''
                            }
                            else if (result.length == 0) {
                                submitBtnEnable = false
                                SubmitMSG = ''
                            }
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'state',
                                    name: 'submitBtnEnable',
                                    value: submitBtnEnable
                                }, {
                                    type: 'state',
                                    name: 'SubmitMSG',
                                    value: SubmitMSG
                                }


                            ]);


                        }
                    })



        }
    });
    app.post(globalVariable.apiRewrite + '/users_email', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select sl from users where email=? or phone=?", [req.body[2].email, req.body[3].phone],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            if (result.length > 1) {
                                submitBtnEnable = true
                                SubmitMSG = 'Email or Phone already used.'
                            }
                            else if (result.length == 1 && result[0].sl != req.headers.uid) {
                                submitBtnEnable = true
                                SubmitMSG = 'Email or Phone already used.'
                            }
                            else if (result.length == 1 && result[0].sl == req.headers.uid) {
                                submitBtnEnable = false
                                SubmitMSG = ''
                            }
                            else if (result.length == 0) {
                                submitBtnEnable = false
                                SubmitMSG = ''
                            }
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'state',
                                    name: 'submitBtnEnable',
                                    value: submitBtnEnable
                                }, {
                                    type: 'state',
                                    name: 'SubmitMSG',
                                    value: SubmitMSG
                                }


                            ]);


                        }
                    })



        }
    });

    app.post(globalVariable.apiRewrite + '/employee_fees_collection_paid', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select *from employee_fees_collection where (payment_status is null or payment_status=0) and dml_by=? and amount<=?", [req.headers.uid, ((req.body[5].total) - req.body[6].paid).toFixed(2)],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                            if (result.length > 0) {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'due',
                                        value: ((req.body[5].total) - req.body[6].paid).toFixed(2)
                                    }, {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: true
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: 'Please remove one or more fees.'
                                    }


                                ]);
                            }
                            else {
                                var chkDue = 0, submitBtnEnable, SubmitMSG
                                chkDue = (parseFloat(req.body[5].total) - parseFloat(req.body[6].paid)).toFixed(2)
                                if (chkDue < 0) {
                                    submitBtnEnable = true
                                    SubmitMSG = 'Please check paid amount'
                                }
                                else {
                                    submitBtnEnable = false
                                    SubmitMSG = ''
                                }
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'due',
                                        value: ((req.body[5].total) - req.body[6].paid).toFixed(2)
                                    }, {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: submitBtnEnable
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: SubmitMSG
                                    }


                                ]);
                            }
                        }
                    })



        }
    });

    app.post(globalVariable.apiRewrite + '/employee_fees_collection_amount', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            //SELECT nvl(sum(amount-due),0) from edu_student_fees_collection where student_id=200020004 and description=562
            con
                .query("select case when (select count(*) from employee_non_scale_salary where employee_id=? and base_salary=?)>0 then (select salary from employee_non_scale_salary where employee_id=? and base_salary=?) else (select pay from employee_payment_scale t0, employee t1 where t0.designation=t1.designation and t1.sl=? and t0.description=?) end-(SELECT nvl(sum(amount-due),0) from employee_fees_collection where employee_id=? and description=?) pay,(select nvl(sum(amount),0) from employee_fees_collection where (payment_status is null or payment_status=0) and dml_by=?) totalTK", [req.body[0].employee_id, req.body[2].fees_type, req.body[0].employee_id, req.body[2].fees_type, req.body[0].employee_id, req.body[2].fees_type, req.body[0].employee_id, req.body[3].description, req.headers.uid],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                            //console.log(req.body)
                            var stdPay = 0, total = 0;
                            if (result.length > 0) {
                                stdPay = result[0].pay
                                total = result[0].totalTK
                            }
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'input',
                                    name: 'amount',
                                    value: stdPay
                                }, {
                                    type: 'input',
                                    name: 'total',
                                    value: (parseFloat(total) + parseFloat(stdPay))
                                }
                            ]);
                        }
                    });

        }
    });
    app.post(globalVariable.apiRewrite + '/employee_fees_collection_fee_type', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select description v, sl r from edu_revenue_type where base_salary=? and sl not in (select description from employee_fees_collection where employee_id=? and due=0 ) and date_format(dml_time,'%Y')>=(select date_format(join_date,'%Y') from employee where sl=?)", [req.body[2].fees_type, req.body[0].employee_id, req.body[0].employee_id],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'select',
                                    name: 'description',
                                    value: result
                                }


                            ]);



                        }
                    })



        }
    });

    app.post(globalVariable.apiRewrite + '/employee_fees_collection_employee_id', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("SELECT t2.description v,t2.sl r FROM employee_payment_scale t0, employee t1,employee_base_salary t2 WHERE t1.designation =t0.designation and t2.sl=t0.description and t1.sl=? order by t0.sl", [req.body[0].employee_id],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            con
                                .query("SELECT concat('Name: ',t0.name,' Designation: ',t1.designation) info,(select nvl(sum(amount),0) from employee_fees_collection where (payment_status is null or payment_status=0) and dml_by=?) totalTK FROM employee t0,designation t1 WHERE t0.designation=t1.sl and t0.sl=?", [req.headers.uid, req.body[0].employee_id],
                                    function (err, info, fields) {
                                        if (err) {
                                            console.log(err)

                                        } else {
                                            var stdInfo = '', total = '0';
                                            if (info.length > 0) {
                                                stdInfo = info[0].info
                                                total = info[0].totalTK
                                            }
                                            res.send([
                                                {
                                                    type: '',
                                                    name: '1',
                                                    value: ''
                                                }, {
                                                    type: 'select',
                                                    name: 'fees_type',
                                                    value: result
                                                }, {
                                                    type: 'input',
                                                    name: 'employee_info',
                                                    value: stdInfo
                                                }
                                                , {
                                                    type: 'input',
                                                    name: 'total',
                                                    value: (total + req.body[4].amount)
                                                }
                                            ]);

                                        }
                                    })

                        }
                    });

        }
    });

    app.post(globalVariable.apiRewrite + '/edu_student_fees_collection_given_money', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            var return_money = 0
            return_money = parseFloat(req.body[5].total) - parseFloat(req.body[10].given_money)
            if (return_money < 0) {
                return_money = 0

            } else {
                return_money = parseFloat(req.body[5].total) - parseFloat(req.body[10].given_money)
            }
            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'return_money',
                    value: return_money
                }


            ]);



        }
    });

    app.post(globalVariable.apiRewrite + '/edu_student_fees_collection_fees_type', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select description v, sl r from edu_revenue_type where base_fees=? and sl not in (select description from edu_student_fees_collection where student_id=? and due=0 ) and date_format(dml_time,'%Y')>=(select date_format(admission_date,'%Y') from edu_student_information where sl=?)", [req.body[2].fees_type, req.body[0].student_id, req.body[0].student_id],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'select',
                                    name: 'description',
                                    value: result
                                }


                            ]);



                        }
                    })



        }
    });


    app.post(globalVariable.apiRewrite + '/account_entry_cetagory', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            //select description v, sl r from other_account_sector t0
            

            con
                .query("select description v, sl r from edu_revenue_type where other_base=?;select ifnull(sum(amount),0)total_tk  from account_entry  where receipt_no=0 and dml_by=?", [req.body[2].fees_type,req.headers.uid],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'select',
                                    name: 'description',
                                    value: result[0]
                                },
                                {
                                    type: 'input',
                                    name: 'total',
                                    value: result[1][0].total_tk
                                },
                            ]);

                        }})

            
        }
    })

    app.post(globalVariable.apiRewrite + '/account_entry_amount', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            console.log(req.body[4].amount)
            

            con
                .query("select 1;select ifnull(sum(amount),0)+CAST(? AS double) total_tk  from account_entry  where receipt_no=0 and dml_by=?", [req.body[4].amount,req.headers.uid],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                },
                                {
                                    type: 'input',
                                    name: 'total',
                                    value: result[1][0].total_tk
                                },
                            ]);

                        }})

            
        }
    })
    app.post(globalVariable.apiRewrite + '/7409', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            var total=bodyDataFind(req.body,'total')
            var given_money=bodyDataFind(req.body,'given_money')
            var return_money = 0
            return_money = parseFloat(total) - parseFloat(given_money)
            if (return_money < 0) {
                return_money = 0

            } else {
                return_money = parseFloat(total) - parseFloat(given_money)
            }
            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'return_money',
                    value: return_money
                }


            ]);



        }
    });
    app.post(globalVariable.apiRewrite + '/7415', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
          
            var total=bodyDataFind(req.body,'total')
            var paid=bodyDataFind(req.body,'paid')
            con
                .query("select *from member_transection_collection where (payment_status is null or payment_status=0) and dml_by=? and amount<=?", [req.headers.uid, ((total) - paid).toFixed(2)],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                            if (result.length > 0) {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'due',
                                        value: ((total) - paid).toFixed(2)
                                    }, {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: true
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: 'Please remove one or more fees.'
                                    }


                                ]);
                            }
                            else {
                                var chkDue = 0, submitBtnEnable, SubmitMSG
                                chkDue = (parseFloat(req.body[5].total) - parseFloat(paid)).toFixed(2)
                                if (chkDue < 0) {
                                    submitBtnEnable = true
                                    SubmitMSG = 'Please check paid amount'
                                }
                                else {
                                    submitBtnEnable = false
                                    SubmitMSG = ''
                                }
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'due',
                                        value: ((total) - paid).toFixed(2)
                                    }, {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: submitBtnEnable
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: SubmitMSG
                                    }


                                ]);
                            }
                        }
                    })



        }
    });

    app.post(globalVariable.apiRewrite + '/edu_student_fees_collection_paid', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("select *from edu_student_fees_collection where (payment_status is null or payment_status=0) and dml_by=? and amount<=?", [req.headers.uid, ((req.body[5].total) - req.body[6].paid).toFixed(2)],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                            if (result.length > 0) {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'due',
                                        value: ((req.body[5].total) - req.body[6].paid).toFixed(2)
                                    }, {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: true
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: 'Please remove one or more fees.'
                                    }


                                ]);
                            }
                            else {
                                var chkDue = 0, submitBtnEnable, SubmitMSG
                                chkDue = (parseFloat(req.body[5].total) - parseFloat(req.body[6].paid)).toFixed(2)
                                if (chkDue < 0) {
                                    submitBtnEnable = true
                                    SubmitMSG = 'Please check paid amount'
                                }
                                else {
                                    submitBtnEnable = false
                                    SubmitMSG = ''
                                }
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'due',
                                        value: ((req.body[5].total) - req.body[6].paid).toFixed(2)
                                    }, {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: submitBtnEnable
                                    }, {
                                        type: 'state',
                                        name: 'SubmitMSG',
                                        value: SubmitMSG
                                    }


                                ]);
                            }
                        }
                    })



        }
    });
    app.post(globalVariable.apiRewrite + '/edu_student_fees_collection_id', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query("SELECT t2.description v,t2.sl r FROM edu_class_pay t0, edu_student_information t1,edu_student_base_fees t2 WHERE t1.class=t0.class and t2.sl=t0.description and t1.sl=? order by t0.sl", [req.body[0].student_id],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            con
                                .query("SELECT concat('Name: ',t0.name,' Class: ',t1.class) info,(select nvl(sum(amount),0) from edu_student_fees_collection where (payment_status is null or payment_status=0) and dml_by=?) totalTK FROM edu_student_information t0,edu_class t1 WHERE t0.class=t1.sl and t0.sl=?", [req.headers.uid, req.body[0].student_id],
                                    function (err, info, fields) {
                                        if (err) {
                                            console.log(err)

                                        } else {
                                            var stdInfo = '', total = '0';
                                            if (info.length > 0) {
                                                stdInfo = info[0].info
                                                total = info[0].totalTK
                                            }
                                            res.send([
                                                {
                                                    type: '',
                                                    name: '1',
                                                    value: ''
                                                }, {
                                                    type: 'select',
                                                    name: 'fees_type',
                                                    value: result
                                                }, {
                                                    type: 'input',
                                                    name: 'student_info',
                                                    value: stdInfo
                                                }
                                                , {
                                                    type: 'input',
                                                    name: 'total',
                                                    value: (total + req.body[4].amount)
                                                }
                                            ]);

                                        }
                                    })

                        }
                    });

        }
    });

    app.post(globalVariable.apiRewrite + '/7414', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            var student_id=bodyDataFind(req.body,'student_id')
            var fees_type=bodyDataFind(req.body,'fees_type')
            var description=bodyDataFind(req.body,'description')
            console.log(req.body)
            con
                .query("select  ifnull((select payment from member_non_package where sector=? and member_id=?),(select pay from membership_wise_payment t0, other_member t1 where t0.membership=t1.category and t1.sl=? and t0.description=?)) -(SELECT nvl(sum(amount-due),0) from member_transection_collection where student_id=? and description=?) pay,(select nvl(sum(amount),0) from member_transection_collection where (payment_status is null or payment_status=0) and dml_by=?) totalTK;", [fees_type,student_id,student_id,fees_type,student_id,description, req.headers.uid],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                           
                            var stdPay = 0, total = 0;
                            if (result.length > 0) {
                                stdPay = result[0].pay
                                total = result[0].totalTK
                            }
                            console.log(stdPay)
                            console.log(total)
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'input',
                                    name: 'amount',
                                    value: stdPay
                                }, {
                                    type: 'input',
                                    name: 'total',
                                    value: (parseFloat(total) + parseFloat(stdPay))
                                }
                            ]);
                        }
                    });

        }
    });
    app.post(globalVariable.apiRewrite + '/edu_student_fees_collection_amount', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            //SELECT nvl(sum(amount-due),0) from edu_student_fees_collection where student_id=200020004 and description=562
            con
                .query("select case when (select count(*) from edu_waiver_list where student_id=? and fees=?)>0 then (select pay from edu_waiver_list where student_id=? and fees=?) else (select pay from edu_class_pay t0, edu_student_information t1 where t0.class=t1.class and t1.sl=? and t0.description=?) end-(SELECT nvl(sum(amount-due),0) from edu_student_fees_collection where student_id=? and description=?) pay,(select nvl(sum(amount),0) from edu_student_fees_collection where (payment_status is null or payment_status=0) and dml_by=?) totalTK", [req.body[0].student_id, req.body[2].fees_type, req.body[0].student_id, req.body[2].fees_type, req.body[0].student_id, req.body[2].fees_type, req.body[0].student_id, req.body[3].description, req.headers.uid],
                    function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {
                            //console.log(req.body)
                            var stdPay = 0, total = 0;
                            if (result.length > 0) {
                                stdPay = result[0].pay
                                total = result[0].totalTK
                            }
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'input',
                                    name: 'amount',
                                    value: stdPay
                                }, {
                                    type: 'input',
                                    name: 'total',
                                    value: (parseFloat(total) + parseFloat(stdPay))
                                }
                            ]);
                        }
                    });

        }
    });

    app.post(globalVariable.apiRewrite + '/pos_customer_id', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            var sql = " ",
                query = ''

            if (req.body[9].customer_id.indexOf('p') >= 0) {
                query = req
                    .body[9]
                    .customer_id
                    .replace(/p/g, '')
                sql = "select concat(sl,' |**| ',name) name  from pos_customer where ( phone like '%" + query + "%') and  org_id=? and branch=? limit 1"
            } else if (req.body[9].customer_id.indexOf('i') >= 0) {
                query = req
                    .body[9]
                    .customer_id
                    .replace(/i/g, '')
                sql = "select concat(sl,' |**| ',name) name from pos_customer where ( sl='" + query + "') and  org_id=? and branch=? limit 1"
            } else {

                sql = "select concat(sl,' ',name) name  from pos_customer where ( sl='" + query + "') and  org_id=? and branch=? limit 1"
            }
            con
                .query(sql, [
                    req.body[16].org_id, req.body[17].branch
                ], function (err, result, fields) {
                    if (err) {
                        console.log(err)

                    } else {

                        if (result.length > 0) {
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'input',
                                    name: 'customer_name',
                                    value: result[0].name
                                }
                            ]);
                        } else {
                            res.send([
                                {
                                    type: '',
                                    name: '1',
                                    value: ''
                                }, {
                                    type: 'input',
                                    name: 'customer_name',
                                    value: ''
                                }
                            ]);
                        }
                    }
                });

        }
    });
    app.post(globalVariable.apiRewrite + '/pos_paid', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'due',
                    value: (req.body[5].grand_total - req.body[10].paid).toFixed(2)
                }
            ]);

        }
    });
    app.post(globalVariable.apiRewrite + '/pos_given_money', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {
            var v_return_money = 0,
                v_paid = 0;
            v_return_money = (req.body[7].given_money - req.body[5].grand_total).toFixed(2)
            if ((req.body[7].given_money - req.body[5].grand_total).toFixed(2) < 0) {
                v_return_money = 0;
            }

            if ((req.body[7].given_money - req.body[5].grand_total).toFixed(2) <= 0) {
                v_paid = req.body[7].given_money;
            }

            if ((req.body[7].given_money - req.body[5].grand_total).toFixed(2) > 0) {
                v_paid = req.body[5].grand_total
            }

            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'return_money',
                    value: v_return_money
                }, {
                    type: 'input',
                    name: 'paid',
                    value: v_paid
                }, {
                    type: 'input',
                    name: 'due',
                    value: (req.body[5].grand_total - v_paid).toFixed(2)
                }
            ]);

        }
    });
    app.post(globalVariable.apiRewrite + '/pos_product_price', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query(" select product_cost+(product_cost*(profit/100))-(product_cost*(offer/100))+(pro" +
                    "duct_cost*(vat/100)) price,(product_cost*(offer/100)) discount,(product_cost*(vat/100)) vat,product_cost cost,product_cost+(product_cost*(profit/100))+(pro" +
                    "duct_cost*(vat/100)) sale_price from pos_product where (sl=? or barcode=? or custom_c" +
                    "ode=?) and org_id=? and branch=? limit 1",
                    [
                        req.body[0].product_code, req.body[0].product_code, req.body[0].product_code, req.body[16].org_id, req.body[17].branch
                    ], function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            if (result.length > 0) {

                                con
                                    .query("select sum(total) grand_total from pos_product_sale where (receipt_no is null or" +
                                        " receipt_no=0) and dml_by=?",
                                        [req.headers.uid], function (err, result1, fields) {
                                            if (err) {
                                                console.log(err)

                                            } else {

                                                res.send([
                                                    {
                                                        type: '',
                                                        name: '1',
                                                        value: ''
                                                    }, {
                                                        type: 'input',
                                                        name: 'total',
                                                        value: (req.body[2].quantity * result[0].price).toFixed(2)
                                                    }, {
                                                        type: 'input',
                                                        name: 'grand_total',
                                                        value: (req.body[2].quantity * result[0].price + result1[0].grand_total).toFixed(2)
                                                    }
                                                    , {
                                                        type: 'input',
                                                        name: 'discount',
                                                        value: (result[0].discount).toFixed(2)
                                                    },
                                                    {
                                                        type: 'input',
                                                        name: 'vat',
                                                        value: (result[0].vat).toFixed(2)
                                                    },
                                                    {
                                                        type: 'input',
                                                        name: 'cost',
                                                        value: (result[0].cost).toFixed(2)
                                                    },
                                                    {
                                                        type: 'input',
                                                        name: 'sale_price',
                                                        value: (result[0].sale_price).toFixed(2)
                                                    }
                                                ]);
                                            }
                                        })

                            } else {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'total',
                                        value: ''
                                    }
                                ]);
                            }
                        }
                    });

        }
    });

    app.post(globalVariable.apiRewrite + '/pos_product_code', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            con
                .query(" select name from pos_product where (sl=? or barcode=? or custom_code=?) and org" +
                    "_id=? and branch=? limit 1",
                    [
                        req.body[0].product_code, req.body[0].product_code, req.body[0].product_code, req.body[16].org_id, req.body[17].branch
                    ], function (err, result, fields) {
                        if (err) {
                            console.log(err)

                        } else {

                            if (result.length > 0) {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'product_name',
                                        value: result[0].name
                                    }
                                    , {
                                        type: 'state',
                                        name: 'submitBtnEnable',
                                        value: false
                                    }
                                ]);
                            } else {
                                res.send([
                                    {
                                        type: '',
                                        name: '1',
                                        value: ''
                                    }, {
                                        type: 'input',
                                        name: 'product_name',
                                        value: 'item not found'
                                    }
                                ]);
                            }
                        }
                    });

        }
    });
    app.post(globalVariable.apiRewrite + '/pos_product_profit', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            var p_cost = req.body[4].product_cost
            p_profit = req.body[6].profit,

                p_profit_fixed = ((p_profit / 100) * p_cost).toFixed(2);

            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'profit_fixed',
                    value: p_profit_fixed
                }
            ]);
        }
    });

    app.post(globalVariable.apiRewrite + '/pos_product_profit_fixed', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            var p_cost = req.body[4].product_cost
            p_profit_fixed = req.body[7].profit_fixed,

                p_profit = ((p_profit_fixed * 100) / p_cost).toFixed(2)

            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'profit',
                    value: p_profit
                }
            ]);
        }
    });

    app.post(globalVariable.apiRewrite + '/pos_product_offer', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            var p_cost = req.body[4].product_cost
            offer = req.body[9].offer,

                offer_fixed = ((offer / 100) * p_cost).toFixed(2);

            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'offer_fixed',
                    value: offer_fixed
                }
            ]);
        }
    });

    app.post(globalVariable.apiRewrite + '/pos_product_offer_fixed', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            var p_cost = req.body[4].product_cost
            offer_fixed = req.body[9].offer_fixed,

                offer = ((offer_fixed * 100) / p_cost).toFixed(2);

            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'offer',
                    value: offer
                }
            ]);
        }
    });

    app.post(globalVariable.apiRewrite + '/pos_product_vat', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            var p_cost = req.body[4].product_cost
            vat = req.body[10].vat,

                vat_fixed = ((vat / 100) * p_cost).toFixed(2);

            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'vat_fixed',
                    value: vat_fixed
                }
            ]);
        }
    });

    app.post(globalVariable.apiRewrite + '/pos_product_vat_fixed', (req, res) => {

        if (apiSecurity.authentication(req.headers.uid) != req.headers.token) {
            req
                .connection
                .destroy();
        } else {

            var p_cost = req.body[4].product_cost
            vat_fixed = req.body[11].vat_fixed,
                offer_fixed = req.body[9].offer_fixed,
                p_profit_fixed = req.body[7].profit_fixed;

            vat = ((vat_fixed * 100) / p_cost).toFixed(2);
            finale_sale_price = (vat_fixed * 1) + (p_cost * 1) + (p_profit_fixed * 1) - (offer_fixed * 1)
            res.send([
                {
                    type: '',
                    name: '1',
                    value: ''
                }, {
                    type: 'input',
                    name: 'vat',
                    value: vat
                }, {
                    type: 'input',
                    name: 'finale_sale_price',
                    value: finale_sale_price
                }
            ]);
        }
    });

    /***************** End *******************/

};