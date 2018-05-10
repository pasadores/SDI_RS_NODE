module.exports = function (app, gestorBD) {
    app.post("/api/autenticar/", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        };
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json({autenticado: false});
            } else {
                var token = app.get('jwt').sign({usuario: criterio.email, tiempo: Date.now() / 1000}, "secreto");
                res.status(200);
                res.json({autenticado: true, token: token});
            }
        });
    });
    app.get("/api/amigo/", function (req, res){
        var criterio = {
            origen: res.usuario,
        };
        gestorBD.obtenerAmistades(criterio, function (amistades) {

            if (amistades == null || amistades.length == 0) {
                var criterio = {
                    destino : res.usuario
                };
                gestorBD.obtenerAmistades(criterio, function (amistades) {
                    if (amistades == null || amistades.length == 0) {
                        res.status(404);
                        res.json({error : "Error al listar las amistades o no tiene amigos"});
                    } else {
                        res.status(200);
                        res.json({amistades : amistades});
                    }
                });
            } else {
                res.status(200);
                res.json({amistades : amistades});
            }
        });

    });
};