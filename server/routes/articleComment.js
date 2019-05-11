var router = require('express').Router();

var model = require('../db');
let users = model.getModel('users')
let articleComments = model.getModel('articleComments');
var auth = require('../middleware/user_verify');

router.post('/comment',auth,(req,res,next) => {
    let {articleID, username, content,articlePublisher} = req.body
    let replys =[]
    new articleComments({
        articleID, username, content, replys
    }).save((err,data) => {
        if(!err){
             users.findOne({username: articlePublisher}, (err,user) => {
                 user.articleCommentNotRead.push(data)
                 user.save((err) => {
                     if(!err){
                         res.json({code:0}) //保存文章评论并存入
                     }
                 })
             })
        }
    })

})

router.get('/comments',auth,(req,res,next) => {
    let {articleID} = req.query
    console.log(articleID)
    articleComments.find({articleID},(err, comments) => {
        if(!err){
            res.json({code:0, data: comments})
        }
    })
})


module.exports = router