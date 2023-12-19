const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const auth = require("../middleware/auth")
const Blog = require("../models/blogs")
const Comment = require("../models/comment")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./public/uploads/"))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb (null , fileName)
    }
  })
const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user: req.user
    })
})
router.get("/:id",async (req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: req.params.id}).populate(
    "createdBy"
  )
  return res.render("blogs",{
    user : req.user,
    blog,
    comments
  })
})
router.post("/add-new",auth, upload.single("coverImage"), async (req,res)=>{
    const {title,body}  = req.body
     const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImage: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})
router.post("/comment/:blogId", auth, async (req, res) => {
     await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;