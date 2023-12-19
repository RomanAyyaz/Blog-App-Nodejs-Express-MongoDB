const express = require('express')
const router = express.Router();
const User = require("../models/user")
const bycryptjs = require("bcryptjs");
router.get("/signin",(req,res)=>{
    return res.render("signin")
})
router.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    try {
        if (user && (await bycryptjs.compare(password, user.password))) {
            const token = await user.generateToken(user);
            res.cookie("token", token);
            res.status(201).redirect("/indexwithuser");
        }
        else{
            return res.render("signin",{
                error: "Invalid Login Details try again "
            })
        }
    } catch (error) {
        res.send(error)
    }
});
router.get("/signup",(req,res)=>{
   return res.render("signup")
})
router.post("/signup",async (req,res)=>{
    const {fullname,email,password} = req.body;
    const user = await User.create({
        fullname,
        email,
        password
    })
    const token = await user.generateToken(user);
    res.cookie("token",token);
    res.redirect("/")
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})
module.exports = router;