const express        = require("express");
const app            = express();
// 載入相關模組
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User          = require("../models/user");

// 初始化 Passport 模組
app.use(passport.initialize());
app.use(passport.session());

// 設定本地登入策略
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
    }, 
    (email, password, done) => 
    {   
        User.findOne({ email }, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password !== password) { return done(null, false); }
            return done(null, user);
        });
    }
));

// 設定序列化與反序化
passport.serializeUser((user, done) => {
    console.log("Serializing user now");
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    console.log("Deserializing user now");
    User.findById({ _id }).then((user) => {
        console.log("Found user.");
        done(null, user);
    });
});



// // middleware
// app.use(
//     cookieSession({
//       keys: [process.env.SECRET],
//       resave: false,
//       saveUninitialized: false,
//     })
// );





    
    
    

