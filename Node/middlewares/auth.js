'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'S@l11.Rib3R@1';


//funcion para comprobar el token de seguridad

exports.ensureAuth = function(req, res, next){
    
    //funcion que borra los datos del localstorage cerrando sesion
    function logout(){
            
        localStorage.clear();
        
       }
    
    
    //si no hay cabeceras de autorizacion te muestra un mensaje de error
    
    if(!req.headers.auth){
        this.logout();
        return res.status(403).send({
                                      message: 'La peticion no tiene la cabecera de autorizacion'
                                  });                               
    } 
    
    //se quitan las comillas del token
    
    var token = req.headers.auth.replace(/['"]+/g,'');
    
    //se desencripta el token con la clave de seguridad para extraer los datos al payload
    
    try{
        var payload = jwt.decode(token, secret);
        
        //si el payload a caducado se cierra sesion
        
        if(payload.exp > moment.unix() ){
            this.logout();
            return res.status(401).send({
                                      message: 'El token ha expirado'
                                      
                                  });          
        }
    //si hay error al desencriptar el token se muestra error y cierra sesion 
        
    }catch (ex){
        this.logout();
        return res.status(500).send({
                                      message: 'token no valido'
                                  });          
        
    }
    
    //si no hay errores se devuelve el usuario con los datos del payload
    
    req.user = payload;
    
    //continua el proceso
    
    next();
};



