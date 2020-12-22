const Post = require("../models/post");


exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      req.flash("error", "Unauthorized access");
      return res.redirect("back");
    }
    next();
  };




  exports.checkPostOwnership = async(req, res, next) => {
    const post = await Post.findById(req.params.post_id);

    if (req.user._id.toString() === post.author.id.toString()) {
      next();
    } else {
      req.flash("warning", "You can't edit others post except yours");
      res.redirect("back");
    }
  };
