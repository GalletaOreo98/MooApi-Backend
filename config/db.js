var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createPool({
    host: 'us-cdbr-east-05.cleardb.net',
    port: 3306,
    user: 'b8d82ba3ec2299',
    password: '232cc856',
    database: 'heroku_47d56cd040daa44',
    charset: 'UTF8MB4_GENERAL_CI'
});

module.exports = {
    con
}