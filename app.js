require('dotenv').config();
const express        = require("express");
const app            = express();
const ejs            = require("ejs");
const mongoose       = require("mongoose");
const bodyParser     = require("body-parser");
const User           = require("./models/user");
const cookieParser   = require('cookie-parser'); 
const session        = require('express-session');
const flash          = require('connect-flash');
const bcrypt         = require('bcrypt');
const saltRounds     = 10;
const methodOverride = require("method-override");

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
app.use(methodOverride('_method'));

mongoose.connect("mongodb://0.0.0.0:27017/examples", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> {
  console.log("Successfully connected to mongoDB.");
}).catch((error) => {
  console.log("Connection failed.");
  console.log(error);
});

app.get("/", (req, res) => {
  console.log('Cookies: ', req.cookies);
  res.render("index");
});

app.get("/user", (req, res) => {
  // console.log("Session", req.session);
  
  if(req.session.isVerified === true){
    res.render("index");
  }else{
    res.status(403).send("You are not authorized to see my secret.");
  }
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

/* 登入 */
app.patch("/user", async (req, res, next) => {
  console.log('===== [DBG][Sign_In] =====');
  let {name, email, password} = req.body;

  try{
    let foundUser = await User.findOne({ email });
    console.log("登入", foundUser);

    if(foundUser){
      bcrypt.compare(password, encrypted(password), function(err, result) {
        if(err){
          next(err);
        }
        if(result === true){
          res.status(200).json({
            "ok": true
          });
        }else{
          res.status(400).json({
            "error": true,
            "message": "Email或密碼，輸入錯誤"
          });
        }
      });
    }else{
      res.status(400).json({
        "error": true,
        "message": "Email或密碼，輸入錯誤"
      });
    }
  }catch(err){
    next(err);
  } 
    
});

/* 加密 */
function encrypted(password){
  const hash = bcrypt.hashSync(password, saltRounds);
  password   = hash;
  // console.log("Hash: ", hash);
  return password; 
};
// console.log("Encrypted :", encrypted('123456'));


/* 註冊 */
app.post("/user", async (req, res, next) => {
  console.log('===== [DBG][Sign_Up] =====');
  let {name, email, password} = req.body;

  try{
    let foundUser = await User.findOne({ email });
    console.log('註冊:', foundUser);

    if(foundUser){
      res.status(400).json({
        "error": true,
        "message": "此 Email 已有人使用，請試試其他 Email。"
      });
      // console.log("== user ==", user);
    }else{
      let newUser = new User({
        name,
        email,
        password: encrypted(password),
      });
      newUser
      .save()
      .then(() => {
        res.status(200).json({ "ok": true  });
        // console.log("== newUser ==", newUser);
      }) 
    }
  }catch(err){
    next(err);
  }      
});

app.get("/*", (req, res) => {
  res.status(404).send("404 Page not found.");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    "error": true,
    "message": "伺服器內部錯誤。"
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});



