var http = require('http');
var url = require('url');
var fs = require('fs');
var conv = require('./convertModule');
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
        res.end(result.toString());
    }
}).listen(8080);

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }