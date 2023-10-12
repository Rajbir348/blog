import 'dotenv/config';
import  express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";


const app=express();
const port=3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});

const User= mongoose.model("User",userSchema);



app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/register",(req,res)=>{
    res.render("register.ejs");
});

app.post("/register",async(req,res)=>{
    const user=new User({
        email:req.body.username,
        password:req.body.password
    });
    await user.save();
    res.render("secrets.ejs");
});

app.post("/login",async(req,res)=>{
    console.log(req.body.username);
    console.log(req.body.password);
    const user= User.findOne({email:req.body.username,password:req.body.password});
    console.log(user);
    if(user){
         res.render("secrets.ejs");
    }else{
        res.redirect("/register");
    }
   
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});
