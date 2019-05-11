import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import { TopTitleFixed } from '../components/TopTitleFixed';
import api from '../api'
import '../Css/BlogDetails.css'
import uuid from 'uuid';
import {If,Then,Else} from 'react-if';
import { ToastContainer, toast } from 'react-toastify';
import UseHistoryPath from '../components/UseHistoryPath';

var hljs       = require('highlight.js')
var Remarkable = require('remarkable');
var md = new Remarkable({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }
   
      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}
   
      return ''; // use external default escaping
    }
  });
 

class BlogDetails extends Component{
    constructor(props){
        super(props)
        this.state = {
            title:'',
            content:'',
            publisherID:'',
            publisherName:'',
            starsNum:0,
            blogID:'',
            hasZan:false,
            hasShare:false,
            hasPinglun:false,
            pinglun:[],//接收文章的评价
            pinglunContent:'',//我给别人的评价
            replyContent:'',//回复内容
            userAvatar:'',
            addComment:false,//是否要添加评论
            replyCommentID:'',//回复所属的评论ID
            isreply:false,//是否要回复一条评论
            replyTo:'',//要回复的对象的名字
        }
    }
    componentDidMount() {
        //console.log(localStorage['watchAuthors'])
        let blogID = this.props.match.params.blogID
        this.setState({blogID})
        this.fetchABlog(blogID).then(this.fetchPinglun(blogID)).then(this.fetchCommentReply(blogID))
    }
    id2time(id) {
        let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
        return time.toISOString().substr(0,10)
    }
    async fetchABlog(id){
        console.log(id)
        let res = await api.get('/blog/ablog',{blogID:id})
        console.log(res)
        if(res.code === 0){
           //console.log(md.render(res.data.blog.blogContent));
            this.setState({
                title: res.data.blog.blogTitle,
                content: md.render(res.data.blog.blogContent),
                publisherID: res.data.blog.blogPublisherID,
                publisherName: res.data.blog.blogPublisherName,
                blogPublishedTime: this.id2time(res.data.blog._id) ,
                starsNum: res.data.blog.starsNum,
                userAvatar: res.data.userAvatar,
                shareNum: res.data.blog.shareNum
            })
            document.getElementById('content').innerHTML = md.render(res.data.blog.blogContent)
        }
    }
    async fetchPinglun(id){
        let res = await api.get( '/comment/blogcomment', {blogID:id})
        console.log('评论',res)
        if(res.code === 0){
            this.setState({
                pinglun:res.data
            })
        }
    }
    async fetchCommentReply( id ) {
        let res =await api.get('/reply/blogcommentreply', {blogID:id})
        if(res.code === 0){
            console.log('博客评论回复：', res.data)
            this.setState({blogcommentreply: res.data})
        }
    }
    async zan() {
        if( !localStorage[ 'imgAvatar_url' ]) return toast.warn('请先登录')
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`
        let res = await api.post('/user/zan',{ zaner: localStorage['username'],
                                               blogID: this.state.blogID,
                                               time: now,
                                               zanto: this.state.publisherName,
                                               title: this.state.title})
        if(res.code === 0) {
            toast.success('👍',{ autoClose: 2000})
            this.setState(( prevState, props) => ({hasZan: !prevState.hasZan}))//同步更改state
        }
        if(res.code === 2) {
            toast.warn('你已经赞过了',{autoClose:2000})
        }
    }
    
    async share() {
        if( !localStorage['imgAvatar_url']) return toast.warn('请先登录')
        this.setState((prevState,props) => ({hasShare:!prevState.hasShare}))
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`
        let res = await api.post('/user/share',{
                                                blogID: this.state.blogID,
                                                username: localStorage['username'],
                                                time: now,
                                                title: this.state.title
                                            })
        if(res.code === 0){
            toast.success('分享成功',{autoClose:2000})
        }else if(res.code === 3){
            toast.warn('你已经分享过了',{autoClose:2000})
        }
    }
    pinglun() {
        this.setState((prevState, props) => ({hasPinglun: !prevState.hasPinglun}))
        if(!localStorage['username']) return toast.warn('请先登录',{autoClose:1100})
        this.timer = setTimeout(()=>document.getElementById('publish-my-pinglun').scrollIntoView({behavior:"smooth", block:"end"})
        ,200
        )
    }
    async publishPinglun() {
        if(!this.state.pinglunContent) return toast.warn('请输入评论！',{autoClose:2000})
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`
        console.log(now)
        console.log(this.state.pinglun)
        this.setState((prevState,props) => ({pinglun: [...prevState.pinglun,
                                                        {comment: {
                                                                    commenterName: localStorage['username'],
                                                                    commentContent: this.state.pinglunContent,
                                                                    commentTime: now
                                                                  },
                                                        commentAvatar: localStorage['imgAvatar_url']
                                                        }
                                                     ]
                                        }))
        let res = await api.post('/comment',{username: localStorage['username'],
                                            pinglunContent: this.state.pinglunContent,
                                            pinglunTime: now,
                                            blogID: this.state.blogID,
                                            publisherID: this.state.publisherID
                                            }
                                ) 
        console.log(res)
        if(res.code === 0){
            toast.success('评论成功！',{autoClose:2000})
        }else{
            toast.warn('评论失败！',{autoClose:2000})

        }
    }
    async watch(){
        if(!localStorage['_id']) return toast.warn('您还未登录',{autoClose:1200})
        let res = await api.post('/user/watchauthor',{
                                                      watchedID: this.state.publisherID, 
                                                      watcherID: localStorage['_id']})
        if(res.code === 0){
            toast.success('关注成功！',{autoClose:1000})
        }else if(res.code === 1){
            toast.warn('你已经关注过他了！',{autoClose:1000})
        }
    }
    reply(replyTo,commentID) {
        this.showReplyTextarea = setTimeout(()=> this.setState( {
                                                                  isreply: true,
                                                                  addComment: false,
                                                                  replyTo,
                                                                  replyCommentID: commentID}), 400)
       
    }
    async sendReply(){
        let [replyContent, commentID, replyerName, commentBlogID, replyTo] = [
            this.state.replyContent,
            this.state.replyCommentID,
            localStorage['username'],
            this.state.blogID,
            this.state.replyTo
        ]
        console.log(replyContent)
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`
        if(replyContent){
            let res = await api.post('/reply',{replyContent,commentID,replyerName,now, commentBlogID,replyTo})
            if(res.code === 0){
                console.log('回复发送成功')
                toast.success('回复发送成功',{autoClose:2000})
                this.setState({isreply:false, replyContent:''})
            }
        }else{
            toast.warn('请输入回复内容',{autoClose:2000})
        }
    }
    componentWillUnmount(){
        clearTimeout(this.showReplyTextarea)
        clearTimeout(this.timer)
    }
    render(){
    
        return(
            <div id = 'blog-details-big-body'>
             <ToastContainer />
             <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history} name = '博客详情' />
                    </div>
                    {
                        localStorage['imgAvatar_url'] ? 
                        <>
                            <div id='home-avatar'>
                            <img src={'http://localhost:3001/'+localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')} alt='' ></img>
                            </div>
                        </>
                        :
                        <div id='home-not-login'>
                        <Link to={{pathname:'/login'}} style={{textDecoration:'none'}}><span>登录/注册</span></Link>
                        </div>
                    }
              </div>
              <TopTitleFixed title={this.state.title}></TopTitleFixed>
              <div id='blog-details-body'>
              <div id='blog'>
               <h3 id='title'>{this.state.title}</h3>
               <div>
                <div style={{display:'flex',justifyContent:'flex-start'}}>
                  <div id='publisherName'>
                   <Link to={{pathname:'/userpage/'+this.state.publisherID}} style={{ textDecoration: 'none'}}>
                     <img src={'http://localhost:3001/'+this.state.userAvatar.replace(/server\/public\/img\/usersAvatar\//,'')} 
                      alt=''
                      id='blog-details-avatar'>
                     </img>
                     <span>{this.state.publisherName}</span>
                   </Link>
                  </div>
                <div id='publish-time'>发布于{this.state.blogPublishedTime}</div>
                <div id={ localStorage['watchAuthors'] ? Array(localStorage['watchAuthors']).some(e=>e.watchedID===this.state.publisherID) ? 'had-watch':'watch-blog-author' : 'watch-blog-author'} 
                     onClick={this.watch.bind(this)}>关注</div>
                </div>
                <p id='content'>
                   
                </p>
               </div>
              </div>
              <div id='interactions'>
                  <div className='interaction' onClick={()=>this.zan()}>
                    <img src={this.state.hasZan?'../img/zan-active.svg':'../img/zan.svg'} alt='' width='20px'></img>
                    <div>赞 {this.state.starsNum||""}</div>
                  </div>
                   <div className='interaction' onClick={()=>this.share()}>
                   <img src={this.state.hasShare?'../img/share-active.svg':'../img/share.svg'} alt='' width='20px'></img>
                   <div>分享{this.state.shareNum||''}</div>
                  </div>
                  <div className='interaction' onClick={()=>this.pinglun()}>
                   <img src={this.state.hasPinglun?'../img/pinglun-active.svg':'../img/pinglun.svg'} alt='' width='20px'></img>
                   <div>评论{this.state.pinglun.length||''}</div>
                  </div>
              </div>
              <div>
                  <If condition = {localStorage['username']}>
                    <Then>
                    <div id='pinglun-container'>
                        <span>评论区</span>

                        <div id='pinglun-show'>
                        {
                            this.state.pinglun ? 
                            this.state.pinglun.map(pinglun =><div key={uuid()}>
                                <hr/>
                                    <img src ={'http://localhost:3001/'+pinglun.commentAvatar.replace(/server\/public\/img\/usersAvatar\//,'')} alt=''></img>
                                    <span className='pinglun-er'>{pinglun.comment.commenterName}</span>
                                    <span className='pinglun-time'>
                                    {pinglun.comment.commentTime.match(/\d*-\d*-\d*/)}
                                    </span>
                                <span className='reply-button' onClick={()=>this.reply(pinglun.comment.commenterName,pinglun.comment._id)}>回复</span>
                                <div className='pinglun-Content'>
                                    {pinglun.comment.commentContent}
                                </div>
                               
                                <div className='this-comment-reply'>
                                   {
                                       this.state.blogcommentreply ? 
                                       this.state.blogcommentreply
                                       .filter(reply=>reply.commentID===pinglun.comment._id).map(reply=>reply.replyObjects.map(finalReply=><div key={uuid()} className='reply-item'>
                                           <span>{finalReply.replyerName}
                                                 {finalReply.replyerName===this.state.publisherName ? '(作者)':null}
                                                 ->{finalReply.replyTo}{finalReply.replyTo===this.state.publisherName ? '(作者)':null}
                                           </span>
                                           <span style = {{color:'#777',marginLeft:'2%'}}>回复于{finalReply.now.match(/\d*-\d*-\d*/)}</span>
                                           <span className='reply-button' onClick={()=>this.reply(finalReply.replyerName,pinglun.comment._id)}>回复</span>
                                           <p>{finalReply.replyContent}</p>
                                       </div>)
                                           )
                                        :null
                                   }
                                </div>
                                <div className='reply-teatarea'>
                                     {}
                                </div>
                               </div>)
                            :
                            null
                        }
                       
                        </div>
                        <div onClick={()=>this.setState((prevState)=>({addComment:! prevState.addComment,isreply:false }))} >
                        <span id='i-want-to-pinglun'>
                         我要评论 >
                        </span>
                        </div>
                        <div id='publish-my-pinglun'>
                        {
                            localStorage['imgAvatar_url'] ? 
                            this.state.addComment ?
                            <div>
                                <img src={'http://localhost:3001/'+localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')} 
                                     alt=''  
                                     id='avatar-pinglun'>
                                </img>
                                <span>{localStorage['username']}</span>
                                <span onClick={this.publishPinglun.bind(this)} 
                                   className='pinglun-button'>
                                    发布评论
                                </span>
                                <span onClick={()=>this.setState({addComment:false})} 
                                   className='pinglun-button'>
                                    取消
                                </span>
                                <textarea 
                                       id='pinglun-textarea'
                                       placeholder='骚年请发炎' 
                                       rows='10'
                                       onChange={e=>this.setState({pinglunContent:e.target.value})}
                                     >
                                </textarea>
                               
                            </div>
                            :null
                            :
                            <div id = 'no'>
                                        <img src = './img/no3.svg' alt=''></img>
                                        <div>
                                            请先登录
                                        </div>
                            </div>
                        }
                        </div>
                    
                               {
                                   this.state.isreply ?
                                   <div id='send-my-reply'>
                                        <img src={'http://localhost:3001/'+localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')} 
                                             alt=''  
                                             id='avatar-pinglun'>
                                        </img>
                                        <span>  回复  {this.state.replyTo}</span>
                                        <span onClick={()=>this.setState({isreply:false})} 
                                        className='reply-button'>
                                            <i className="fa fa-times" aria-hidden="true"></i>
                                        </span>
                                        <span onClick={this.sendReply.bind(this)} 
                                        className='send-reply-button'>
                                            发送回复
                                        </span>
                                        <textarea 
                                            id='pinglun-textarea'
                                            placeholder='骚年请发炎' 
                                            rows='10'
                                            value={this.state.replyContent}
                                            onChange={e=>this.setState({replyContent:e.target.value})}
                                            >
                                        </textarea>
                                        
                                   </div>
                                   : null
                               } 
                    </div>

                    </Then>
                    <Else>
                        <div id = 'not-login-comment'>
                            <i className = "fa fa-users" aria-hidden="true"></i>
                            <span>登录可查看和参与评论</span>
                        </div>
                    </Else>
                  </If>
              </div>
            </div>
            </div>
        )
    }
}
 
 
export default BlogDetails;

 