'use strict';

//funcion que comprueba si el usuario es admin

exports.isAdmin = function(req, res, next){
    
    if(req.user.role !== 'admin'){
        return res.status(200).send({
                                      message: 'No tienes permisos'
                                  });      
    }
    next();
};
