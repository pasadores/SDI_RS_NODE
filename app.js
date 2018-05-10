// Módulos
var express = require('express');
var app = express();

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});
// Tokens
var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición, porque el usuario está autenticado

        next();
    } else {
        console.log("va a : " + req.session.destination);
        res.redirect("/identificarse");
    }
});
app.use("/usuarios", routerUsuarioSession);
app.use("/peticion/*", routerUsuarioSession);




var crypto = require('crypto');

var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function (req, res, next) { // obtener el token, puede ser un parámetro GET , POST o HEADER
    var token = req.body.token || req.query.token || req.headers['token'];
    if (token != null) {// verificar el token
        jwt.verify(token, 'secreto', function (err, infoToken) {
            if (err || (Date.now() / 1000 - infoToken.tiempo) > 240) {
                res.status(403);// Forbidden
                res.json({acceso: false, error: 'Token invalido o caducado'});
                // También podríamos comprobar que intoToken.usuario existe
                return;
            } else { // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });
    } else {
        res.status(403);// Forbidden
        res.json({acceso: false, mensaje: 'No hay Token'});
    }
});

app.use('/api/amigo', routerUsuarioToken);


app.use(express.static('public'));

app.set('port', 8081);
app.set('db','mongodb://admin:sdi@ds247499.mlab.com:47499/redsocial_sdi');
app.set('clave','abcdefg');
app.set('crypto',crypto);

require("./routes/rusuarios.js")(app,swig, gestorBD);
require("./routes/rpeticiones.js")(app,swig,gestorBD);
require("./routes/ramistades.js")(app,swig,gestorBD);
require("./routes/rapiusuarios.js")(app,gestorBD);


app.use(function (err, req, res, next) {
    console.log("Error producido: " + err); // Creamos mensaje de log
    if (!res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});

app.get('/', function (req, res) {
    res.redirect('/identificarse');
})

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
