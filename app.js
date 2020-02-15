
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require("md5");

const app = express();

//console.log(process.env.SECRET);

//use for the bodyParser for working on data ...
app.use(bodyParser.urlencoded({extended : true}));

//use for static files like css---
app.use(express.static('public'));

//Use for ejs template ---
app.set('view engine' , 'ejs');

//Create a connection to MongoDb Database-----
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology : true} );

//this is the Schema for user email and password-----
const userSchema = new mongoose.Schema({
    email :String ,
    password : String
});


const User = new mongoose.model('user' , userSchema);



app.get('/' , (req,res)=> {
   res.render("home");
});


app.get('/login' , (req,res)=> {
    res.render("login");
 });


 app.get('/register' , (req,res)=> {
    res.render("register");
 });
 
 //Post method for the register router
app.post("/register" ,(req,res) => {
    const newUser = new User({
        email : req.body.username ,
        password : md5(req.body.password)
    });

    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else {
            res.render('secrets');
        }
    });
});


//post metnod for the login router-----

app.post("/login" , (req,res)=> {
    const userName = req.body.username;
    //Here we match the md5 fucntio and its match to our dataBase----
    const password = md5(req.body.password);
       
    User.findOne({email : userName} , (err,foundUser)=>{
        if(err) {
            console.log(err);
        }else {
            if(foundUser) {
                if(foundUser.password ===password){
                    res.render('secrets');
                }
            }
        }
    })
});



app.listen(3000 , ()=>{
    console.log("this port is running successfully on - 3000");
});