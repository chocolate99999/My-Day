require('dotenv').config();
const express      = require("express");
const app          = express();
const ejs          = require("ejs");
const mongoose     = require("mongoose");
const bodyParser   = require("body-parser");
const User         = require("./models/user");
const cookieParser = require('cookie-parser'); 
const session      = require('express-session');
const flash        = require('connect-flash');
const bcrypt       = require('bcrypt');
const saltRounds   = 10;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cookieParser(process.env.SECRET));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

mongoose.connect("mongodb://localhost:27017/examples", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> {
  console.log("Successfully connected to mongoDB.");
}).catch((error) => {
  console.log("Connection failed.");
  console.log(error);
});

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("Welcome to the homepage.");
});

app.get("/verifyUser", (req, res) => {
  req.session.isVerified = true;
  res.send("You are verified.");
});

app.get("/secret", (req, res) => {
  if(req.session.isVerified === true){
    res.send("Here is my secret - so far so good.");
  }else{
    res.status(403).send("You are not authorized to see my secret.");
  }
});

app.get("/user", (req, res) => {
  res.render("index.ejs");
});

/* 註冊帳號 */
app.post("/user", (req, res) => {
  console.log('===== [DBG][sign_up] =====');
  let {name, email, password} = req.body;
  User.findOne({ email }).then((user) => {
    if(user){
      res.status(400).json({
        "error": true,
        "message": "此 Email 已有人使用，請試試其他 Email。"
      });
      // console.log("== user ==", user);
    }else{
      let newUser = new User({
        name,
        email,
        password,
      });
      newUser
      .save()
      .then(() => {
        res.status(200).json({ "ok": true  });
        // console.log("== newUser ==", newUser);
        // 考慮導向登入表單?!
      })
      .catch((e) => {
        res.status(500).json({
          "error": true,
          "message": "伺服器內部錯誤。"
        });
        console.log(e);
      });
    }
  });
});

app.get("/*", (req, res) => {
  res.status(404).send("404 Page not found.");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something is broken. We will fix it soon.");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});



// let { name } = req.cookies;
// console.log('Cookies: ', req.cookies);

// res.cookie("address", "Hawaii st.", { signed: true });
// console.log('signedCookies: ', req.signedCookies);
// res.send("Cookie has been send.");
// let { address } = req.signedCookies;
// res.send("Welcome to the homepage. Your address is " + address);

// req.flash("success_msg", "Successfully get to the homepage.");
// res.send("Hi, " + req.flash("success_msg"));