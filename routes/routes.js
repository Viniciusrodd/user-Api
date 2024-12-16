const express = require("express");
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const userController = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');


router.get('/', HomeController.index);

router.post('/user', userController.create);
router.get('/users', adminAuth, userController.findUsers);
router.get('/user/:id', adminAuth, userController.findUsersbyId);
router.put('/user', adminAuth, userController.editUsers);
router.delete('/user/:id', adminAuth, userController.delete);
router.post('/passwordrecover', userController.passwordRecover);
router.put('/changepassword', userController.changePassword);
router.post('/login', userController.login);


module.exports = router;