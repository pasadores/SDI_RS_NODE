module.exports = function (app, gestorBD) {
    app.post("/api/mensajes", function (req, res) {
        console.log("Origen: " + res.usuario)
        console.log("Destino: " + req.body.destino);
        var criterio = {
            $or: [{
                "origen.email": res.usuario,
                "destino.email": req.body.destino
            }, {
                "origen.email": req.body.destino,
                "destino.email": res.usuario
            }]
        }
        gestorBD.obtenerAmistades(criterio, function (amistades) {
            if (amistades == null || amistades.length == 0) {
                res.status(404);
                res.json({error: "not found"});
            }
            else {
                if (res.usuario != null) {
                    if (req.body.destino != null) {
                        if (req.body.texto != null) {
                            var mensaje = {
                                emisor: res.usuario,
                                receptor: req.body.destino,
                                texto: req.body.texto,
                                leido: false,
                                timestamp: new Date().toLocaleString()
                            }
                            gestorBD.insertMensaje(mensaje, function (id) {
                                if (id == null) {
                                    res.status(500);
                                    res.json({error: "Problem when inserting message"});
                                }
                                else {
                                    res.status(201);
                                    res.json({id: id});
                                }
                            });
                        }
                        else {
                            res.status(400);
                            res.json({error: "Empty text"})
                        }
                    }
                    else {
                        res.status(400);
                        res.json({error: "Empty destiny"})
                    }
                }
                else {
                    res.status(400);
                    res.json({error: "Empty emisor"})
                }
            }
        });
    });
    app.get("/api/mensajes", function (req, res) {
        if (req.query.user != null) {
            if (req.query.user != null) {
                console.log("Origen: " + res.usuario);
                console.log("Destino: " + req.query.user);
                var criterio = {
                    $or: [{
                        "origen.email": res.usuario,
                        "destino.email": req.query.user
                    }, {
                        "origen.email": req.query.user,
                        "destino.email": res.usuario
                    }]
                }
                gestorBD.obtenerAmistades(criterio, function (amistades) {
                    if (amistades == null || amistades.length == 0) {
                        res.status(404);
                        res.json({error: "The users are not friends"})
                    }
                    else {
                        var messages = new Array();
                        var empty = false;
                        var criterio = {
                            emisor: req.query.user,
                            receptor: res.usuario
                        }
                        gestorBD.obtenerMensajes(criterio, function (mensajes) {
                            res.status(200);
                            res.json({messages: mensajes});
                        });
                    }
                });
            }
            else {
                res.status(401);
                res.json({error: "You don't have permission to get all the messages "})
            }
        }
    });


    app.get("/api/mensajesSinLeer", function (req, res) {
        if (req.query.user != null) {
            if (req.query.user != null) {
                var criterio = {
                    emisor: req.query.user,
                    receptor: res.usuario,
                    leido: false
                }
                gestorBD.obtenerMensajesRecibidos(criterio, function (mensajesSinLeer) {
                    if (mensajesSinLeer == null) {
                        res.status(404);
                        res.json({error: "No ha podido contar los mensajes"});
                    } else {
                        res.status(200);
                        // console.log(mensajesSinLeer.length);
                        res.json({numMensajesSinLeer: mensajesSinLeer});
                    }
                });
            }
            else {
                res.status(401);
                res.json({error: "You don't have permission to get all the messages "})
            }
        }
    });

}