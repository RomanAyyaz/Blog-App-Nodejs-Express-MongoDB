const express = require("express");
const mongoose = require("mongoose")
const path = require("path")
const app =  express();
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")
const port = 8000;
const Blog = require("./models/blogs")
const UserRouter = require("./routes/user");
const BlogRouter = require("./routes/blog");
const uri = "mongodb://localhost:27017/Blogify"
mongoose.connect(uri).then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
})

app.set('view engine',"ejs");
app.set("views",path.resolve("./views"))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve("./public")))
app.get("/",(req,res)=>{
    res.render("homewithoutuser")
})
app.get("/indexwithuser",auth, async (req,res)=>{
    const allBlogs = await Blog.find({});
     res.render("indexwithuser",{
      user : req.user,
      blogs : allBlogs
    })
})

app.use("/user",UserRouter);
app.use("/blog",BlogRouter);

app.listen(port,(req,res)=>{
    console.log(`listening at port no ${port}`)
})