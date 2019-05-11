var express = require('express');
var router = express.Router();
var model = require('../db');
let users = model.getModel('users')
let blogs = model.getModel('blogs');
var upload = require('../middleware/multerPicture');
var auth = require('../middleware/user_verify')
 

router.post('/picture',auth,upload('server/asset/blogImg').any(),(req,res,next)=>{//接收博客编辑中的图片
    let blogPicture = req.files[0]
    let username = res.body
    console.log(blogPicture,username)
    res.json({code:0,data:{pictureURL:blogPicture.path}})

})
router.delete('/picture',(req,res,next)=>{//用户在编辑博客时若删除了图片，那么后端也一个删除接收的图片，涉及到Node怎么删除一个文件

})
router.post('/publish',auth,(req,res,next)=>{
    let {username,userID,blogContent,title,type} = req.body;
    console.log(type)

    new blogs({
        isPublished:true,//默认公开
        blogPublisherID:userID,
        blogPublisherName:username,
        blogContent:blogContent,
        blogTitle:title,
        starsNum:0,
        type
    }).save((err,data)=>{
        if(data){
            console.log('成功保存博客内容')
            res.json({code:0,data:'成功发布博客内容'})
        }
    })
})
router.get('/getall', async (req,res,next)=>{
    
    let page = req.query.page || 1
    console.log('page',page)
    let pageSize = 5
    let offset = pageSize*(page-1)
    let blog_s = []
 
    blog_s = await blogs.find({isPublished:true}).skip(offset).limit(pageSize)
     if(blog_s.length===0){   //不能用blog_s===[],不知道为什么
       // console.log('没有更多博客')
        res.json({code:1})   //没有更多博客
        return 
    }else{
         
        console.log('里面',offset)
        let blogsWithUserInfo = [],num = 0
        blog_s.reverse().forEach((blog,index) => {
            users.findOne({_id:blog.blogPublisherID},(err,user)=>{
                num++
                if(num<blog_s.length){
                    blogsWithUserInfo[index] = {blog:blog,username:user.username,userAvatar:user.imgAvatar_url}
                }else{
                    blogsWithUserInfo[index] = {blog:blog,username:user.username,userAvatar:user.imgAvatar_url}
                    console.log('1')
                    res.json({code:0,data:blogsWithUserInfo})
                }
            })
        });
    } 
    
})
router.get('/ablog',(req,res,next)=>{
    let {blogID} = req.query
    console.log(blogID)
    let blogInfo = {}
    blogs.findOne({_id: blogID},(err,blog)=>{
        if(blog){
            users.findOne({_id:blog.blogPublisherID},(err,user)=>{
                blogInfo.userAvatar = user.imgAvatar_url
                blogInfo.blog = blog
                res.json({code:0,data:blogInfo})
            })
        }else{
            res.json({code:1,data:'查找我的博客错误'})
        }
    })
})
router.get('/myblogs',auth,(req,res,next)=>{
    let {userID} = req.query
    blogs.find({blogPublisherID:userID},(err,blog_s)=>{
        if(blog_s){
            let blogsWithUserInfo = [],num = 0
            blog_s.reverse().forEach((blog,index) => {
                users.findOne({_id:blog.blogPublisherID},(err,user)=>{
                    num++
                    if(num<blog_s.length){
                        blogsWithUserInfo[index] = {blog:blog,username:user.username,userAvatar:user.imgAvatar_url}
                    }else{
                        blogsWithUserInfo[index] = {blog:blog,username:user.username,userAvatar:user.imgAvatar_url}
                        console.log('1')
                        res.json({code:0,data:blogsWithUserInfo})
                    }
                })
            });
        } 
        
    })
    
})
router.get('/atype',(req,res,next)=>{
    let {type} = req.query
    blogs.find({type},(err,blog_s)=>{//type原本在数据库是一个数组，但是find居然能够匹配数组里的一个元素，mongodb还是强大！！！
        
            if(blog_s){
                let blogsWithUserInfo = [],num = 0
                blog_s.reverse().forEach((blog,index) => {
                    users.findOne({_id:blog.blogPublisherID},(err,user)=>{
                        num++
                        if(num<blog_s.length){
                            blogsWithUserInfo[index] = {blog:blog,username:user.username,userAvatar:user.imgAvatar_url}
                        }else{
                            blogsWithUserInfo[index] = {blog:blog,username:user.username,userAvatar:user.imgAvatar_url}
                            console.log('1')
                            res.json({code:0,data:blogsWithUserInfo})
                        }
                    })
                });
            }
    })

})

router.post('/remove',auth,(req,res,next) => {
    let {blogID} = req.body
    blogs.findOne({_id:blogID},(err,blog) => {
        if(!err){
            blog.isPublished = false
            blog.save((err) => {
                if(!err){
                    res.json({code:0})
                }
            })
        }
    })
})
router.post('/removetopublish',auth,(req,res,next) => {
    let {blogID} = req.body
    blogs.findOne({_id:blogID}, (err,blog) => {
        if(!err){
            blog.isPublished = true
            blog.save((err) => {
                if(!err){
                    res.json({code:0})
                }
            })
        }
    })
})

router.post('/modify',auth,(req,res,next) => {
    let {content,title,blogID,isdraft} = req.body
    blogs.findOne({_id:blogID},(err,blog) => {
        if(!err){
            blog.blogContent = content
            blog.blogTitle = title
            if(isdraft){
                blog.isPublished = false
            }else{
                blog.isPublished = true
            }
            blog.save((err) => {
                if(!err){
                    res.json({code:0})
                }
            })
        }
    })
})
 
module.exports = router;