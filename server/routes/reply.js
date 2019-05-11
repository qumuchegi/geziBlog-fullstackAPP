var express = require('express');
var router = express.Router();
var model = require('../db');
let users = model.getModel('users')
let blogs = model.getModel('blogs');
let comments = model.getModel('comments');
let replys = model.getModel('replys');
let async = require('async');
const auth = require('../middleware/user_verify');

router.post('/',auth,(req,res,next)=>{
    let {replyContent,commentID,replyerName,now,commentBlogID,replyTo} = req.body
    console.log(replyContent,commentID,replyerName,now,commentBlogID,replyTo)

    async.series([
        cb0 =>{
            replys.findOne({commentID},(err,data)=>{
                if(!data){
                    let replyObjects=[];
                    replyObjects.push({replyContent,replyerName,now,replyTo})
                    new replys({
                        commentID,
                        replyObjects,
                        blogID:commentBlogID
                    }).save((err,data)=>{
                        if(data){
                            console.log('已经保存回复！',data)
                            comments.findOne({_id:commentID},(err,data2)=>{
                                if(data2){
                                    data2.replyID.push(data._id)
                                }
                            })
                            cb0(null,true)
                           
                        }
                    })
                }else{
                    data.replyObjects.push({replyContent,replyerName,now,replyTo})
                    data.save((err,data)=>{
                        if(data){
                            console.log('已经保存回复2！',data)
                            cb0(null,true)


                           
                        }
                    })
                }
            })
        },
        cb1 =>{
            users.findOne({username:replyerName},(err,data)=>{//发送回复后删除未读消息
                if(data){
                    console.log('删除未读消息前：',data.commentNotRead,'要删除的ID：',commentID)
                    data.commentNotRead = data.commentNotRead.filter(e=>e._id!=commentID)//不能用===
                    data.save((err,data3)=>{
                        if(data3) console.log('已经删除未读消息后：',data.commentNotRead)
                        cb1(null,true)
                    })
        
        
                }
            })
        },
        cb2 =>{
            users.findOne({username:replyTo},(err,data)=>{
                if(data){
                    data.replyNotRead.push({commentBlogID,replyFromName:replyerName,replyToName:replyTo,replyContent,now,commentID:commentID})
                    data.save((err,data)=>{
                        if(data){
                            console.log('已经将回复存入对方未读回复数组')
                            cb2(null,true)
                        }
        
                    })
                }else{
                    cb2(null,true)
                    console.log('0000000')
                }
            })
        },
        cb3 =>{
            if(replyerName === replyTo) return cb3(null,true)
            users.findOne({username:replyerName},(err,user)=>{
                if(user){
                    user.replyNotRead = user.replyNotRead.filter(e=>e.replyToName!=replyerName)
                    user.save((err,user)=>{
                        if(!err){
                            cb3(null,true)
                            console.log('已经删除这条未读回复')
                        }
                    })
                }
            })
        }
    ],
    (err,result) => {
        if(result.every(ele => ele === true))
        res.json({code:0})
        
    })

})
router.get('/blogcommentreply',(req,res,next)=>{
    let {blogID} = req.query
    console.log('获取博客的评论的回复',blogID)
    replys.find({blogID},(err,data)=>{
        if(data){
            console.log('博客评论回复',data)
            res.json({code:0,data})
        }
    })

})
router.post('/hadread',auth,(req,res,next)=>{
    let {replyFromName,replyToName} = req.body
    console.log(replyFromName,replyToName)
    users.findOne({username:replyToName},(err,data)=>{
        if(data){
            data.replyNotRead =data.replyNotRead.filter(e=>e.replyFromName!=replyFromName)
            data.save()
            res.json({code:0})
        }
    })
})
 module.exports = router