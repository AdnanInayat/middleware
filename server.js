var http = require('http');
var url = require('url');
var fs = require('fs');
var conv = require('./convertModule');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "converter"
});

http.createServer((req, res) => {
    var q = url.parse(req.url, true).query;
    if (isEmptyObject(q)) {
        fs.readFile('index.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        var q = url.parse(req.url, true).query;
        var result = conv.convert(q.amount, q.selected_currency);
        fs.appendFile('converter.data', 'customer: ' + q.customer + ';amount:' + q.amount.toString() + ';converted amount:' + result.toString() + '\n', function (err) {
            if (err) throw err;
            console.log('File Updated!');
        });
        //con.connect(function (err) {
        //   if (err) throw err;
        con.query("SELECT * FROM tuser where username='" + q.customer + "'", function (err, sres, fields) {
            if (err) throw err;
            //user already exists
            if (sres.length == 1) {
                con.query(`insert into tconversions(amount,selected_currency,converted_amount,userid) values (` + q.amount + `,` + q.selected_currency + `,` + result + `,` + sres[0].id + `)`
                    , function (err, ires, fields) {
                        if (err) throw err;
                        console.log('added successfully');
                    });
            }
            //create new user
            else {
                con.query(`insert into tuser(username) values ('` + q.customer + `')`
                    , function (err, ires) {
                        if (err) throw err;
                        con.query(`insert into tconversions(amount,selected_currency,converted_amount,userid) values (` + q.amount + `,` + q.selected_currency + `,` + result + `,` + ires.insertId + `)`
                            , function (err, result, fields) {
                                if (err) throw err;
                                console.log('added successfully');
                            });
                    });
            }
        });
        //    console.log("Connected!");
        //});
        res.end(result.toString());
    }
}).listen(8080);

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}