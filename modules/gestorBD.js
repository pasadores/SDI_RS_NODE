module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.insert(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    insertarPerticion: function (peticion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function (err, db) {
            if(err){
                funcionCallback(null);
            } else {
                var collection = db.collection('peticiones');
                collection.insert(peticion,function (err,result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }

        });
    },

    insertarAmistad: function (amistad, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function (err, db) {
            if(err){
                funcionCallback(null);
            } else {
                var collection = db.collection('amistades');
                collection.insert(amistad,function (err,result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    obtenerUsuarios : function(criterio,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.find(criterio, { nombre : 1 , email : 1}).toArray(function(err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerPeticiones : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function (err, db) {
            if (err) {
                funcionCallback(null)
            } else {
                var collection = db.collection('peticiones');
                collection.find(criterio).toArray(function(err, peticiones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(peticiones);
                    }
                    db.close();
                });
            }

        });
    },

    obtenerAmistades : function(criterio, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'),function (err, db) {
            if (err) {
                funcionCallback(null)
            } else {
                var collection = db.collection('amistades');
                collection.find(criterio).toArray(function(err, amistades) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(amistades);
                    }
                    db.close();
                });
            }

        });
    },

    obtenerUsuariosPg : function(criterio, pg, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.count(function(err, count){
                    collection.find(criterio).skip( (pg-1)*5 ).limit( 5 )
                        .toArray(function(err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(usuarios, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    insertMensaje : function(mensaje, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'),function (err, db) {
            if(err){
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.insert(mensaje,function (err,result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    leerMensajes : function(criterio,funcionCallback){
        this.mongo.connect(this.app.get('db'),function (err, db){
            if(err){
                funcionCallback(null);
            }else{
                var collection = db.collection('mensajes');
                collection.updateMany(criterio,{ $set: { leido:true} }, function(err,result){
                    if (err) {
                        funcionCallback(null);
                    } else {
                        console.log("Mensajes leidos")
                        funcionCallback(result);
                    }
                });
                db.close();
            }
        });
    },
    obtenerMensajes : function(criterio, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'),function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                var messages = new Array();
                collection.find(criterio).toArray(function(err, mensajes) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        mensajes.forEach(function(mensaje){
                            messages.push(mensaje);
                        });
                        var criterio2 = {
                            emisor : criterio.receptor,
                            receptor : criterio.emisor
                        }
                        collection.find(criterio2).toArray(function(err, mensajes) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                mensajes.forEach(function(mensaje) {
                                    messages.push(mensaje)});
                                funcionCallback(messages);
                            }
                        });

                    }
                    db.close();
                });
            }

        });
    },
    limpiarColecciones : function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function (err, db) {
            if (err) funcionCallback(null);
            var collection = db.collection('mensajes');
            collection.removeMany({});
            collection = db.collection('usuarios');
            collection.removeMany({});
            collection = db.collection('peticiones');
            collection.removeMany({});
            collection = db.collection('amistades');
            collection.removeMany({});
            funcionCallback("success");
        });
    }



};