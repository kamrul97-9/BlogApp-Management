
//load models
const Post = require('../models/post');
const User = require('../models/user');

//const getAllPost = Post.find({});
//const getAllUser = User.find({});

//load libraries
const bcrypt = require('bcryptjs');
const fs = require('fs');
// loading utilities
const deleteImage = require("../utils/delete-image");

exports.getLandingPage = (req, res, next) => {
    res.render('landing');
};

exports.getHome = async(req, res, next) => {

      try{
      // loading pagination
      const perPage = 2;
      const page = req.params.page || 1;
      let findallpost = {};

   //      //console.log(req.session.isLoggedin);
   //
   //       const posts = await getAllPost.find({})
   //       .skip((perPage * page) - perPage)
   //       .limit(perPage).exec(function(err,data){
   //           if(err) throw err;
   // });
   //       const posts = await getAllPost.find({});
   //        res.render('user/home', {
   //          posts: posts,
   //          current: page,
   //          pages = Math.ceil(count/perPage),
   //        });

   // Fetch books from database
   const posts = await Post
   .find(findallpost)
   .skip((perPage * page) - perPage)
   .limit(perPage)

   // Get the count of total available book of given filter
   const count = await Post.find(findallpost).countDocuments();

   res.render("user/home", {
      posts: posts,
      current: page,
      pages: Math.ceil(count / perPage),
   })
    } catch(error) {
        console.log(error.message);
        res.redirect("back");
    }
};

exports.getHome = async(req, res, next) => {

      try{
      // loading pagination
      const perPage = 2;
      const page = req.params.page || 1;
      const findallpost = {};

   const posts = await Post.find().sort({createdAt:-1})
   .find(findallpost)
   .skip((perPage * page) - perPage)
   .limit(perPage)

   const count = await Post.find(findallpost).countDocuments();

   res.render("user/home", {
      posts: posts,
      current: page,
      pages: Math.ceil(count / perPage),
   });
    } catch(error) {
        console.log(error.message);
        res.redirect("back");
    }
};


exports.getAllviewProfile =async (req, res, next) => {

    try {

          var options ={
          page: req.params.page || 1,
          limit: req.params.limit || 10
        };
        const users = await User.findById(req.user._id);
        //var users = {};
        const user =  await User.find( (err, user) => {
            users[user._id] = user;
        });
        User.paginate({}, options, function(error, result) {
           res.render('user/profile',{
            users: user,
            users: result.docs,
            current: result.page,
            pages: Math.ceil(result.totalDocs / result.limit)
          });
          next();
        });
         //res.send(users);
    } catch (error) {
        console.log(error.message);
        res.redirect("back");
    }
};

exports.getAllviewProfile =async (req, res, next) => {
    try {
          var query = {};
          var options = {
          page: req.params.page || 1,
          limit: req.params.limit || 10
        };
        const users = await User.findById(req.user._id).sort({createdAt:-1})
        //var users = {};
        const user =  await User.find( (err, user) => {
            users[user._id] = user;
        });
        User.paginate(query, options, function(error, result) {
          //console.log(result);
           res.render('user/profile',{
            users: user,
            users: result.docs,
            current: result.page,
            pages: Math.ceil(result.totalDocs / result.limit),
          });
          next();
        });
         //res.send(users);
    } catch (error) {
        console.log(error.message);
        res.redirect("back");
    }
};


// exports.getAllviewProfile =async(req, res, next) => {
//
//     try {
//         const PER_PAGE = 4;
//         const page = req.params.page || 1;
//         const findUser = {};
//
//         //const users = await User.findById(req.user._id)
//         const users = await User
//             .find(findUser)
//             .skip((PER_PAGE * page) - PER_PAGE)
//             .limit(PER_PAGE)
//         //var users = {};
//         const user =  await User.find( (err, user) => {
//             users[user._id] = user;
//         });
//
//         const count = await Post.find(findUser).countDocuments();
//          return res.render('user/profile',{
//            users: user,
//            current: page,
//            pages: Math.ceil(count / PER_PAGE),
//          });
//          next();
//          //res.send(users);
//     } catch (error) {
//         console.log(error.message);
//         res.redirect("back");
//     }
// };

