//importing dependecies, creating route for post section
const express = require('express');
const router = express.Router();

//importing post logics
const postControllers = require('../controlers/post');

// loading middleware
const auth = require("../middlewares/auth");

/*
    @access: Private
    @desc: get user to Create Post form
*/

router.get('/create_new_post',  auth.isAuthenticated, postControllers.getCreatePost);

router.post('/create_new_post', auth.isAuthenticated, postControllers.postCreatePost);

router.get('/post/:post_id',auth.isAuthenticated, postControllers.getPost);

router.get('/post/update/:post_id', auth.isAuthenticated, auth.checkPostOwnership, postControllers.getUpdatePost); //auth.checkPostOwnership,

router.post('/post/update/:post_id', auth.isAuthenticated, auth.checkPostOwnership, postControllers.postUpdatePost); //auth.checkPostOwnership,

router.post('/post/delete/:post_id', auth.isAuthenticated, auth.checkPostOwnership, postControllers.postDeletePost); //auth.checkPostOwnership,

module.exports = router;
