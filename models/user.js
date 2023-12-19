const mongoose = require("mongoose");
const bycryptjs = require("bcryptjs");
const { use } = require("../routes/user");
const jwt = require("jsonwebtoken");
const SecretKey = "mynameis$uperman"
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
},{timestamps:true})
// setting middleware for hashing the password
userSchema.pre("save",async function (next){

        if(this.isModified("password")){
            this.password = await bycryptjs.hash(this.password,10)
        }
        next();
})
//Generating token using jsonwebToken
userSchema.methods.generateToken= async function (user){
    const payload ={
        _id:user._id,
        email:user.email
    }
    const token = jwt.sign(payload,SecretKey)
    this.tokens = this.tokens.concat({token:token})
    await this.save();
    return token;
}
const User = mongoose.model("User",userSchema);
module.exports = User;