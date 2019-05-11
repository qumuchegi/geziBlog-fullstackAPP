import React,{useState,useEffect,useReducer} from 'react';
import api from '../api';
import {TopTitleFixed} from '../components/TopTitleFixed';
import '../Css/ColumnDetails.css'
import uuid from 'uuid';
import ArticleItem from '../components/ArticleItem';
import {Link} from 'react-router-dom';
import {cache_article,delete_article} from '../Redux/Actions/cacheArticle';
import {store} from '../Redux/Reducers/index'
import { add_history,delete_history } from '../Redux/Actions/historyPath';
import UseHistoryPath from '../components/UseHistoryPath';
import { ToastContainer, toast } from 'react-toastify';
/*
function reducer(state,action){
    switch(action.type){
        case '':
    }

}
*/
function ColumnDetails(props){
    const [column,setColumn] = useState([])
    const [clickMore, setClickMore] = useState(false)//更多
    const [articles, setArticles] = useState([])
    const [watch, setWatch] = useState(false)
    const [join, setJoin] = useState(false)
   // const [state, dispatch] = useReducer(reducer, initialState, init)
    useEffect(() => {
        console.log(props.match.params.columnID)
        fetchColumn()
    },[])
    useEffect(() => {
        fetchArticles()
        console.log(column)
        console.log( Array.prototype.flat.call([column.participator]))
    },[])
    async function fetchColumn(){
        let res = await api.get('/column/acolumn', {columnID:props.match.params.columnID})
        if(res.code === 0){
            setColumn(res.data)
        }
    }
    async function fetchArticles(){
        let res = await api.get('/column/columnarticle', {columnID:props.match.params.columnID})
        if(res.code === 0){
            console.log(res.data)
            setArticles(res.data)
        }
    }
    async function toArticleDetails(article){
        console.log(article)
        await store.dispatch(cache_article(article,article._id))
        props.history.push('/articledetails')
    }
    function nowTime(){
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
        return now
    }
    async function watchColumn(){
        if(!localStorage['username']) return toast.warn('请先登录',{autoClose:1200})
       console.log( Array.prototype.flat.call([column.participator])[0].username)
        
        let res = await api.post('/column/watchcolumn',{
            username: localStorage['username'],
            avatar: localStorage['imgAvatar_url'],
            time: nowTime(),
            columnID:column._id
        })
        if(res.code === 0){
            toast.success('已关注！',{autoClose:1000})
            setWatch(true)
        }else if(res.code === 1){
            toast.warn('您已经关注了',{autoClose:1000})
        }

    }
    async function joinColumn(){
        if(!localStorage['username']) return toast.warn('请先登录',{autoClose:1200})
        console.log('00')
        let res = await api.post('/column/join',{
            username:localStorage['username'],
            avatar:localStorage['imgAvatar_url'],
            time:nowTime(),
            columnID:column._id,
            creatorID:localStorage['_id']
        })
        if(res.code === 0){
            toast.success('已参与',{autoClose:1000})
            setJoin(true)
        }else if(res.code === 1){
            console.log(0)
            toast.warn('您已经参与过了',{autoClose:1000})
        }
    }
    return(
        <div id = 'column-details-big-body'>
            <ToastContainer/>
            <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {props.history} name = '专栏详情'/>
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
        <div id = 'column-details-body'>
          <TopTitleFixed title = {String(column.name)}></TopTitleFixed>
          <div id = 'column'>
            <div id = 'column-infos'>
                <div id = 'column-picture'>
                  <img src = { 'http://localhost:3001/' + 
                              String(column.picture).replace(/server\/asset\/columnTopImg/,'') } 
                       alt = ''></img>
                </div>
                <div id = 'column-article-watch-participator'>
                  <div>
                      <div>文章</div>
                      <div>{Array.prototype.flat.call( [column.article] ).length}</div>
                  </div>
                  <div>
                      <div>参与者</div>
                      <div>{Array.prototype.flat.call( [column.participator]).length}</div>
                  </div>
                  <div>
                      <div>关注量</div>
                      <div>{Array.prototype.flat.call( [column.watcher]).length}</div>
                  </div>
                </div>
                <div id = 'creator'>
                    <div id = 'avatar'>
                      <img src = {'http://localhost:3001/'+
                                  String(column.creatorAvatar).replace(/server\/public\/img\/usersAvatar\//,'')}
                                  alt = ''></img>
                    </div>
                    <div id ='name'>由{column.creator}创建</div>
                    
                </div>
            </div>
            <div id = ''>
                <div id = 'column-about'>
                    <div id = 'column-name'>{column.name}</div>
                    <div id = 'column-description'>
                        {String(column.description).length  > 50  && !clickMore ? 
                                <div>
                                    {String(column.description).slice(0,50) + '...'}
                                    <div onClick = {() => setClickMore(true)}
                                        id = 'description-more-button'
                                    > 
                                    更多 
                                    <i className = { clickMore ? 'description-more fa fa-arrow-down' : "fa fa-arrow-down" }
                                        aria-hidden = "true"></i>
                                    </div>
                                </div>
                                : 
                                !clickMore ?
                                <div>
                                   { column.description}
                                </div>
                                : 
                                <div>
                                    { column.description}
                                    <div onClick = {() => setClickMore(false)}
                                        id = 'description-more-button'
                                    > 收起
                                    <i className = "fa fa-arrow-up" aria-hidden = "true"></i>
                                    </div>
                                </div>
                                }
                    </div>
                </div>
                <div id = 'column-labels'>
                标签
                {
                    Array(column.labels).map( e => <span key = {uuid()}>#{ e }</span>)
                }
                </div>
            </div>
            <div id = 'watch-join'>
                <div id = {Array.prototype.flat.call([column.watcher]).some(e => Object(e).username===localStorage['username']) || watch ? 
                'had-watch' : 'watch-button'} 
                     onClick = {() => watchColumn()}>
                     <span>
                     关注
                     </span>
                </div>
                <div id = {Array.prototype.flat.call([column.participator]).some(e => Object(e).username===localStorage['username']) || join ? 
                'had-join' : 'join-button'} onClick = {() => joinColumn()}>
                    <span>
                    参与
                    </span>
                </div>
            </div>
          </div>
          <div id = 'articles-list'>
           <span>文章</span>
           {
               articles.map(ele => <div key = {uuid()} 
                                      className = 'item'
                                      onClick = {() => toArticleDetails(ele)} >
                <ArticleItem article = {ele}/>
               </div>)
           }
          </div>
        </div>
    </div>
    )
}
//&& !clickMore
export default ColumnDetails