module.exports = function(app, swig, gestorBD) {

    app.get("/peticion/confirm/:email", function(req, res) {
        var criterio = {
            email: req.params.email
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
              var usuario = usuarios[0];
              criterio = {
                  origen : usuario
              }
            gestorBD.obtenerAmistades(criterio, function(amistades) {
                if (amistades == null || amistades.length == 0) {
                    criterio = {
                        email : req.session.usuario
                    }
                    gestorBD.obtenerUsuarios(criterio, function (usuarios){
                        if(usuarios == null || usuarios.length == 0 ){
                            es.redirect("/peticionesRecibidas?mensaje=El receptor no existte");
                        }
                        else{
                            var receptor = usuarios[0];
                            var amistad = {
                                origen: usuario,
                                destino: receptor
                            }
                            gestorBD.insertarAmistad(amistad, function (id) {
                                if (id == null) {
                                    res.redirect("/peticionesRecibidas?mensaje=Error al confirmar la peticion");
                                }
                                else {
                                    res.redirect("/peticionesRecibidas?mensaje=Solicitud de amistad confirmada");
                                }
                            });
                        }
                    });

                } else {
                    res.redirect("/peticionesRecibidas?mensaje=Ya existe la relacion de amistad");
                }
            });
        });
    });


    app.get("/amistades", function (req, res) {
        var criterio = {
            "origen.email" : req.session.usuario
        }
        console.log(criterio);
        gestorBD.obtenerAmistades(criterio, function (amistades) {
            if (amistades == null || amistades.length == 0) {
                var criterio = {
                    destino : req.session.usuario
                };
                gestorBD.obtenerAmistades(criterio, function (amistades) {
                    if (amistades == null || amistades.length == 0) {
                        res.send("Error al listar las amistades o no tiene amigos")
                    } else {
                        var respuesta = swig.renderFile("views/blistarAmistades.html", {
                            amistades: amistades
                        });
                        res.send(respuesta);
                    }
                });
            } else {
                var respuesta = swig.renderFile("views/blistarAmistades.html", {
                    amistades: amistades
                });
                res.send(respuesta);
            }
        });
    });
}