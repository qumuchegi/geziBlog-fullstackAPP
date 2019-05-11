var express = require('express');
var router = express.Router();
var model = require('../db');
let users = model.getModel('users')
let blogs = model.getModel('blogs')
var columns = model.getModel('columns')
var upload = require('../middleware/multerPicture');
var articles = model.getModel('articles')
const async = require('async');
const auth = require('../middleware/user_verify');


router.post('/create',auth,(req,res,next)=>{
    let {
        columnName,
        creator,
        creatorID,
        description,
        creatorAvatar,
        labels,
        now } = req.body
    columns.findOne({name:columnName},(err,column)=>{
        if(!column){
            let participator = []
            participator.push({username:creator,creatorID,avatar:creatorAvatar,time:now})
            new columns({
                name:columnName,
                labels,
                description,
                creator,
                creatorAvatar,
                participator,
                watcher:participator
            }).save((err,newColumn)=>{
                if(!err) {
                    users.findOne({username:creator},(err,user)=>{
                        if(user){
                            user.myColumn.push(newColumn._id)
                            user.save((err,saveUser)=>{
                                res.json({code:0,data:{columnID:newColumn._id}})
                            })
                        }
                    })
                }
                else res.json({code:1})
            })
        }else{
            res.json({code:2})
        }
    })
})
router.post('/picture',auth,upload('server/asset/columnTopImg').any(),(req,res,next)=>{
    let {creator,columnID} = req.body
    let file = req.files[0]
    console.log(creator,file)
    columns.findOne({creator:creator,_id:columnID},(err,column)=>{
        if(column){
            column.picture = file.path
            column.save((err,saveColumn)=>{
                if(!err) res.json({code:0})
            })
        }
    })

})
router.get('/usercolumn',(req,res,next)=>{
    let {username} = req.query;
    console.log(username)
    //let column_Created_OR_Joined = []
    //返回自己创建的和参与,在数组类型的字段里查询某一个元素 $elemMatch
    columns.find({participator:{$elemMatch:{username}}},(err,column_s) => {
        if(err){
            console.log('mongodb不支持数组内元素查询')
        }else{
            console.log('mongodb支持数组内元素查询',column_s)
            res.json({code:0, data:column_s})
        }
    })
})
router.get('/allcolumns',(req,res,next)=>{
    columns.find({},(err,columns)=>{
        if(!err){
            res.json({code:0,data:columns})
        }else{
            res.json({code:1})
        }
    })
})
router.get('/acolumn',(req,res,next)=>{
    let {columnID} = req.query;
    columns.findOne({_id:columnID},(err,column)=>{
        if(!err){
            res.json({code:0,data:column})
        }else{
            res.json({code:1})
        }
    })
})
router.get('/watchedcolumns',(req,res,next) => {
    let {username} = req.query;
    columns.find({watcher:{$elemMatch:{username}}}, (err,column_s) => {
        if(!err){
            res.json({code:0, data:column_s})
        }
    })
})
router.post('/article',auth,(req,res,next) => {
    let {title,author,authorID,content,time,columnID} = req.body;

    new articles({
        title,author,authorID,content,time,columnID
    }).save((err,article) => {
        if(article){
            console.log('文章保存成功')
            columns.findOne({_id:columnID},(err,column) => {
                column.article.push(article._id)
                column.save((err,data) => {
                    if(data){
                        res.json({code:0})
                    }
                })
            })
     
        }
    })
})
router.get('/article',(req,res,next) => {
    let {articleID} = req.query;
    articles.findOne({_id:articleID},(err,article) => {
        if(article){
            res.json({code:0,data: article})
        }
    })
})
router.get('/myallarticles',auth,(req,res,next) => {
    let {username} = req.query;
    articles.find({author:username}, (err,article_s) => {
        if(!err){
            res.json({code:0, data:article_s})
        }
    })
})
router.post('/articlepicture',upload('server/asset/columnarticlePicture').any(),(req,res,next) => {
    let {username} = req.body
    let articlePicture = req.files[0]
    console.log(articlePicture,username)
    res.json({code:0 ,data:{path:articlePicture.path}})

})
router.get('/columnarticle',(req,res,next) => {
    let {columnID} = req.query;
    var article_res = [];
 
    async.series([
        cb => {
            articles.find({columnID},(err,article_s) => {
                if(!err){
                    article_s.forEach(e => article_res.push(e))
                    cb(null)
                    //res.json({code:0, data:article_s})
                }
                else{
                    res.json({code:1})
                }
            })
        },
        cb => {
            let iterateNum  = 0
            article_res.forEach(article => {
              // 下面这段增加 头像 字段的逻辑无法起作用， 原因是不能增加对象属性，但是不知道这是为什么
                users.findOne({username:article.author},(err,user) => {
                    //console.log(typeof article)
                    iterateNum ++
                    article.s = 0
                    article.authorAvatar = user.imgAvatar_url//authorAvatar不是article模型的字段，前端需要而加的
                    //console.log(article_obj)
                    if(iterateNum === article_res.length){
                        console.log('1221')
                        cb(null)//只有在遍历完article_res异步查询完之后才回调
                    }
                })
            })
            //console.log('增加authorAvatar:',article_res)
        }
    ],
        (err,result)=>{
            console.log('返回最后结果',article_res)
            res.json({code:0,data:article_res})
        })
})
router.post('/watchcolumn',auth,(req,res,next) => {
    let {username,avatar,time,columnID} = req.body
    columns.findOne({_id: columnID}, (err,column) => {
        if(column){
            if(column.watcher.some(e => 
                e.username === username
            )) return res.json({code: 1})//已经关注过

            column.watcher.push({username, avatar, time})
            column.save((err,data) => {
                if(!err){
                    users.findOne({username},(err,user) => {
                        user.IWatchedColumn.push(columnID)
                        user.save((err,data) => {
                            if(data){
                                res.json({code: 0})
                            }
                        })
                    })
                }
            })
        }
    })
})
router.post('/join',auth,(req,res,next) => {
    
    let {username,avatar,time,columnID,creatorID} = req.body
    columns.findOne({_id:columnID},(err,column) => {
        if(!err){
            if(column.participator.some(e => 
                e.username === username
            )) return res.json({code: 1})//已经参与过

            column.participator.push({username,creatorID, avatar, time})
            column.save((err,data) => {
                if(!err){
                    users.findOne({username},(err,user) => {
                        if(user){
                            user.IJoinedColumn.push(columnID)
                            user.save((err) => {
                                if(!err){
                                    res.json({code: 0})
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;