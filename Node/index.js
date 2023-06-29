'use strict';

var mongoose = require('mongoose');

//creamos la app desde el fichero

var app = require('./app.js');

//establecemos el puerto de la aplicacion

var port = 2015;

//creamos la conexion a traves de mongoose con la base de datos de mongodb y el servidor en el puerto definido

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/Portfolio')

        .then( ()=>{
            
            console.log("Conexión establecida");
    
            //Creacion de servidor
            
            app.listen(port, ()=>{
               
               console.log("Servidor corriendo en LocalHost:2015");
            });
    
        })
        .catch( err=> console.log(err) );

