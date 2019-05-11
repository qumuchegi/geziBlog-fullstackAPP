var router = require('express').Router();

var model = require('../db');
let users = model.getModel('users')
let articleReplys = model.getModel('articleReplys');
let articleComments = model.getModel('articleComments');
const async = require('async');
const auth = require('../middleware/user_verify');

router.post('/reply',auth,(req,res,nest) => {
    let {commentID, from, to, content, articleID,commenter} = req.body;
    console.log('回复comment ID:',commentID, from, to, content,articleID)
    new articleReplys({
        commentID, from, to, content
    }).save((err,newReply) => {
        if(newReply){
            console.log(newReply)
            articleComments.findOne({_id: commentID}, (err,comment) => {
                if(!err){

                    console.log(comment)
                    async.series([
                        cb0 => {
                            comment.replys.push(newReply._id) //将每条评论下的回复 id push到这条评论的 replys 里面
                            comment.save((err) => {
                                if(!err){
                                    cb0(null,true)
                                    // 
                                }
                            })
                        },
                        removeCommentedMessage => {

                            users.findOne({username:to},(err,user) => {
                                if(user){
                                    user.articleCommentNotRead = user.articleCommentNotRead.filter(ele => ele._id != commentID)
                                    user.save((err) => {
                                        if(!err) console.log('文章评论回复后删除被评论人的未读消息')
                                        removeCommentedMessage(null,true)
                                    })
                                }
                            })

                        },
                        removeReplayerMassage => {
                            users.findOne({username: from}, (err,user) => {
                                if(user){
                                    user.articleReplyNotRead = user.articleReplyNotRead.filter(ele => ele.commentID != commentID )
                                    user.save((err) => {
                                        if(!err) console.log('回复后删除被回复人的未读消息')
                                        removeReplayerMassage(null,true)
                                    })
                                }
                            })
                        },
                        cb2 => {
                            users.findOne({username: to}, (err,user) => {
                                user.articleReplyNotRead.push({
                                    from,
                                    articleID,
                                    commenter,
                                    commentID, 
                                    replyID: newReply._id,
                                    content,
                                    hadRead:false
                                })
                                user.save((err,new_user) => {
                                    if(!err){
                                        console.log(new_user.articleReplyNotRead)
                                        cb2(null,true)
                                    }
                                })
                            })

                        }
                    ], (err,result) => {

                        if(result.every(e => e===true)){
                            res.json({code:0, data:newReply})// 成功 将回复入库并存入每条评论
                        }

                    }
                        )
                }
            })
        
        }
    })
})

router.get('/replys',auth,(req,res,next) => {
    let {articleID} = req.query;
    let replysID = []
    let flatReplysID = []
    let replys_res = []
    let num_flatReplysID = 0 //flatReplysID被迭代次数
    async.series([
        cb => {
            articleComments.find({articleID},(err, comments) => {
                if(!err){
                    comments.forEach( comment => {
                        replysID.push(comment.replys)
                    })
                    cb()
                }
            })
        },
        cb => {
            console.log(replysID)
            replysID.forEach(e => {
                e.forEach( ele => {
                    flatReplysID.push(String(ele))
                })
            })
            console.log(flatReplysID)
            //replysID =  Array.prototype.flat.call(replysID)
            flatReplysID.forEach(id => {
                articleReplys.findOne({_id: id}, (err, reply) => {

                    num_flatReplysID ++
                   
                    if(!err){
                        replys_res.push(reply)
                    }else{
                        console.log('没有找到reply')
                    }
                    if(num_flatReplysID === flatReplysID.length){
                        cb()
                    }

                })
            })

        }
    ],
     (err,result) => {
         res.json({code:0,data:replys_res})
     }
        
        
        )
})

module.exports = router

 