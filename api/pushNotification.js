var con = require('./dbConfig');

function pushNotification(sndID, rcvID, msg, type,ip,orgID,branch) {


       /* con
            .query("insert into notification values (null,?,?,?,current_timestamp(),?,0)", [
                sndID, rcvID, msg, type
            ], function (err, result, fields) {
                if (err) {} else {}

            });*/

            



/*
sl
sender
receiver
message
notification_type
notification_status
sender_ip
org_id
branch
dml_by
dml_time
*/

            con
            .query("insert into notification_history values (null,?,?,?,?,0,?,?,?,?,now())", [
                sndID, rcvID, msg, type,ip,orgID,branch,sndID
            ], function (err, result, fields) {
                if (err) {} else {}

            });
 
}
module.exports = {
    pushNotification,
  };