exports.getUserViewProfile = async(req,res, next) =>{
    try {
    console.log(`From getUserViewProfile --> ${req.user}`);
    //console.log(req.user);
    let user = {
        name: req.user.name,
        email: req.user.email,
        gender: req.user.gender,
        username: req.user.username,
        image: req.user.image,
        country: req.user.country,
        createdAt: req.user.createdAt,
    };
        //console.log(user);
        res.render('user/userProfile',{user});
    } catch (error) {
        console.log(error.message);
    }
};


exports.postUpdatePassword = async(req, res, next) =>{
    try {
        const oldPass = req.body.oldPass;
        const newPass = req.body.newPass;
        const confirmNewPass = req.body.confirmNewPass;

        const user = await User.findById(req.user._id);
        const doesPasswordMatch = await bcrypt.compare(oldPass, user.password);
        // const confirmPassMatch = await bcrypt.compare(newPass, confirmNewPass);

        //check all password is correct
        // if((doesPasswordMatch !== oldPass) && (newPass !== confirmNewPass)){
        // req.flash(
        //     "error",
        //     "Nothing is Correct with each other! Please put your correct information");
        //     return res.redirect("back");
        // }

        if(!doesPasswordMatch){
            req.flash("warning","Old Password is incorrect!")
            return res.redirect("back");
        }

        if(oldPass === newPass){
            req.flash(
                "warning",
                "This is Old Password, Please put your new password");
            return res.redirect("back");
        }

         //check newpass and confirmPass
        if(newPass !==confirmNewPass){
            req.flash(
                "error",
                "New Password doesn't match with Confirm Password");
            return res.redirect("back");
        }

        const hashedPassword = await bcrypt.hash(newPass, 12);
        user.password = hashedPassword;
        await user.save();
        req.flash(
            "success",
            "Recently you changed the password! Please Login in to confirm!"
        );
    res.redirect("/");


    } catch (error) {
        console.log(error.message);
        res.redirect("back");

    }
}


exports.postUpdateProfile = async(req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const gender = req.body.gender;
        const address = req.body.address;
        //const country = req.body.country;
        const current_email = req.user.email;
        const user_id = req.user._id;


    // await User.findByIdAndUpdate(current_user, {address, hobby});

    //console.log(name, email, gender, address);

       // check if the user with email already exists
        const user = await User.findOne({email});
        //console.log(user);

        if(user.email !== current_email){
            req.flash("warning", "This email already exists by anohter user!!");
            return res.redirect("back");
        }

        await User.findByIdAndUpdate(user_id, {name, email, gender, address});
        req.flash("success", "Recently you Updated yourself :)");
        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
}

exports.postDeleteProfile = async(req, res, next) =>{
    try {
        await User.findByIdAndDelete(req.user._id);
        req.flash("info", "Thank for being with us so long! For further information, please Sign Up again");
        res.redirect("/");
    } catch (error) {
        console.log(error.message);

    }
};

exports.postUploadUserImage = async(req, res, next) => {
    try {
        let imageUrl;
        const user = await User.findById(req.user._id);
        if (req.file) {
          imageUrl = req.file.filename;
          let previousImage = `images/${req.user.image}`;

          const isImageExist = fs.existsSync(previousImage);
          if (isImageExist) deleteImage(previousImage);
        } else {
            imageUrl = "default.jpg";
    };

        user.image = imageUrl;
        await user.save();
        res.redirect("back");

      } catch (error) {
        console.log(error.message);
        res.redirect("back");
      }
    };

    exports.getuserProfile = async(req, res, next) => {
        
        try{
            const user_id = req.params.user._id;
            
            const user = await User.findById(user_id);
      
            //console.log(user);
            // res.send(user);
            res.render("users/user_profile", {user_profile : user});
      
        } catch (error) {
            console.log(error.message);
        }
      };


    exports.getNotification = (req, res, next) => {
        res.render('user/notification.ejs');
    };
