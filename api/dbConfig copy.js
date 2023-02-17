var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'jisan.info',
    user     : 'jismbdco_nazrif',
    password : 'jI1996san',
    database : "jismbdco_nazrif",
    multipleStatements: true,
    debug    : false,
    connectionLimit: 1,
    queueLimit: 0,
    waitForConnection: true
});

connection.connect(function(err) {
    if (err) {console.log('DB Connection Failed');}
    else{ //throw err;
    console.log('DB Connection Succeed')}
});

module.exports = connection;