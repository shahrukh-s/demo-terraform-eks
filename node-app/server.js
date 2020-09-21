
var express = require('express');
var app = express();

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.json({"value":"True"});
});

app.get('/fibonacci', function (req, res) {
  var value = exports.fibonacci = fibonacci(parseInt(req.param('value')));
  res.json({"value" : value});
});

function fibonacci(value) {
  if (value < 2)
    return 1;
  else
    return fibonacci(value - 2) + fibonacci(value - 1);
}

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

var port = 8080
var ip = '0.0.0.0';

app.listen(port, ip);
console.log('Nodejs Server is running on http://%s:%s', ip, port);

module.exports = app;
