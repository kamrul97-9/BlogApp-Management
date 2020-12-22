//load models
const User = require("../models/user");
//load libraries
const bcrypt = require("bcryptjs");

exports.getuserLogin = (req, res, next) =>{
    res.render('user/userLogin');
};

exports.getuserSignup = (req, res, next) =>{
    res.render('user/userSignup');
};

exports.postuserLogin = async(req, res, next) => {
    //res.redirect('/home')
    try{
        //find user by username
        const user = await User.findOne({username: req.body.username});
        //console.log(user);
        if(!user){
            req.flash("error", "No user found with this credentials!");
            return res.redirect("back");
        }

        //compare password
        const doPasswordMatch = await bcrypt.compare(
            req.body.password,
            user.password,
        );
        //res.send(doPasswordMatch);
        if (doPasswordMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            await req.session.save();
            return res.redirect("/home");
          }

        req.flash("error", "Username or Passward is not Valid");
         res.redirect("back");
    } catch (error) {
        console.log(error.message);
        res.redirect("back");
    }
};

exports.getuserLogout = async(req, res, next) => {
    await req.session.destroy();
    res.redirect('/');
};
exports.postuserSignup = async (req, res, next) => {
    try{
        //check if user exists.
        const doesUserExist = await User.findOne({username: req.body.username});
        if(doesUserExist){
            req.flash("error", "User with this credintial already exists.");
            //console.log("User with this credintial already exists.");
            return res.redirect("back"); // return dile function akhanei sesh hobe, return na dile response pathabe thikoi kin2 porborti kaj cholte thakbe,,,
        }

        //hashed passward,  package use npm install --save bcryptjs.
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
            gender : req.body.gender,
            country: req.body.country,
        });

        const newUser = await user.save();
        // console.log(newUser);
        req.session.isLoggedIn = true;
        req.session.user = newUser;
        await req.session.save();

        req.flash("info", "Thanks for joining with us");
        res.redirect("/home");

    } catch (error) {
        console.log(error.message);
        res.redirect("back");

    }
};
