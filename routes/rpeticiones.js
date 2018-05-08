module.exports = function(app, swig, gestorBD) {

    app.get("/peticion/add/:id", function(req, res) {
        var criterio = {
            _id : gestorBD.mongo.ObjectID(req.params.id)
        }
        gestorBD.obtenerPeticiones(criterio, function(peticiones) {
           if(peticiones == null){
                var peticion = {
                    idEmisor : req.session.id,
                    idReceptor : req.query.id
                }
            gestorBD.insertarPerticion(peticion, function(id) {
                if (id == null){
                    res.redirect("/usuarios?mensaje=Error al crear la petición")
                } else {
                    res.redirect("/usuarios?mensaje=Petición enviada");
                }
            });
           } else {
               res.redirect("/registrarse?mensaje= La petición ya existe");
            }
        });
    });
}