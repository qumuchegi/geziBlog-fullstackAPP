var express = require('express');
var router = express.Router();
var model = require('../db');
let users = model.getModel('users')
let blogs = model.getModel('blogs')
let articles = model.getModel('articles')
let columns =  model.getModel('columns')
var upload = require('../middleware/multerPicture');
//var upload = multer({ dest: 'public/img/usersAvatar' })
var jwt = require('jsonwebtoken');
const async = require('async');
const auth = require('../middleware/user_verify');
const crypto = require('crypto')
var md5 = crypto.createHash('md5'); 

router.post('/register',function(req,res,next){
    let {   username,
            password,
            selfIntroduction,
            sex,
            job,
            techs,
    } = req.body;
     
    users.findOne({username},(err,data)=>{
        if(data){
            res.json({code:1,data:'已经有相同用户名！'})
        }else{
           
            new users({
                username,
                password,
                selfIntroduction,
                sex,
                job,
                techs
            }
            ).save((err,data)=>{
                if(err){return console.log('入库错误')}
                else {
                    console.log('已经保存注册信息',data)
                    res.json({code:0,data:'已经保存注册信息'})
                }
            })
        }
    })
    }
)
router.post('/avatar',upload('server/public/img/usersAvatar').any(),function(req,res,next){
    let avatar = req.files[0]
    let {username} = req.body
    console.log('avatar',avatar,req.body)
    users.findOne({username},(err,data)=>{
        data.imgAvatar_url = avatar.path//'http://localhost:3001/'+
        data.save((err,data)=>{
            if(err){
                console.log('头像入库出错')
                res.json({code:1,data:'头像入库出错'})
            }else{
                console.log('头像入库成功',data)
                res.json({code:0,data:'头像已经入库'})
            }
        })
    })
})
router.post('/login',function(req,res,next){
    let {username,password} = req.body
    console.log(username,password)
    users.findOne({username},(err,data)=>{
        if(data){
            if(data.password===password){
                    console.log(username+'登录成功！')
                
                    var payload = { username:data.username, exp:Date.now() + 1000 * 60}
                    var secret = '123'
                    var token = jwt.sign(payload,secret,{algorithm:'HS256'})//为成功登录的用户签发token
                    res.json({code:0,data:'登录成功',token,userInfo:data})
                 
            }else{
                console.log('密码错误')
                res.json({code:1,data:'密码错误'})
            }

        }else{
            console.log('用户名不存在')
            res.json({code:2,data:'用户名不存在'})
        }
    })
})
router.get('/mymessage',auth,(req,res,next)=>{
    let {username} = req.query;
    let messageNotRead = {}
 
    users.findOne({username},(err,data)=>{
        if(data){
            // 未读消息改成全部消息，未读和已读 都要在前端显示出来，只是未读消息有一个字段为false表示未读
            messageNotRead.commentNotRead = data.commentNotRead;
            messageNotRead.replyNotRead = data.replyNotRead;
            messageNotRead.starsFromOthers = data.starsFromOthers;
            messageNotRead.articleCommentNotRead = data.articleCommentNotRead;
            messageNotRead.articleReplyNotRead = data.articleReplyNotRead;
 
            res.json({code:0,data:messageNotRead})
        }else{
            res.json({code:1})
        }
    })
})
router.post('/zan',auth,(req,res,next)=>{
    let {zaner,blogID,time,zanto,title} = req.body
    users.findOne({username:zaner},(err,data)=>{//把赞过的文章保存到给赞者自己的信息里
        if(data){
            if(data.starsGiveOthers.some(s=>s.blogID===blogID)){//赞过了
                res.json({code:2})
            }else{
                data.starsGiveOthers.push({blogID,time,title})
                data.save((err,data)=>{
                    if(data){
                        res.json({code:0})
                    }
                })
                users.findOne({username:zanto},(err,data)=>{//把赞的消息送给被赞的人
                    if(data){
                        data.starsFromOthers.push({blogID,time,zaner,title,hasRead:false})
                        data.save()
                    }
                })
                blogs.findOne({_id:blogID},(err,blog)=>{
                    if(blog){
                        blog.starsNum++
                        blog.save()
                    }
                })
            }
        }
    })
    
})
router.post('/readzan',auth,(req,res,next)=>{
    let {reader} = req.body;
 
     
    users.findOne({username:reader},(err,user)=>{
        if(user){ //这里有一个巨坑，修改不了文档里的数组中的hasRead值，下面给出了解决方案
            user.starsFromOthers.forEach(ele => {
                ele.hasRead = true
                 
            })
            user.markModified('starsFromOthers')
            //在 mongoose 中修改嵌套数据时，mongoose 是无法感知到数据变化的，所以调用
            // save（）时不会保存修改，必须调用 markModified 

            user.save((err,data1)=>{
               if(data1) {
                    
                res.json({code:0})
               }else{
                   console.log('修改hasRead错误')
               }

           })
          
        }
    })
 
})
router.get('/myzan',auth,(req,res,next) => {
    let {username} = req.query
    users.findOne({username},(err,user)=>{
        res.json({data:user.starsFromOthers})
    })
})
router.post('/share',auth,(req,res,next)=>{
    let {blogID,username,time,title} = req.body
    users.findOne({username},(err,user)=>{
        if(user){
            if(user.myShareBlog.some(shareBlog=>shareBlog.blogID===blogID)){
                res.json({code:3})
            }else{
                user.myShareBlog.push({blogID,time,title,username})
                user.save((err,data)=>{
                    if(data){
                        res.json({code:0})
                    }else{
                        res.json({code:1})
                    }
                })
                blogs.findOne({_id:blogID},(err,blog)=>{
                    blog.shareNum = blog.shareNum || 0
                    blog.shareNum++
                    blog.save()
                })
            }  
        }else{
            res.json({code:2})
        }
    })

})
router.get('/myshare',auth,(req,res,next)=>{
    let {username} = req.query
    users.findOne({username},(err,user)=>{
        if(user){
            res.json({code:0,data:user.myShareBlog})
        }else{
            res.json({code:1})
        }
    })
})
router.get('/allshare',auth,(req,res,next)=>{
    users.find({},(err,users)=>{
        if(users){
             let data=[]
             users.map(user=>{
                 data.push(...user.myShareBlog)
             })
             res.json({code:0,data})
        }
    })
})
router.get('/userinfo',auth,(req,res,next)=>{
    let {userID} = req.query
    users.findOne({_id:userID},(err,user)=>{
        if(user){
            res.json({code:0,data:user})
        }else{
            res.json({code:1})
        }
    })
})
router.get('/izanedblogs',auth,(req,res,next)=>{
    let {userID} = req.query;
    console.log('获取我赞的博客',userID)
    users.findOne({_id:userID},(err,user)=>{
        if(user){
            let IzanedBlogs = [],num = 0
            //console.log(user.starsGiveOthers.length,user.username)
            user.starsGiveOthers.forEach((star,index)=>{
                blogs.findOne({_id:star.blogID},(err,blog)=>{
                     users.findOne({_id:blog.blogPublisherID},(err,user2)=>{
                        num++
                        console.log('获取我赞的博客',num)
                         IzanedBlogs[index] = {blog:blog,username:user2.username,userAvatar:user2.imgAvatar_url}
                         if(num===user.starsGiveOthers.length){
                            console.log(IzanedBlogs)
                            res.json({code:0,data:IzanedBlogs})
                        } 
                     })
                })

            })

        }
    })
})
router.post('/watchauthor',auth,(req,res,next)=>{
    let { watchedID , watcherID} = req.body;
    users.findOne({_id:watcherID},(err,user)=>{
        if(user){
            if(user.watchAuthors.some(e=>e.watchedID===watchedID)){//关注过了
                res.json({code:1})
                return
            }
            user.watchAuthors.push({watchedID})
            user.save((err,data)=>{
                if(data) {
                    res.json({code:0})
                }
            })
        }
    })

})
router.get('/mywatch',auth,(req,res,next)=>{
    let { userID } = req.query;
    users.findOne({_id:userID},(err,user)=>{
        if(user){
            let watchedAuthors = [],num=0
            user.watchAuthors.forEach((e,i)=>{
                users.findOne({_id:e.watchedID},(err,usr)=>{
                    num++
                    watchedAuthors[i] = {avatar:usr.imgAvatar_url,name:usr.username,job:usr.job,praise:usr.starsFromOthers,id:usr._id}
                    if(num===user.watchAuthors.length){
                        res.json({code:0,data:watchedAuthors})
                    }
                })
            })
        }
    })
})

 
module.exports = router;