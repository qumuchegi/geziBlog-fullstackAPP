const mongoose=require('mongoose');
const db_url = require('./config').db_url

mongoose.connect(db_url,{useNewUrlParser:true},err=>console.log(err))
mongoose.model('users',new mongoose.Schema({
    belongToCollumn:Boolean,//是否属于某一个专栏是的文章，默认false
    username:String,
    password:String,
    selfIntroduction:String,
    sex:String,
    job:String,
    techs:Array,
    blogID:String,
    imgAvatar_url:String,//在数据库里图像只保存路径，图像数据保存在Public/static
    starsFromOthers:Array,//获赞,每个元素包括 【 点赞人的ID 所赞的文章的ID 】 这两部分,包括博客和专栏文章的赞
    starsGiveOthers:Array,//给别人博客的点赞，每个元素包括 【 点赞的文章ID  】，包括博客和专栏文章的赞
    commentNotRead:Array,//未读评论数组，每个元素包括，包括赞和评论，在已读后予以删除，
    
    articleCommentNotRead:Array,
    // ***    未读的 专栏文章的评论，[ {articleTitle, articleID, commentTime, commenterName, commentConten } ]
    replyNotRead:Array,//未读回复数组，每个元素包括该回复 [ 所属博客ID replyFrom的ID replyTo的ID 回复内容 ]

    articleReplyNotRead:Array,
    // ***  专栏文章未读回复数组，[ { articleID, commentID, commenter, from, hadRead(false/true), content } ]
    myShareBlog:Array,//我分享的博客，每个元素包括博客ID，和分享时间
    watchAuthors:Array,//关注的作者数组，每个元素包括关注作者的ID ：[watchedID]
    myColumn:Array,//我创建的专栏数组，[columnID],
    IWatchedColumn:Array,//我关注的专栏，[columnID],这个包括自己创建的和关注的其他人的专利
    IJoinedColumn:Array,//我参与的专栏，[columnID]，这个只包括参与其他人的专栏
}))

 mongoose.model('blogs',new mongoose.Schema({
    isPublished:Boolean,//是否公开，true 公开（默认），false 不公开（自己删除时改为false）
    blogPublisherID:String,
    blogPublisherName:String,
    type:Array,//博客分类，
    blogTitle:String,
    blogContent:String,
    description:String,//博客描述，用于在博客列表中展示
    starsNum:Number,
    shareNum:Number//博客被分享次数
   // pinglun:Array,//评论数组，每个元素包括评论人的 【 名字 评语  评论时间 】三个值

 }))
 mongoose.model('comments',new mongoose.Schema({// 博客下的评论
    
    commenterName:String, //评论者名字
    commentContent:String,//评论内容
    commentTime:String,//评论时间
    commentBlogID:String,//所评论博客的ID
    publisherID:String,//所评论的博客主人ID
    replyID:Array,//该评论被回复的内容数组，每个元素包括回复的ID（下面的回复）
 }))
 mongoose.model('replys',new mongoose.Schema({//博客下面的评论的相互回复内容，包括评论者和回复该评论者的内容
     
     commentID:String,//该回复内容所属的评论的ID
     blogID:String,//该回复所属的博客ID
     replyObjects:Array,//回复内容,包括评论者和回复者的内容，每个元素包括内容制造者（评论者/回复者）名字及其制造内容，时间 3个部分
 }))
 mongoose.model('columns',new mongoose.Schema({//专栏
     name:String,//专栏话题，如JavaScript，则在这个专栏下的所有文章都应该与JavaScript有关
     labels:Array,//专栏标签，搜索专栏或推荐专栏时可以按照标签来查询
     picture:String,//专栏话题图的URL
     description:String,//专栏介绍
     creator:String,//专栏创建者名
     creatorAvatar:String,
     participator:Array,//专栏参与者数组，每个元素包括 参与者的名字、参与时间：[ID、avatar,time]
     article:Array,//专栏下的文章数组，每个元素是 文章的ID
     watcher:Array,//关注此专栏的人数组，每个元素包括 关注者名字、关注时间：[watcherID 、avatar,watcheTime]

 }))
 mongoose.model('articles',new mongoose.Schema({//专栏文章,包括 文章作者、文章标题、内容、发布时间、最后修改时间： [author、title、content、time、lastTime]
     title:String,//
     author:String,
     authorID:String,
     content:String,//
     time:String,
     columnID:String,//所属专栏ID
     praise:Array,//点赞数，[{from,time}],点赞着 和 点赞时间

 }))
mongoose.model('articleComments',new mongoose.Schema({
     
    articleID:String,//评论所属专栏文章的 id
    username:String,//评论人名字
    content:String,//评论内容
    replys:Array,//评论下的各个回复 的 id [articleReplyId]
}))
mongoose.model('articleReplys',new mongoose.Schema({
     
    commentID:String,//回复所属评论的 id
    from:String,//回复人名字
    to:String,//被回复人名字
    content:String,//回复内容

}))
mongoose.model('activeLinks',new mongoose.Schema({// 动态连接分享
    title:String,
    link:String,// 第三方连接
    publisherName:String,
    avatar:String,
    feel:String,//发布者感想
    picture:String,//图片再服务器的路径
}))
module.exports = {
    getModel:function(modelname){
        return mongoose.model(modelname)
    }
} 