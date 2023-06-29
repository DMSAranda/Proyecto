'use strict';

//MODELO

//modelado en mongoose schemas de los datos del usuario

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = Schema({
    
    name: {type: String, required: true, trim : true},
    surname: {type: String, required: true, trim : true},
    pass: {type: String, required: true, trim : true},
    email: {type: String, required: true, trim : true, unique : true},
    image: {type: String, required: false, trim : true},
    role: {type: String, required: false, trim : true},
    gettoken: {type: String, required: false, trim : true}
}, {   
    timestamps: true
   }         
);

module.exports = mongoose.model('User', ProjectSchema);  //se guarda en minusculas y en la coleccion en plural
 

