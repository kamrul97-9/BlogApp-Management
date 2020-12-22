
 // importing dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs")
const session = require("express-session");
const flash = require("connect-flash");
const multer = require("multer");
const uid = require("uid");
const MongoStore = require("connect-mongo")(session);


app.use(express.static('public'));

//load models
const User = require("./models/user");
const Post = require("./models/post");

const options = {
    url: "mongodb://localhost:27017/BlogApp",
    collection: "sessions",
    ttl: 24 * 60 * 60,
  };

  app.use(
    session({
      secret: "Chup chupa chup chup",
      resave: false,
      saveUninitialized: true,
      store: new MongoStore(options),
    })
  );

  app.use(async(req, res, next) =>{
      try {
          //check if session has any user attached
          if(!req.session.user){
              return next()
          }
          //console.log(req.session);
          const user = await User.findById(req.session.user._id);
          //console.log(user);
          req.user = user;
          res.locals.currentUser = user; //see line 6
          return next();
      } catch (error) {
          console.log(error);
          next();
      }
  });

//app configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

//flash message configeration
app.use(flash());

app.use((req, res, next) =>{
res.locals.currentUser = req.user;
res.locals.error = req.flash("error");
res.locals.warning = req.flash("warning");
res.locals.success = req.flash("success");
res.locals.info = req.flash("info");

next();
});

//image configuration
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "images"); // see line 11
    },
    filename: (req, file, cb) =>
      cb(null, `${uid()}__${file.originalname}`)
    },
)
const filefilter = (req, file, cb) =>{
    if(
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg'||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/jfif'
    ) {
        cb(null, true); //see 13
    } else {
        cb(null, false); // see 14
    }
};

app.use(
    multer({ storage: fileStorage, fileFilter: filefilter }).single("image")
  );
  app.use("/images", express.static(path.join(__dirname, "images")));

//db config
mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
 });

let db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.log(err);
});

// importing controllers
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

app.use(userRoutes);
app.use(authRoutes);
app.use(postRoutes);


app.get('/terms&conditions', (req, res, next) => {
  res.sendFile(__dirname + "/terms&Conditions.html");
});


app.listen(8081, () => {
  console.log(`Server is running at http://localhost:8081`);
});
