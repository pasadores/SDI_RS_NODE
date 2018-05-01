module.exports = function(app, swig, gestorBD) {

    app.get("/registrarse", function(req, res) {
    var respuesta = swig.renderFile('views/bregistro.html', {});
    res.send(respuesta);
    });

    app.post('/usuario', function(req, res) {

        if(req.body.password != req.body.password2){
            res.redirect("/registrarse?mensaje=Las contraseñas no coinciden")
        }
        else{
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var criterio = {
                email : req.body.email,
                password : seguro
            }
            gestorBD.obtenerUsuarios(criterio, function(usuarios) {
                if (usuarios == null || usuarios.length == 0) {
                    var usuario = {
                        email : req.body.email,
                        nombre : req.body.nombre,
                        password : seguro
                    }

                    gestorBD.insertarUsuario(usuario, function(id) {
                        if (id == null){
                            res.redirect("/registrarse?mensaje=Error al registrar usuario")
                        } else {
                            res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                        }
                    });
                } else {
                    res.redirect("/registrarse?mensaje=El email ya existe");
                }
            });


        }


    });

    app.get("/identificarse", function(req, res) {
        var respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });

    app.post("/identificarse", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.send("identificado");
            }
        });
    });

    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    });
};