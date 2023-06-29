'use strict';

//CONTROLADOR

var Project = require('../models/project');
var User = require('../models/user');

var fs = require('fs');
var path = require('path');

var controller = {
  
    //funcion que devuelve texto de prueba
    home: function(req, res){
        return res.status(200).send({
            message: 'Home web page'
        });
    },
    
    test: function(req, res){
        return res.status(200).send({
            message: 'Test web page'
        });
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
    
    //funcion que guarda el proyecto, tras recibir todos los atributos del body y se guarda devuelve el proyecto
    
    saveProject: async function(req, res){
        
        var project = new Project();
        
        var params = req.body;
        
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.langs = params.langs;
        project.year = params.year;
        project.image = params.image;
        project.user = req.user.sub;
        
        try{
            await project.save();
            return res.status(200).send({
               project
            });
            
        }catch(err){
            console.log(project.image, project.user.toString() );
            return res.status(500).send({
               message: "Error saving project", 
               project
            });  
        }
                        
      
    },
    
    //funcion que recoge un id de proyecto, lo pobla con datos de usuario y lo devuelve
    
    getProject: async function(req, res){
        
        
        let project;
        
        if(req.params.id === null) return res.status(404).send({
                message: "Project doesn't exist"
        });
                   
        try{
                project = await Project.findById(req.params.id).populate({path: 'user'});
                return res.status(200).send({
                    project
                });
            
        }catch(err){
                return res.status(500).send({
                message: "Error in server"
                 });  
        }
                
        
    },
    
    //funcion que recibe todos los proyectos poblandolo con los datos de todos los usuarios asociado y ordenandolo por año, luego los devuelve en un array
    
    getProjects: async function(req, res){
                       
        try{
            let projects = await Project.find({}).populate({path: 'user'}).sort('-year').exec();
            if(!projects) return res.status(404).send({
                message: "No projects created"
            });
            return res.status(200).send({
                projects
            });
            
        }catch(err){
            if (err) return res.status(500).send({
               message: "Error in server"
            });  
        }
    },
    
    //funcion que recibe todos los proyectos poblandolo con los datos de un usuario asociado en concreto y ordenandolo por año, luego los devuelve en un array
    
    getProjects2: async function(req, res){
        
        if(req.params.id === null) return res.status(404).send({
                message: "User doesn't exist"
        });
                       
        try{
            let projects = await Project.find({$in: req.params.id2}).populate({path: 'user'}).sort('-year').exec();
            if(!projects) return res.status(404).send({
                message: "No projects created"
            });
            return res.status(200).send({
                projects
            });
            
        }catch(err){
            if (err) return res.status(500).send({
               message: "Error in server"
            });  
        }
    },
    
    //funcion que actualiza el proyecto segun la id que recibe con los nuevos parametros del body y devuelve el proyecto actualizado
    
    updateProject: async function(req, res){
             
        if(req.params.id === null) return res.status(404).send({
             message: "Project doesn't exist"
        });        
        
        try{
            const projectUpdated = await Project.findByIdAndUpdate(req.params.id, req.body, {new: true});
            return res.status(200).send({
                project: projectUpdated
            });
            
        }catch(err){
            return res.status(500).send({
               message: "Error in server"
            });  
        }
       
        
    },
    
    //funcion que recibe el id del proyecto que va a borrar y devuelve mensaje segun resultado
    
    deleteProject: async function(req, res){
                
        if(req.params.id === null) return res.status(404).send({
                message: "Project doesn't exist"
        });
        
        try{
                await Project.findByIdAndRemove(req.params.id);
                return res.status(200).send({
                    message: "Project has been deleted"
                });
            
        }catch(err){
                if(err) return res.status(500).send({
                        message: "Error in server"
                });
        }
        
    },  
 
    //funcion que recibe los parametros de la ruta la separa y despues si es de tipo imagen segun el id lo asocia al proyecto y devuelve el proyecto si es correcto
 
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
                            const projectUpdated = await Project.findByIdAndUpdate(req.params.id, {image: fileName}, {new: true});
                           
                            if(!projectUpdated) return res.status(404).send({
                                    message: "Project does not exist and hasn´t been updated" 
                            });
                            return res.status(200).send({
                                    project: projectUpdated
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
        var path_file = './uploads/' + file;
        
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