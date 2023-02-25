const { Router } = require('express');

var authController = require('../controllers/auth-controller');


const router = Router();

router.post('/signup', authController.signUp);
router.post('/signin',  authController.signIn);

module.exports = router;