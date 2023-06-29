'use strict';

//RUTAS

//se importan todas las librerias, middlewares y controladores necesarios

var express = require('express');

var UserController = require('../controllers/user');

var router = express.Router();

var md_auth = require('../middlewares/auth');

var md_admin = require('../middlewares/is_admin');

const multer = require('multer');

//se establece con multer la ubicacion de las imagenes subidas y el prefijo del nombre de cada imagen

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads2/');
    },
    filename: function (req, file, cb) {
      cb(null, "img" + Date.now() + file.originalname);
    }
  });

const upload = multer({ storage: storage });

//rutas de Node de las peticiones HTTP y el controlador al que se deriva

router.post('/bypass2', [md_auth.ensureAuth, md_admin.isAdmin], UserController.byPass);

router.get('/user/:id?', UserController.getUser);

router.get('/user/:user?', UserController.getUser2);

router.get('/users', [md_auth.ensureAuth, md_admin.isAdmin], UserController.getUsers);

router.post('/register', UserController.createUser);

router.post('/login', UserController.loginUser);

router.put('/update2/:id?', [md_auth.ensureAuth, md_admin.isAdmin], UserController.updateUser);

router.post('/email', UserController.sendEmail);

router.post('/upload2/:id?', upload.single('image'), UserController.uploadImage);

router.get('/getImage2/:image?',  UserController.getImageFile);

module.exports = router;