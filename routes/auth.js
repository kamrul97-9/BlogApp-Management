const express = require('express');
const router = express.Router();

//importing auth controllers
const authControllers = require('../controlers/auth');

router.get('/auth/userlogin', authControllers.getuserLogin);

router.post('/auth/userlogin', authControllers.postuserLogin);

router.get('/auth/usersignup', authControllers.getuserSignup);

router.post('/auth/usersignup', authControllers.postuserSignup);

router.get('/auth/userlogout', authControllers.getuserLogout);



module.exports = router;
