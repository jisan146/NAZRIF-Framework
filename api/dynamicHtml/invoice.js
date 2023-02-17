var con = require('../dbConfig');
var apiSecurity = require('../apiSecurity');
var globalVariable = require('../globalVariable');

module.exports = function (app) {

    /***************** Start *******************/

    app.get(globalVariable.apiRewrite + "/invoice/:uid", (req, res) => {

        con
            .query("select t2.receipt_no, t2.customer_id,nvl((select phone from pos_customer where sl=t2.customer_id),' ') customer_phone, nvl((select name from pos_customer where sl=t2.customer_id),' ') customer_name,nvl((select address from pos_customer where sl=t2.customer_id),' ') customer_adress,nvl((select organization from pos_customer where sl=t2.customer_id),' ') customer_org, date_format(t2.sale_date,'%d-%b-%y %h:%i %p') sale_date,t0.name,t0.address,t0.phone from org_details t0, users t1, pos_product_sale t2 where t0.org_id=t1.org_id and t0.branch=t1.branch and t2.org_id=t0.org_id and t0.branch=t2.branch and (t2.receipt_no is null or t2.receipt_no=0) and t1.sl=? limit 1; select t0.sl,t0.receipt_no,t0.product_code,t0.product_name,t0.quantity,t0.total/t0.quantity price,t0.total from pos_product_sale t0  where t0.dml_by=? and (t0.receipt_no is null or t0.receipt_no=0 ) order by t0.sl; select round(sum(total),2)total,round(sum(paid),2)paid,round(sum(due),2)due,(SELECT payment_option FROM payment_option where sl=t0.payment_option ) payment_option from pos_product_sale t0  where t0.dml_by=? and (t0.receipt_no is null or t0.receipt_no=0 ) ;",[req.params.uid,req.params.uid,req.params.uid],
            function (err, result, fields) {
                if (err) {
                    console.log(err)

                } else {
                    res.render("invoicePrint",{result}); 
                }
            })

        
    });

    app.get(globalVariable.apiRewrite + "/invoice/:uid/:inv", (req, res) => {

        con
        .query("select t2.receipt_no, t2.customer_id,nvl((select phone from pos_customer where sl=t2.customer_id),' ') customer_phone, nvl((select name from pos_customer where sl=t2.customer_id),' ') customer_name,nvl((select address from pos_customer where sl=t2.customer_id),' ') customer_adress,nvl((select organization from pos_customer where sl=t2.customer_id),' ') customer_org, date_format(t2.sale_date,'%d-%b-%y %h:%i %p') sale_date,t0.name,t0.address,t0.phone from org_details t0, users t1, pos_product_sale t2 where t0.org_id=t1.org_id and t0.branch=t1.branch and t2.org_id=t0.org_id and t0.branch=t2.branch and t2.receipt_no=? and t1.sl=? limit 1; select t0.sl,t0.receipt_no,t0.product_code,t0.product_name,t0.quantity,t0.total/t0.quantity price,t0.total from pos_product_sale t0  where t0.dml_by=? and t0.receipt_no=? order by t0.sl; select round(sum(total),2)total,round(sum(paid),2)paid,round(sum(due),2)due,(SELECT payment_option FROM payment_option where sl=t0.payment_option ) payment_option from pos_product_sale t0  where t0.dml_by=? and t0.receipt_no=? ;",
        [req.params.inv,req.params.uid,req.params.uid,req.params.inv,req.params.uid,req.params.inv],
        function (err, result, fields) {
            if (err) {
                console.log(err)

            } else {
                res.render("invoicePrint",{result}); 
            }
        })

        
    });

    /***************** End *******************/

};