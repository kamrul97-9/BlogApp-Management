//importing dependecies
const express = require('express');
const router = express.Router();

//loading middlewares
const auth = require("../middlewares/auth");


//importing user logic
const userControllers = require('../controlers/user');

router.get(
    "/",
    userControllers.getLandingPage
);

router.get("/home", auth.isAuthenticated, userControllers.getHome);

router.get("/home/:page", auth.isAuthenticated, userControllers.getHome);

router.get("/profile", auth.isAuthenticated, userControllers.getAllviewProfile);

router.get("/profile/:page", auth.isAuthenticated, userControllers.getAllviewProfile);

router.get(
    "/user/userProfile", auth.isAuthenticated, userControllers.getUserViewProfile
);

router.post(
    "/user/update-password",
    auth.isAuthenticated,
    userControllers.postUpdatePassword
);

router.post(
    "/user/update-profile",
    auth.isAuthenticated,
    userControllers.postUpdateProfile
);

router.post(
    "/user/delete-profile",
    auth.isAuthenticated,
    userControllers.postDeleteProfile
);

router.post(
    "/user/update-image",
    auth.isAuthenticated,
    userControllers.postUploadUserImage
);

router.get("/user/userProfile/:user._id", auth.isAuthenticated, userControllers.getuserProfile);

router.get("/user/userNotification", auth.isAuthenticated, userControllers.getNotification);



module.exports = router;
