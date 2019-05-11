import React,{useState,useEffect} from 'react';
import api from '../api';
import {store} from '../Redux/Reducers/index'
import {delete_article} from '../Redux/Actions/cacheArticle';
import {add_history} from '../Redux/Actions/historyPath';
import '../Css/ArticleDetails.css';
import {Link} from 'react-router-dom';
import {TopTitleFixed} from '../components/TopTitleFixed';
import UseHistoryPath from '../components/UseHistoryPath';
import {If , Else, Then} from 'react-if';
import { ToastContainer, toast } from 'react-toastify';
import uuid from 'uuid';
import { constants } from 'fs';

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
  function id2time(id) {
    let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    return time.toISOString().substr(0,10)
}
  function ArticleDetails(props){
      var timer1  // 定时器1
      var timer2 //
      const [article, setArticle] = useState( store.getState().articleCached  )
      const [articleID, setArticleID] = useState(store.getState().articleCached._id)
      const [showCommentTextarea, setShowCommentTextarea] = useState(false)
      const [commentContent, setCommentContent] = useState()
      const [replyContent, setReplyContent] = useState()
      const [replyTo, setReplyTo] = useState('')
      const [comments, setComments] = useState([])
      const [replys, setReplys] = useState([])
      const [replyCommentID, setReplyCommentID] = useState(-1)
      const [commenter, setCommenter] = useState('')

      useEffect(() => {
          
          document.getElementById('article-content').innerHTML = md.render(article.content);
 
          for(let e of document.getElementsByTagName('a')){//给每个 <a>标签加上 'target = _blank'
            e.setAttribute('target','_blank')
          }
          return () => {//推出是从Redux删除文章
            store.dispatch(delete_article(article._id))
            clearTimeout(timer1)
            clearTimeout(timer2)
            console.log(store.getState().articleCached)
        }

      },[])
      useEffect(()=>{
        fetchComment()
        fetchReply()

      },[])
      
      async function fetchComment(){
          let res = await api.get('/articleComment/comments',{articleID: article._id})
          if(res.code === 0){
              setComments(res.data)
              console.log(res.data)
          }
      }
      async function fetchReply(){
          let res = await api.get('/articlereply/replys',{articleID: article._id})
          if(res.code === 0 ){
              setReplys(res.data)
          }
      }
       
      async function praise(){
          /*
          let res = await api.post('/column/article/praise',{
              username:localStorage['username'],

            })
          */
      }
      async function share(){

      }
    
      function startComment(){
        setReplyCommentID(-1)
        setShowCommentTextarea(true);
        setReplyContent('')
        timer1 = setTimeout(()=>document.getElementById('comment-send').scrollIntoView({behavior:"smooth", block:"end"})
        ,200
        )
      }
      function replyStart(commentID,replyTo,commenter){
        setReplyCommentID(commentID)
        setReplyTo(replyTo)
        setShowCommentTextarea(false)
        setCommentContent('')
        setCommenter(commenter)
        timer2 = setTimeout(()=>document.getElementById('reply-send').scrollIntoView({behavior:"smooth", block:"end"})
        ,200
        )
      }
      async function sendComment(){
          if(!commentContent) return toast.warn('请输入评论',{autoClose:1200})
          let [ articleID, username, content, articlePublisher ] = [
              article._id,
              localStorage['username'],
              commentContent,
              article.author,
          ]
          let res = await api.post('/articleComment/comment',{ articleID, username, content,articlePublisher })
          if(res.code === 0){
              toast.success('成功发送评论！！！',{autoClose: 1200})
              setShowCommentTextarea(false)
          }
      }
      async function sendReply(){
          setReplyCommentID(-1)
          if(!replyContent) return toast.warn('请输入回复内容',{autoClose:1200})
          if(!localStorage['username']) return toast.warn('请先登录',{autoClose:1200})
          
            let [commentID, from, to, content, articleID] = [replyCommentID, localStorage['username'], replyTo, replyContent, article._id ]
            let res = await api.post('/articleReply/reply',{commentID, from, to, content, articleID,commenter})
            if(res.code === 0){
                  let newReplys = replys;
                  newReplys.push(res.data)
                  console.log(newReplys)
                  setReplys(newReplys)// 这里并没有引起 Replys 改变重新渲染，不知道为什么，
                  toast.success('回复发送成功',{autoClose:1200})
                
            }
      }
      return(
          <div id = 'article-details-body'>
            <TopTitleFixed title = {String(article.title)}></TopTitleFixed>
            <ToastContainer/>
            <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {props.history} name = '文章详情' />
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
              {
                  article !== ''?
                  <div id = 'article-info'>
                        <div>
                            <h3 id = 'title'>
                            {article.title}
                                <span id = 'author'>* {article.author} *</span>
                                <span id = 'time'>{article.time.replace(/(\d*)-(\d*)-(\d*)-(\d*)-(\d)/,'$1/$2/$3  $4:$5') }</span>
                            </h3>
                            
                        </div>
                        <p id = 'article-content'>

                        </p>
                   
                  <div id = 'comment-list-input'>
                     <hr/>
                     <h3>评论区</h3>
                     <ul id = 'comment-list'>
                          {
                              comments ?
                              Array.prototype.flat.call(comments).map(e => <li key = {uuid()}>
                                <div className = 'commenter-avatar-time'>
                                   <div>
                                    {e.username}
                                    <div className = 'time'>{id2time(e._id)}</div>
                                   </div>
                                   
                                   <div className = 'reply-button'
                                        onClick = {() => replyStart(e._id,e.username) }
                                   >回复</div>
                                </div>
                                <div className = 'comment-content'>
                                    {e.content}
                                </div>
                                <div className = 'comment-replys-list'>
                                {
                                        replys.filter(ele => ele.commentID === e._id).map(reply => <div key = {uuid()} className = 'reply-item'>
                                            <div className = 'reply-top'>
                                                <div className = 'form-to'>
                                                    <span>{reply.from} -> </span>
                                                    <span>{reply.to}</span>
                                                </div>
                                                <div className = 'time'>
                                                    {id2time(reply._id)}
                                                </div>
                                                <div className = 'reply-button'
                                                     onClick = {() => replyStart(e._id,reply.from,e.username) }
                                                >
                                                    回复
                                                </div>
                                            </div>
                                            <div className = 'reply-content'>
                                                {reply.content}
                                            </div>
                                        </div>)
                                       
                                    }
                                </div>
                              </li>)
                              : null
                          }
                     </ul>
                     <div  >
                        <If condition = { showCommentTextarea }>
                            <Then >
                                {
                                    localStorage['imgAvatar_url'] ?
                                    <div id = 'comment-send'>
                                        <div onClick = {()=>setShowCommentTextarea(false)}>
                                         <i className = "fa fa-times" aria-hidden="true"></i>
                                        </div>
                                        <div id = 'send-top'>
                                            <div>
                                                <img src={'http://localhost:3001/'+localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')} 
                                                    alt=''  
                                                    id='avatar'>
                                                </img>
                                                <span>{localStorage['username']}</span>
                                            </div>
                                            <div onClick = {() => sendComment()}
                                                 id = 'send-button'
                                            >
                                             <i className = "fa fa-share-square" aria-hidden="true"></i>
                                             发送评论</div>
                                        </div>
                                        <textarea rows = '10' 
                                               
                                                  onChange = {(e) => setCommentContent(e.target.value)}
                                                  placeholder = '说点什么吧.... ....'
                                                  />
                                    </div>
                                    :
                                    <div id = 'no'>
                                        <img src = './img/no1.svg' alt=''></img>
                                        <div>
                                            请先登录
                                        </div>
                                    </div>
                                }
                                    
                            </Then>
                            <Else>
                                
                             
                            </Else>
                        </If>
                     </div>
                  </div>
                  <div id = 'reply-send'>
                      <If condition = {replyCommentID !== -1}>
                        <Then >
                            {
                                localStorage['imgAvatar_url'] ?
                                    <div >
                                        <div onClick = {()=>setReplyCommentID(-1)}>
                                         <i className = "fa fa-times" aria-hidden="true"></i>
                                        </div>
                                        <div id = 'send-top'>
                                            <div>
                                                <img src={'http://localhost:3001/'+localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')} 
                                                    alt=''  
                                                    id='avatar'>
                                                </img>
                                                <span>{localStorage['username']}</span>
                                            </div>
                                            <div onClick = {() => sendReply()}
                                                 id = 'send-button'
                                            >
                                             <i className = "fa fa-share-square" aria-hidden="true"></i>
                                             发送回复</div>
                                        </div>
                                        <textarea rows = '10' 
                                            
                                                  onChange = {(e) => setReplyContent(e.target.value)}
                                                  placeholder = '说点什么吧.... ....'
                                                  />
                                    </div>
                                    :
                                    <div id = 'no'>
                                        <img src = './img/no3.svg' alt=''></img>
                                        <div>
                                            请先登录
                                        </div>
                                    </div>
                            }
                                     

                        </Then>
                        <Else>

                        </Else>
                      </If>
                  </div>
              </div>

                  :
                  null
              }
             
              <div id = 'praise-share-comment'>
                <div>
                    <div onClick = {() => praise()}>
                     点赞
                      <div>
                         <i className = "fa fa-thumbs-up" aria-hidden="true"></i>
                     </div>
                    </div>
                </div>
                <div>
                    <div onClick = {() => share()}>
                    分享
                        <div>
                            <i className = "fa fa-share" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div onClick = {() => startComment() }>
                    <div>
                    评论
                        <div>
                           <i className = "fa fa-comments" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>

              </div>
          
          </div>
      )
  }
  export default ArticleDetails