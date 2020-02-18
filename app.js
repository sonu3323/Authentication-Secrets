
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require   ('passport-local-mongoose');

const app = express();

//console.log(process.env.SECRET);

//use for the bodyParser for working on data ...
app.use(bodyParser.urlencoded({ extended: true }));

//use for static files like css---
app.use(express.static('public'));

//Use for ejs template ---
app.set('view engine', 'ejs');

//Cookies Session -----------------
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized:false 
,
}));

//Passport initialized
app.use(passport.initialize());

app.use(passport.session());


//Create a connection to MongoDb Database-----
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set("useCreateIndex" , true);
//this is the Schema for user email and password-----
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('user', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User . deserializeUser());


app.get('/', (req, res) => {
    res.render("home");
});


app.get('/login', (req, res) => {
    res.render("login");
});


app.get('/register', (req, res) => {
    res.render("register");
});

app.get("/secrets" ,(req,res)=>{
   if(req.isAuthenticated) {
       res.render("secrets");
   }else {
       res.redirect("/login");
   }
});

app.get("/logout" , (req,res)=>{
     req.logout();
     res.redirect("/");
});

//Post method for the register router
app.post("/register", (req, res) => {
    
    User.register({username: req.body.username} , req.body.password ,(err,user)=>{
        if(err) {
            res.redirect("/register");
        }else {
           passport.authenticate("local")(req,res, (err,user)=>{
            res.redirect("/secrets");
           });
          
        }
    });
  


});


//post metnod for the login router-----

app.post("/login", (req, res) => {

    const user =  new User({
        username: req.body.username ,
        password: req.body.password
    });

    req.login(user , (err)=>{
        if(err) {
            console.log(err);
        }else {
           passport.authenticate("local")(req,res ,()=>{
               res.redirect("/secrets");
           });
        }
    });

});



app.listen(3000, () => {
    console.log("this port is running successfully on - 3000");
});