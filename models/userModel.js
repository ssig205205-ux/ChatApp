const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const validator = require("validator");
const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        index:true
    },
    password:{
        type: String,
        required: true
    }
})


userschema.statics.Singup = async function (name,email,password){
    if(validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)){
        throw Error("All fields must be filled");
    }
    if(!validator.isLength(name,{min:3})){
        throw Error("Name must be at least 3 characters long");
    }
    if(!validator.isEmail(email)){
        throw Error("Email is not valid");
    }
    if(!validator.isLength(password,{min:6})){
        throw Error("Password must be at least 6 characters long");
    }
    const exists = await this.findOne({email});
    if(exists){
        throw Error("Email already use");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    const user = await this.create({name,email,password:hashPassword});
    return user;
} 

userschema.statics.Login = async function (email,password){
    if(validator.isEmpty(email) || validator.isEmpty(password)){
        throw Error("All fields must be filled");
    }
    if(!validator.isEmail(email)){
        throw Error("Email is not valid");
    }
    const user = await this.findOne({email});
    if(!user){
        throw Error("Incorrect email");
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        throw Error("Incorrect password");
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    return token;
}
const User = mongoose.model("User",userschema);
module.exports = User;
