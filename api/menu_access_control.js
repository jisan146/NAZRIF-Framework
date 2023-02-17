var con = require('./dbConfig');
var globalVariable = require('./globalVariable');
module.exports = function (app) {

    app
        .get(globalVariable.apiRewrite+'/menu_access_control', function (req, res, next) {

            con
                .query("SELECT p.sl psl,g.sl gsl,c.sl sl, g.group_name group_id,p.page page FROM menu_ac" +
                        "cess_control c, menu_access_group g, menu_pages p where c.page=p.sl and g.sl=c.g" +
                        "roup_id",
                function (err, result, fields) {
                    if (err) {
                        req
                            .connection
                            .destroy();
                    } else {
                        res.send(result);
                    }
                });

        });

    app.post(globalVariable.apiRewrite+'/menu_access_control', function (req, res, next) {

        con
            .query("insert into menu_access_control values(null,?,?)", [
                req.body.gsl, req.body.psl
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

    app.delete(globalVariable.apiRewrite+'/menu_access_control', function (req, res, next) {

        con
            .query("delete from  menu_access_control where sl=?", [req.body.uid], function (err, result, fields) {
                if (err) {
                    req
                        .connection
                        .destroy();
                } else {
                    res.send(result)
                }
            });

    });

    app.put(globalVariable.apiRewrite+'/menu_access_control', function (req, res, next) {

        con
            .query("update menu_access_control set group_id=?,page=? where sl=?", [
                req.body.gsl, req.body.psl, req.body.uid
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

};