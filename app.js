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

// function encrypted(pwd){
//   bcrypt.genSalt(saltRounds, (err, salt) => {
//     if(err){
//       next(err);
//     }
//     console.log("Salt: ", salt);

//     bcrypt.hash(password, salt, (err, hash) => {
//       if(err){
//         next(err);
//       }
//       console.log("Hash: ", hash);
//     });
//   });    
// };

/* 註冊帳號 */
app.post("/user", async (req, res, next) => {
  console.log('===== [DBG][sign_up] =====');
  let {name, email, password} = req.body;

  try{
    let foundUser = await User.findOne({ email });

    if(foundUser){
      res.status(400).json({
        "error": true,
        "message": "此 Email 已有人使用，請試試其他 Email。"
      });
      // console.log("== user ==", user);
    }else{
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if(err){
          next(err);
        }
        console.log("Salt: ", salt);

        bcrypt.hash(password, salt, (err, hash) => {
          if(err){
            next(err);
          }
          console.log("Hash: ", hash);
          
          let newUser = new User({
            name,
            email,
            password: hash,
          });

          try{
            newUser
            .save()
            .then(() => {
              res.status(200).json({ "ok": true  });
              console.log("== newUser ==", newUser);
            })
          }catch(err){
            next(err);
          }
          
        });
      });  
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



