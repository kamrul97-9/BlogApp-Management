const Post = require('../models/post'); //for getting Post of model

exports.getCreatePost = (req, res, next) => { // importing getCreatePost, goto routes/post to import logic, line 6, 8
    const post = {
        title: '',
        author: {
            id: '',
            name: '',
        },
        category: '',
        description: '',
    }
    res.render('user/create_post', {
        singlePost: post,
        update: false,
        title: "Add New Post",
    });
}

exports.postCreatePost = async(req, res, next) => { // importing postCreatePost, goto routes/post to import logic, line 6, 10

    //  console.log(req.body);
    //  res.send("working");
  try {
    const newPost = new Post({
        title: req.body.title,
        author: {
            id: req.user._id,
            name: req.user.name,
        },
        category: req.body.category,
        description: req.body.description,
    });

       await newPost.save();
       res.redirect("/home");

    } catch(err){
        console.log(err);
    }
};



exports.getPost = async(req, res, next) => {

    try{
        const post_id = req.params.post_id;
        // const params = req.params;
        // res.send(params);

        const post = await Post.findById(post_id);
        //res.send(post);
        res.render('user post/singlePost', {singlePost: post});
    } catch (error) {
        console.log(error);
    }
};


exports.getUpdatePost = async(req, res, next) => {
    try{
        const post_id = req.params.post_id;
        const post = await Post.findById(post_id);
        res.render('user/create_post', {
            singlePost: post,
            update: true,
            title:`UPDATE ${post.title}`,
        });

  } catch(error){
        console.log(error);
    }
};



exports.postUpdatePost = async(req, res, next) => {
    try{

        const author = {
            id: req.user._id,
            name: req.user.username
        }

         const update_info = {
               title: req.body.title,
               author: author,
               category: req.body.category,
               description: req.body.description,
           };
           const post_id = req.params.post_id;

          await Post.findByIdAndUpdate(post_id, update_info);
          res.redirect("/home");
    } catch(error) {
        console.log(error);
    }
};

exports.postDeletePost = async(req, res, next) => {

    try{
        const post_id = req.params.post_id;
        await Post.findByIdAndDelete(post_id);
        res.redirect("back");
    } catch(error){
        console.log(error);
    }
}
