module.exports = function(app, swig, gestorBD) {

    app.get("/peticion/add/:email", function(req, res) {
        var criterio = {
            email : req.params.email
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            //console.log(usuarios);
            var usuario = usuarios[0];
            criterio = {
                _id : gestorBD.mongo.ObjectID(usuario._id)
            }
            gestorBD.obtenerPeticiones(criterio, function(peticiones) {
                if(peticiones == null || peticiones.length == 0){
                    var peticion = {
                        emisor : req.session.usuario,
                        receptor : usuario.email
                    }
                    gestorBD.insertarPerticion(peticion, function(id) {
                        if (id == null){
                            res.redirect("/usuarios?mensaje=Error al crear la petición")
                        } else {
                            res.redirect("/usuarios?mensaje=Petición enviada");
                        }
                    });
                } else {
                    res.redirect("/usuarios?mensaje= La petición ya existe");
                }
            });

        });
    });

    app.get("/peticionesRecibidas", function (req, res){
        var criterio = {
            receptor: req.session.usuario
        };
        gestorBD.obtenerPeticiones(criterio, function (peticiones) {
            if (peticiones == null) {
                res.send("Error al listar las peticiones")
            } else {
                var respuesta = swig.renderFile("views/blistarPeticiones.html", {
                    peticiones: peticiones
                });
                res.send(respuesta);
            }

        });
    });
}