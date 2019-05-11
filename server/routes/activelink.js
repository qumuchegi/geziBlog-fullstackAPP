var router = require('express').Router();

var model = require('../db');
var activeLinks = model.getModel('activeLinks')
var auth = require('../middleware/user_verify');

router.post('/',auth,(req,res,next) => {
    let {title,link,feel,username,avatar} = req.body
    new activeLinks({
        title,
        link, 
        publisherName: username,
        feel, 
        avatar
    }).save((err)=>{
        if(!err){
            res.json({code:0})
        }
    })
})
router.get('/myalllinks',auth,(req,res,next)=>{
    let {username} = req.query
    activeLinks.find({publisherName:username}, (err,activeLink_s) => {
        if(!err){
            res.json({code:0,data:activeLink_s})
        }
    })
})

router.get('/alllinks',async(req,res,next)=>{
    let page = req.query.page || 1
    console.log('page',page)
    let pageSize = 3
    let offset = pageSize*(page-1)
    let activeLink_s = []
    activeLink_s = await activeLinks.find().skip(offset).limit(pageSize)

    if(activeLink_s.length === 0){
        console.log('没有了')
        res.json({code:1})//没有更多连接了
    }else{
        res.json({code:0,data:activeLink_s})
    }
     
})

module.exports = router