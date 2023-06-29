'use strict';

//CONTROLADOR

var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var google = require('../services/google');


var controller = {
  
  
    //funcion que devuelve texto de prueba
    home: function(req, res){
        return res.status(200).send({
            message: 'Home web page'
        });
    },
    
    //funcion que recibe un id de usuario y devuelve el usuario
    
    getUser: async function(req, res){
        
        let user;
        
        if(req.params.id === null) return res.status(404).send({
                message: "User doesn't exist"
        });
                   
        try{
                user = await User.findById(req.params.id);
                return res.status(200).send({
                    user
                });
            
        }catch(err){
                return res.status(500).send({
                message: "Error in server"
                 });  
        }
                
        
    },
    
    //funcion que recibe un usuario extrae su id y devuelve el usuario
    
    getUser2: async function(req, res){
        
        let user = req.params;
        
        if(user.id === null) return res.status(404).send({
                message: "User doesn't exist"
        });
                   
        try{
                user = await User.findById(user.id);
                return res.status(200).send({
                    user
                });
            
        }catch(err){
                return res.status(500).send({
                message: "Error in server"
                 });  
        }
                
        
    },
    
    //funcion que recibe los parametros de un usuario y lo guarda
     
    createUser: async function(req, res){
        
        var user = new User();
           
        var params = req.body;
                
        user.name = params.name;
        user.surname = params.surname;;
        user.pass = bcrypt.hashSync(params.pass);
        user.email = params.email;
        user.image = params.image;
        user.role = params.role;
        
        try{
            await user.save();         
            return res.status(200).send({
               user
            });     
            
        }catch(err){
            return res.status(500).send({
               
               message: "Error in server"
                                                             
            });  
        }
                        
      
    },
    
    //funcion que recibe los datos de configuracion del correo y los cammpos del formulario y los envia maquetados en una plantilla html
    
    sendEmail: async function(req, res){
        
        var config = google.dms();
        var params = req.body;
                
        var name = params.name;
        var surname = params.surname;;
        var subject = params.subject;
        var email = params.email;
        var message = params.message;
        
        var options = {
                        from: '"DMS" <absentastudio@gmail.com>',
                        subject: subject,
                        to: "absentastudio@gmail.com",
                        html: `
                                <div>
                                  <p>Usuario: ${name} ${surname} </p>
                                  <p>Email:   ${email} </p>
                                  <p>Mensaje: ${message} </p>
                                <div>
                              ` 
                       };
        
        
        try{
            await config.sendMail(options);         
            return res.status(200).send({
               message: "Email sent"
            });     
            
        }catch(err){
            return res.status(500).send({
               
               message: "Error in server"
                                                             
            });  
        }
                        
      
    },
    
     //funcion para hacer pruebas de postman de los token que devuelve el usuario
    
    byPass: async function(req, res){
        
        var user = req.user;
                try{
                        return res.status(200).send({                                              
                                                      user
                                                    });  
                }catch{
                        return res.status(404).send({
                                                      message: "Error in server"
                                                    });  
                }     
        
    },
    
    //funcion que actualiza el usuario segun la id que recibe con los nuevos parametros del body y devuelve el usuario actualizado
    
    updateUser: async function(req, res){
             
        if(req.params.id === null) return res.status(404).send({
             message: "User doesn't exist"
        });        
        
        try{
            const updater = req.body;
            delete updater.pass;
            const userUpdated = await User.findByIdAndUpdate(req.params.id, updater, {new: true});
            return res.status(200).send({
                user: userUpdated
            });
            
        }catch(err){
            return res.status(500).send({
               message: "Error in server"
            });  
        }
       
        
    },
    
    //funcion que recibe todos los usuarios ordenandolos por año, luego los devuelve en un array    
        
    getUsers: async function(req, res){
                       
        try{
            let user = await User.find({}).sort('-year').exec();
            if(!user) return res.status(404).send({
                message: "No users to show"
            });
            return res.status(200).send({
                user
            });
            
        }catch(err){
            if (err) return res.status(500).send({
               message: "Error in server"
            });  
        }
    },
   
    //funcion qu recibe el email y password del usuario los compara con los encriptados en la base de datos y si es correcto genera un token 
   
    loginUser: async function(req, res){
                  
        try{
                var params = req.body;
                var email = params.email; 
                var pass = params.pass; 
                
                const user = await User.findOne({email : email});
          
                              
                const result = bcrypt.compareSync(pass, user.pass);
                                
                if(!user) return res.status(404).send({
                                                        message: "Email doesn't exist"
                                                     });
                                
                if (!result) return res.status(500).send({
                                                          message: "Incorrect password"
                                                        });    
                           
                if(params.gettoken){
                     return res.status(200).send({                                              
                                                  token: jwt.createToken(user)
                                                 });  
                }
                else{
                    return res.status(200).send({                                              
                                                  user    
                                                 });  
                }
                
        }catch(err){
                return res.status(500).send({
                                             message: "Error in server"
                                            });  
        }
                        
      
    },
    
    //funcion que recibe el id del usuario que va a borrar y devuelve mensaje segun resultado
    
    deleteUser: async function(req, res){
                
        if(req.params.id === null) return res.status(404).send({
                message: "User doesn't exist"
        });
        
        try{
                await User.findByIdAndRemove(req.params.id);
                return res.status(200).send({
                    message: "User has been deleted"
                });
            
        }catch(err){
                if(err) return res.status(500).send({
                        message: "Error in server"
                });
        }
        
    },  
 
     //funcion que recibe los parametros de la ruta la separa y despues si es de tipo imagen segun el id lo asocia al usuario y devuelve el usuario si es correcto
 
    uploadImage: async function(req, res){
        
        var fileName = "Image doesn`t upload";
                
        if(req.file){
            
                var filePath = req.file.path;
                var fileSplit = filePath.split('\\');
                var fileName = fileSplit[1];
                var extSplit = fileName.split('\.');
                var fileExt = extSplit[1];
                
                if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif' || fileExt === 'JPG'){
                    
                       try {
                            const userUpdated = await User.findByIdAndUpdate(req.params.id, {image: fileName}, {new: true});
                           
                            if(!userUpdated) return res.status(404).send({
                                    message: "User does not exist and hasn´t been updated" 
                            });
                            return res.status(200).send({
                                    user: userUpdated
                            }); 
                            
                       }catch (err) {
                          return res.status(500).send({message: "Image doesn`t upload"});
                       }
                
                }else{
                    
                    fs.unlink(filePath, (err)=>{
                         return res.status(200).send({
                            message: "Extension is not valid"
                         });
                    });
                }
              
        }else{
                return res.status(200).send({
                   message: fileName
                });
        }
        
        
    },
    
     //funcion que recibe una imagen y la envia a una ruta establecida
    
    getImageFile: async function(req, res){
      
        
        var file = req.params.image;
        var path_file = './uploads2/' + file;
        
           if(fs.existsSync(path_file)){
               return res.sendFile(path.resolve(path_file));
           }
           
           else{
               return res.status(200).send({
                   message: "Image doesn't exist"
               });
           }
    }
  
  
};


module.exports = controller;