import React,{Component} from 'react';
import api from '../api';
import '../Css/Message.css';
import {Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { If, Then, Else, When } from 'react-if';
import { TopTitleFixedWithTab } from '../components/TopTitleFixedWithTab';
import UseHistoryPath from '../components/UseHistoryPath';
import {store} from '../Redux/Reducers/index';
import {cache_article,delete_article} from '../Redux/Actions/cacheArticle';
import uuid from 'uuid'

class Message extends Component{
    constructor(props){
        super(props)
        this.state={
            notReadComments:[],
            notReadReplys:[],
            notReadArticleComments:[],
            notReadArticleReplys:[],
            starsFromOthers:[],
            indexisReply:-1,//博客评论的回复
            indexisReply_column:-1,//专栏文章评论的回复
            replyContent:'',
            
            show:'评论我的'
        }
    }
    UNSAFE_componentWillMount(){
        this.setState({show:`评论我的${ Number(this.state.notReadArticleComments.length) + Number(this.state.notReadComments.length)}`})
    }
    componentDidMount(){
        this.fetchMyMessage()
    }
    
    id2time(id) {
        let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
        return time.toISOString().substr(0,10)
    }
    async fetchMyMessage(){
        let res = await api.get('/user/mymessage',{username:localStorage['username']})
        if(res.code===0){
            console.log(res.data)
            this.setState({
                notReadComments:res.data.commentNotRead,//blogID,pinglunContent,pinglunTime,username
                notReadReplys:res.data.replyNotRead,
                starsFromOthers:res.data.starsFromOthers,
                notReadArticleComments:res.data.articleCommentNotRead,
                notReadArticleReplys:res.data.articleReplyNotRead
            })

        }
    }
    async sendReply(replyContent,commentID,replyerName,commentBlogID,replyTo){
        console.log(replyContent)
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`
        if(replyContent){
            let res = await api.post('/reply',{replyContent,commentID,replyerName,now, commentBlogID,replyTo})
            if(res.code===0){
                console.log('回复发生成功')
                toast.success('回复发生成功',{autoClose:2000})
            }
            this.setState({indexisReply:-1})
            this.setState({replyContent:null})
        }else{
            toast.warn('请输入回复内容',{autoClose:2000})
        }
    }
    async  sendReply1(commentID, replyTo, articleID, commenter){
        //setReplyCommentID(-1)
        if(!this.state.replyContent) return toast.warn('请输入回复内容',{autoClose:1200})
        if(!localStorage['username']) return toast.warn('请先登录',{autoClose:1200})
        
          let [from, to, content ] = [localStorage['username'], replyTo, this.state.replyContent ]
          let res = await api.post('/articleReply/reply',{commentID, from, to, content, articleID, commenter})
          if(res.code === 0){
                 
                toast.success('回复发送成功',{autoClose:1200})
                this.setState({indexisReply:-1})
                this.setState({replyContent:null})
              
          }
    }
    async hadReadReply( replyFromName, replyToName){
        this.setState({notReadReplys: []})
        let res = await api.post('/reply/hadread', { replyFromName, replyToName })
        if(res.code === 0){
            toast.success( '已读删除', {autoClose:2000})
        }

    }
    async hadReadZan(){
        let allStarsFromOthers = [...this.state.starsFromOthers]// 拷贝对象
        allStarsFromOthers = allStarsFromOthers.filter(e=>e.hasRead === true)
        this.setState({ starsFromOthers:allStarsFromOthers})
        let res = await api.post( '/user/readzan',{ reader:localStorage['username']})
        if(res.code === 0){
            toast.success('已读',{autoClose:1000})
        }
    }
    changeShow(type){
        this.setState({show:type})

    }
    async toArticleDetails(articleID){
        console.log(articleID)
        let res = await api.get('/column/article',{articleID})
        if(res.code === 0){
            let article = res.data
            await store.dispatch(cache_article(article,article._id))
            this.props.history.push('/articledetails')
        }
       
    }
    render(){
        let i = 0,j = 0,o = 0,p = 0, y = 0
        return (
            <div id = 'message-big-body'>
                <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history} name = '我的消息'/>
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
                <TopTitleFixedWithTab title = '消息' 
                                      tabs = {
                                          [`评论我的${ Number(this.state.notReadArticleComments.length) + Number(this.state.notReadComments.length)} `,
                                            `收到赞${ Number(this.state.starsFromOthers.length)}`,
                                            `回复我的${ Number(this.state.notReadArticleReplys.length) + Number(this.state.notReadReplys.length)}`
                                        ] } 
                                      changeShow = {this.changeShow.bind(this)} 
                                      selected = {this.state.show}></TopTitleFixedWithTab>
                <ToastContainer/>
                 
                <div id = 'message-body'>
                <If condition = {this.state.show.search(/评论我的/) !== -1}>
                 <Then>
                 <div id = 'comment-not-read'>
                   <div>
                      
                       <h3 style={{backgroundColor:'rgba(169,163,219)',color:'white'}}>博客评论</h3>
                      
                       {

                      this.state.notReadComments.length !== 0 ? 
                      this.state.notReadComments.map((comment,index)=><div key={i ++} className = 'comment-item'>
                        <div className = 'comment-owner'>
                          <img src = './img/user1.svg' alt=''></img>
                          <div>{comment.commenterName}</div>
                          <div className = 'time-comment'>评论于{comment.commentTime.match(/\d*-\d*-\d*/)}</div>
                          <div className = 'reply' 
                                 onClick = { () => this.setState({indexisReply:index,replyContent:null})}>
                                 <i className = "fa fa-reply-all" aria-hidden="true"></i>
                                 回复

                          </div>
                     
                        </div>
                        <div className = 'comment-p'>
                            <img src = './img/comment-content.svg' alt=''></img>
                            <div>  {comment.commentContent}</div>
                            <Link to = {{pathname:'/blogdetails/'+comment.commentBlogID}} 
                              className = 'comment-blog-link'>博客入口</Link>
                        </div>
                      
                        <div>
                            {this.state.indexisReply === index ? 
                            <div className = 'reply-input'>
                              <div >
                                <span onClick = { () => this.sendReply(
                                                                    this.state.replyContent,
                                                                    comment._id,localStorage['username'],
                                                                    comment.commentBlogID,
                                                                    comment.commenterName) }>
                                                                    <i className = "fa fa-paper-plane" aria-hidden="true"></i>
                                                                    发送</span>
                                <span onClick={ () => this.setState( {indexisReply: -1})}>
                                <i className = "fa fa-times" aria-hidden="true"></i>
                                </span>
                              </div>
                              <textarea rows = '5' 
                                        placeholder = '骚年请发炎' 
                                        onChange = { (e) => this.setState({replyContent:e.target.value})}>
                              </textarea>
                             
                            </div>:null}
                        </div>
                      </div>)
                      :

                      <div id = 'no'>
                        <img src = './img/no.svg' alt=''></img>
                        <div>
                          没有博客评论
                        </div>
                      </div>

                      }
                   </div>
                  
                   <div>
                      
                       <h3 style={{backgroundColor:'rgba(169,163,219)',color:'white'}}>专栏文章评论</h3>
                       {
                           this.state.notReadArticleComments.length !== 0 ?
                           this.state.notReadArticleComments.map((comment, index) => <div key = {j ++} className = 'comment-item'>
                                 <div className = 'article-comment-owner'>
                                   <img src = './img/user2.svg' alt=''></img>
                                   <div>{comment.username}</div>
                                   <div className = 'time-comment'>{this.id2time(comment._id)}</div>
                                   <div className = 'reply'
                                        onClick = { () => this.setState({indexisReply1:index,replyContent1:null})}>
                                        <i className = "fa fa-reply-all" aria-hidden="true"></i>
                                       回复
                                   </div>
                                 </div>
                                 <div className = 'comment-p'>
                                     <img src = './img/comment-content1.svg' alt=''></img>
                                     {comment.content}
                                     <div  onClick = {() => this.toArticleDetails(comment.articleID)}
                                     className = 'comment-blog-link'>文章入口
                                     </div>
                                 </div>
                               <div>
                               {
                                   this.state.indexisReply1 === index ? 
                                    <div className = 'reply-input'>
                                     <div >
                                       <span onClick = { () => this.sendReply1(
                                                                     comment._id,
                                                                     comment.username,
                                                                     comment.articleID,
                                                                     comment.username
                                                                    ) }>
                                                                    <i className = "fa fa-paper-plane" aria-hidden="true"></i>
                                                                    发送</span>
                                        <span onClick={ () => this.setState( {indexisReply1: -1})}>
                                           <i className = "fa fa-times" aria-hidden="true"></i>
                                        </span>
                                     </div>
                                     <textarea  rows = '5' 
                                                placeholder = '骚年请发炎' 
                                                onChange = { (e) => this.setState({replyContent:e.target.value})}>
                                     </textarea>
                                   
                             
                                    </div>:null
                                
                                    
                                }
                               </div>
                               
                               </div>)
                               : 
                               <div id = 'no'>
                               <img src = './img/no.svg' alt=''></img>
                               <div>
                                 没有文章评论
                               </div>
                             </div>

                       }

                   </div>
                
                  </div>
                 </Then>
                 <Else>
                     <When condition={this.state.show.search(/收到赞/) !== -1}>
                     <div id='zan-not-read'>
                        <h3 style={{backgroundColor:'rgba(169,163,219)',color:'white'}}>未读的赞</h3>
                        {
                            this.state.starsFromOthers.some( s => s.hasRead === false) ? 
                                <span 
                                    onClick = { () => this.hadReadZan()} 
                                    className = 'read-zan'>
                                    <i className = "fa fa-list" aria-hidden="true"></i>
                                    全部已读
                                </span>
                            : null
                        }
                        {
                            this.state.starsFromOthers.filter(e => e.hasRead === false)
                            .map( zan => <div key = {o ++} className = 'praise-item'>
                                <div className = 'praise-head'>
                                 <span className = 'user'>*  {zan.zaner}  *赞了你的博客</span>
                                 <span className = 'time'>{zan.time.match(/\d*-\d*-\d*/)}</span>
                                </div>
                                <div className = 'praise-body'>
                                  <Link to={{pathname:'/blogdetails/'+zan.blogID}}>{zan.title}</Link>
                                </div>
                            </div>)
                        }
                        <h3 style={{backgroundColor:'rgba(169,163,219)',color:'white'}}>已读的赞</h3>
                        {
                            this.state.starsFromOthers.length !== 0 ?
                            this.state.starsFromOthers.filter(e => e.hasRead === true)
                            .map( zan => <div key = {o ++} className = 'praise-item'>
                                <div className = 'praise-head'>
                                 <span className = 'user'>*  {zan.zaner}  *赞了你的博客</span>
                                 <span className = 'time'>{zan.time.match(/\d*-\d*-\d*/)}</span>
                                </div>
                                <div className = 'praise-body'>
                                  <Link to={{pathname:'/blogdetails/'+zan.blogID}}>{zan.title}</Link>
                                </div>
                            </div>)
                            : 
                            <div id = 'no'>
                               <img src = './img/no.svg' alt=''></img>
                               <div>
                                 您还没有得到赞
                               </div>
                             </div>

                        }
                     </div>
                     </When>
                     <When condition={this.state.show.search(/回复我的/) !== -1 }>
                     <div id='reply-not-read'>
                           <h3 style={{backgroundColor:'rgba(169,163,219)',color:'white'}}>博客评论下的回复</h3>
                            {
                                this.state.notReadReplys.length !== 0 ?
                                this.state.notReadReplys.map(( reply, index ) => <div key = {p ++} className = 'comment-item'>
                                <div className = 'comment-owner'>
                                  <img src = './img/reply-user.svg' alt=''></img>
                                  <div>{reply.replyFromName}</div>
                                  <div className = 'time-comment'>{reply.now.match( /\d*-\d*-\d*/ )}</div>
                                   
                                    <span className = 'reply' 
                                          onClick = { () => this.hadReadReply(reply.replyFromName,reply.replyToName)} 
                                        >
                                        <i className = "fa fa-check-square" aria-hidden="true"></i>
                                        已读
                                        </span> 
                                    <span className = 'reply' 
                                         onClick = { () => this.setState( {indexisReply:index,replyContent:null})}>
                                         <i className = "fa fa-location-arrow" aria-hidden="true"></i>
                                         回复</span>
                                  
                                </div>
                                <p className = 'reply-content'>{reply.replyContent}</p>
                                  
                                <div>
                                {this.state.indexisReply === index ? 
                                <div className = 'reply-input'>
                                    <div>
                                        <span onClick = { () => this.sendReply( this.state.replyContent,
                                                                                    reply.commentID,localStorage['username'],
                                                                                    reply.commentBlogID, 
                                                                                    reply.replyFromName)}>
                                                                                       <i className = "fa fa-paper-plane" aria-hidden="true"></i>
                                                                                    发送</span>
                                        <span onClick = { () => this.setState({indexisReply:-1})}>
                                        <i className = "fa fa-times" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    <textarea rows = '5' 
                                              placeholder = '骚年请发炎' 
                                              onChange = { (e) => this.setState({replyContent:e.target.value})}></textarea>
                                    
                                    </div>:null}
                                </div>

                             
                                </div>)
                                :
                                <div id = 'no'>
                               <img src = './img/no.svg' alt=''></img>
                               <div>
                                  还没有回复消息
                               </div>
                             </div>

                            }
                     </div>
                     <div>
                         <h3 style={{backgroundColor:'rgba(169,163,219)',color:'white'}}>专栏文章评论下的回复</h3>
                         {
                             this.state.notReadArticleReplys.length !== 0 ?
                             this.state.notReadArticleReplys.map((reply, index) => <div key = {y ++} className = 'comment-item'>
                                 <div className = 'comment-owner'>
                                   <img src = './img/reply-user1.svg' alt=''></img>
                                   <div>{reply.from}</div>
                                   <div className = 'time-comment'> {this.id2time(reply.replyID)}</div>
                                   <span className = 'reply' 
                                         onClick = { () => this.setState( {indexisReply_column:index,replyContent:null})}>
                                         <i className = "fa fa-location-arrow" aria-hidden="true"></i>
                                         回复</span>
                                     <div  onClick = {() => this.toArticleDetails(reply.articleID)}
                                     className = 'comment-blog-link'>文章入口</div>
                                     </div>
                                 <div>
                                    
                                 </div>
                                 <p className = 'reply-content'>{reply.content}</p>
                                 <div>
                                    {this.state.indexisReply_column === index ? 
                                    <div className = 'reply-input'>
                                        <div>
                                            <span onClick = { () => this.sendReply1(  
                                                                                        reply.commentID,
                                                                                        reply.from,
                                                                                        reply.articleID,
                                                                                        reply.commenter
                                                                                    )}>
                                                                                        <i className = "fa fa-paper-plane" aria-hidden="true"></i>
                                                                                        发送</span>
                                            <span onClick = { () => this.setState({indexisReply_column:-1})}>
                                            <i className = "fa fa-times" aria-hidden="true"></i>
                                            </span>
                                        </div>
                                        <textarea rows = '5' 
                                                placeholder = '骚年请发炎' 
                                                onChange = { (e) => this.setState({replyContent:e.target.value})}></textarea>
                                        
                                        </div>:null}
                                </div>
                             
                             </div>) 
                             : 
                             <div id = 'no'>
                               <img src = './img/no.svg' alt=''></img>
                               <div>
                                 没有文章评论
                               </div>
                             </div>

                         }
                     </div>
                     </When>
                 </Else>
                </If>
                </div>
            </div>
        )
    }
}
export default Message;

 