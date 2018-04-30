// Módulos
var express = require('express');
var app = express();

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

var crypto = require('crypto');

var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

app.use(express.static('public'));

app.set('port', 8081);
app.set('db','mongodb://admin:sdi@ds131989.mlab.com:31989/tiendamusica');
app.set('clave','abcdefg');
app.set('crypto',crypto);

require("./routes/rusuarios.js")(app,swig, gestorBD);

app.get('/', function (req, res) {
    res.redirect('/identificarse');
})

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
