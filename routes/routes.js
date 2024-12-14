var express = require("express");
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var userController = require('../controllers/userController');


router.get('/', HomeController.index);
router.post('/user', userController.create);
router.get('/users', userController.findUsers);
router.get('/user/:id', userController.findUsersbyId);
router.put('/user', userController.editUsers);
router.delete('/user/:id', userController.delete);
router.post('/recoverpassword', userController.passwordRecover);
router.get('/validate', userController.validateToken);


module.exports = router;