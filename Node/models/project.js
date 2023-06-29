'use strict';

//MODELO

//modelado en mongoose schemas de los datos del projecto

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = Schema({
    
    name: {type: String, required: true, trim : true},
    description: {type: String, required: true, trim : true},
    category: {type: String, required: true, trim : true},
    langs: {type: String, required: true, trim : true},
    year: {type: Number, required: true, trim : true},
    image: {type: String, required: false, trim : true},
    user: {type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', ProjectSchema);  //se guarda en minusculas y en la coleccion en plural
 

