'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'S@l11.Rib3R@1';

//funcion que crea un token con los datos que recibe del usuario y los codifica en un payload con la clave secreta

exports.createToken = function(user){
    
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),   //timestamp actual
        exp: moment().add(1, 'hour').unix()    //fecha expiracion
        //exp: moment().add(2, 'minutes').unix()    //fecha expiracion
    };
 
    return jwt.encode(payload, secret);
};