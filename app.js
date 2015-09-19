var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json())

var pool = mysql.createPool({
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'bb2251de9cb6fd',
  password : 'ef506f45',
  database : 'heroku_436672d0fc203f4'
});
app.use(express.static(__dirname + '/public'));
app.get('/api/:id(\\d+)/info', function(req, res) {
  var id = req.params.id;
  pool.getConnection(function(err, connection) {
    if (err){
       res.status(400).send();
       throw err
    };
    connection.query('SELECT * FROM credits WHERE id = ' + id , function(err, rows, fields) {
      connection.release();
      if (err){
        res.status(400).send();
        throw err
      };

      var data = {name: rows[0].name, currentFunds: rows[0].amount,password: rows[0].password};
      res.status(200).json(data);
    });
  });
});

app.post('/api/:id(\\d+)/money', function(req, res) {
  var id = req.params.id;
  var amount = req.body.amount;
  pool.getConnection(function(err, connection) {
  if (err){
       res.status(400).send();
       throw err
    };
    connection.query('UPDATE credits SET amount = ' + amount + ' WHERE id=' + id , function(err, rows, fields) {
      connection.release();
      if (err){
        res.status(400).send();
        throw err
      };

      res.status(200).send();
    });
  });
});

app.post('/api/:id(\\d+)/name', function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  pool.getConnection(function(err, connection) {
  if (err){
       res.status(400).send();
       throw err
    };
    connection.query('UPDATE credits SET name = "' + name + '" WHERE id=' + id , function(err, rows, fields) {
      connection.release();
      if (err){
        res.status(400).send();
        throw err
     };

      res.status(200).send();
    });
  });
});

var server = app.listen(process.env.PORT || '3000', '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});
