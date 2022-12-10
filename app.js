require('dotenv').config();
const express        = require("express");
const app            = express();
const ejs            = require("ejs");
const mongoose       = require("mongoose");
const bodyParser     = require("body-parser");
const User           = require("./models/user");
const UserList       = require("./models/userList");
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
app.use(flash());
app.use(methodOverride('_method'));
app.use(cookieParser(process.env.SECRET));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

mongoose.connect("mongodb://0.0.0.0:27017/examples", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> {
  console.log("Successfully connected to mongoDB.");
}).catch((error) => {
  console.log("Connection failed.");
  console.log(error);
});

app.get("/", (req, res) => {
  // console.log('Cookies: ', req.cookies);
  console.log('首頁 SessionID:', req.sessionID); 
  res.render("index");
});

app.get("/dayPlan/:time", (req, res) => {
  console.log("路由: /dayPlan/:time");
  console.log("req.params:", req.params);
  console.log("time:", req.params.time);
  res.render("todolist");
});

/* 取得當前登入的使用者資訊 */
app.get("/api/user", (req, res, next) => {
  try{ 
    // console.log("req.session.user", req.session.user);
    if(req.session.user){
      res.status(200).json({
        "data": {
          "id": req.session.user._id,
          "name": req.session.user.name,
          "email": req.session.user.email
        }
      });
      console.log("已驗證 SessionID", req.sessionID);  
    }else{
      res.json({
        "data": null  
      }); 
      console.log("未驗證 SessionID", req.sessionID);
      console.log("未驗證 Session", req.session);
    }
  }catch(err){
    next(err);
  }  
});

/* 登入 */
app.patch("/api/user", async (req, res, next) => {
  console.log('===== [DBG][Sign_In] =====');
  let {name, email, password} = req.body;

  try{
    let foundUser = await User.findOne({ email });
    // console.log("登入", foundUser);

    if(foundUser){
      bcrypt.compare(password, encrypted(password), (err, result) => {
        if(err){
          next(err);
        }
        if(result === true){
          req.session.user = foundUser;
          res.status(200).json({
            "ok": true
          });
          console.log("已登入 Session", req.session);
          console.log("已登入 SessionID", req.sessionID);
        }else{
          res.status(400).json({
            "error": true,
            "message": "Email 或 密碼，輸入錯誤"
          });
          console.log("未登入 Session", req.session);
          console.log("未登入 SessionID", req.sessionID);
        }
      });
    }else{
      res.status(400).json({
        "error": true,
        "message": "Email 或 密碼，輸入錯誤"
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
app.post("/api/user", async (req, res, next) => {
  console.log('===== [DBG][Sign_Up] =====');
  let {name, email, password} = req.body;

  try{
    let foundUser = await User.findOne({ email });
    // console.log('註冊:', foundUser);

    if(foundUser){
      res.status(400).json({
        "error": true,
        "message": "此 Email 已有人使用，請試試其他 Email。"
      });
      // console.log("== foundUser ==", foundUser);
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

/* 登出 */
app.delete("/api/user", (req, res, next) => {
  console.log('===== [DBG][Sign_Out] =====');
  try{
    req.session.destroy();
    res.status(200).json({
      "ok": true
    });
    console.log("登出 Session", req.session);
    console.log("登出 SessionID", req.sessionID);
  }catch(err){
    next(err);
  }
});

/* [API] 取得當天日期的代辦清單 */
app.get("/api/dayPlan", (req, res, next) => {
  console.log('===== [DBG][Date_Todolist] =====');
  // res.render("todolist");
	
  res.status(200).json({
    "data": {
      "year": 2022,
      "month": 12,
      "day": 5,
      "todolist": {
        "hours": 15,
        "minutes": 30,
        "item": "跟同事胖橘喵喝下午茶"
      }
    }
  });
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



