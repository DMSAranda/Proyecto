'use strict';

//RUTAS

//se importan todas las librerias, middlewares y controladores necesarios

var express = require('express');

var ProjectController = require('../controllers/project');

var router = express.Router();

var md_auth = require('../middlewares/auth');

var md_admin = require('../middlewares/is_admin');

const multer = require('multer');

//se establece con multer la ubicacion de las imagenes subidas y el prefijo del nombre de cada imagen

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, "img" + Date.now() + file.originalname);
    }
  });

const upload = multer({ storage: storage });


//rutas de Node de las peticiones HTTP y el controlador al que se deriva

router.get('/home', ProjectController.home);

router.post('/test', ProjectController.test);

router.post('/bypass',[md_auth.ensureAuth, md_admin.isAdmin], ProjectController.byPass);

router.post('/save',[md_auth.ensureAuth, md_admin.isAdmin], ProjectController.saveProject);

router.get('/project/:id?', ProjectController.getProject);

router.get('/projects', ProjectController.getProjects);

//router.get('/projects', [md_auth.ensureAuth, md_admin.isAdmin], ProjectController.getProjects);

//router.get('/project/:id?',  [md_auth.ensureAuth, md_admin.isAdmin], ProjectController.getProject);

router.put('/update/:id?', [md_auth.ensureAuth, md_admin.isAdmin], ProjectController.updateProject);

router.delete('/delete/:id?', [md_auth.ensureAuth, md_admin.isAdmin], ProjectController.deleteProject);

router.post('/upload/:id?', upload.single('image'),  ProjectController.uploadImage);

router.get('/getImage/:image?', ProjectController.getImageFile);

module.exports = router;