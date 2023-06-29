'use strict';

const nodeMailer = require('nodemailer');

//con nodemailer creamos una funcion que guarda en la variable config los datos de la conexion y la devuelve

exports.dms = function(){
    
    var config = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: '465',
        secure: true,
        auth: {
            user: 'absentastudio@gmail.com',
            pass: 'akbmovxzkdaowkba'
        }
        
    });
        
    
 
    return config;
};