var express = require('express');
var router = express.Router();
var model = require('../db');
let users = model.getModel('users')
let blogs = model.getModel('blogs');
let comments = model.getModel('comments');
const auth = require('../middleware/user_verify');



router.post('/',auth,(req,res,next)=>{
    let { username, pinglunContent,pinglunTime,blogID,publisherID} = req.body;
    console.log( username, pinglunContent,pinglunTime,blogID)
    new comments({
       
        commenterName:username, //评论者名字
        commentContent:pinglunContent,//评论内容
        commentTime:pinglunTime,//评论时间
        commentBlogID:blogID,//所评论博客的ID
        publisherID:publisherID,//所评论的博客主人ID
        //replyID:Array,//该评论被回复的内容数组，每个元素包括回复的ID（下面的回复）
    }).save((err,data)=>{
        if(data){
           let commentASnotread = data
            users.findOne({_id:publisherID},(err,data)=>{//评论存入博客主人 未读消息
                if(data){
                            console.log('找到博客主人，将评论存入他的未读消息')
                            data.commentNotRead.push(commentASnotread)//username是评论人，而不是博客主人
                            data.save((err,data)=>{
                                if(data){
                                    console.log('评论成功存入他的未读消息')
                                }
                            })
                }
            })
            res.json({code:0,data:'评论成功！'})
        }else{
            res.json({code:1})
        }
    })

   
})

router.get('/blogcomment',(req,res,next)=>{
    let {blogID} = req.query
    console.log(blogID)
    comments.find({commentBlogID:blogID},(err,comment_s)=>{
        if(comment_s){
            console.log(comment_s)
            let commentsWithAvatar = [],num=0
            comment_s.forEach((comment,index)=>{
                users.findOne({username: comment.commenterName},(err,user)=>{
                    commentsWithAvatar[index] = {comment,commentAvatar:user.imgAvatar_url}
                    num++;
                    console.log(num)
                    if(num===comment_s.length){
                        res.json({code:0,data:commentsWithAvatar})
                    }
                })
            })
         
        }
    })
})
 
router.get('/mycomment',auth,(req,res,next)=>{
    let {username} = req.query;
    comments.find({commenterName:username},(err,data)=>{
        if(data){
            console.log(data)
            res.json({code:0,data:data})
        }else{
            res.json({code:1,data:'获取我的评论失败'})
        }
    })
})
module.exports = router;