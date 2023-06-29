'use strict';

//configuracion de la aplicacion de todas las dependencias, rutas, middlewares, cors y cabeceras 

//ExpressJS

var express = require('express');

var bodyParser = require('body-parser');

var app = express();



//CORS

var cors = require('cors');


//Archivos de rutas

var project_routes = require('./routes/project');
var user_routes = require('./routes/user');


//Middlewares

app.use(bodyParser.urlencoded({extended:false}));   //conversiones de datos que entren por GET y POST
app.use(bodyParser.json());     //conversion a JSON


// Configurar cabeceras y cors

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(cors());

//Rutas

app.use('/api', project_routes);
app.use('/api', user_routes);


//Exportaciones

module.exports = app;