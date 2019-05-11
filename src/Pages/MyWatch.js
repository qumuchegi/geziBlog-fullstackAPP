import {useState,useEffect} from 'react'
import api from '../api'
import React from 'react'
import '../Css/MyWatch.css';
import { TopTitleFixedWithTab } from '../components/TopTitleFixedWithTab';
import { If, Then, Else } from 'react-if'
import {Link} from 'react-router-dom'
import UseHistoryPath from '../components/UseHistoryPath';
import {ColumnItems} from '../components/ColumnItems'
import uuid from 'uuid'

export default function MyWatch(props) {
    let [myWatch,setMyWatch] = useState({})
    const [myWatchColumns, setMyWatchColumns] = useState([])
    let [tab,setTab] = useState('关注的用户')
    let [n,setN] = useState(0)
    useEffect(() => {
      fetchMyWatch()
      fetchMyWatchColumn()
    }, [] )
    useEffect( () => {
     
    })
    async function fetchMyWatch(){
        let res = await api.get('/user/mywatch', { userID: localStorage['_id']})
        if(res.code === 0) {
            setMyWatch(res.data)
        }
    }
    async function fetchMyWatchColumn(){
        let res = await api.get('/column/watchedcolumns',{username:localStorage['username']})
        if(res.code === 0){
            setMyWatchColumns(res.data)
        }
    }
    function changeShow( tab ) {
        setTab(tab)
    }
    return(
      <div id = 'my-watch-big-body'>
        <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {props.history} name = '我的关注'></UseHistoryPath>
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
        <div id = 'my-watch-body'>
             
          <TopTitleFixedWithTab title = '我的关注' 
                                tabs = {['关注的用户','关注的专栏'] } 
                                changeShow = {changeShow} 
                                selected = {tab}></TopTitleFixedWithTab>
          <div>
              <If condition={ tab === '关注的用户'}>
                <Then>
                    {
                    myWatch ? 
                    <div id = 'my-watch-authors-avatars'>
                        
                        
                    {
                        Array.from( myWatch ).length !== 0 ?
                        Array.from( myWatch ).map( e => <div  key = {n++} className = 'scroll-avatars-item'>
                                              <Link to = {{pathname:'/userpage/'+e.id}} 
                                                    style = {{ textDecoration: 'none'}}>
                                                <img  src = { 'http://localhost:3001/' + 
                                                               e.avatar.replace(/server\/public\/img\/usersAvatar\//, '')} 
                                                               alt=''>
                                                </img>
                                                <div>{ e.name }</div>
                                              </Link>
                        </div>
                        ) 
                        :
                        <div id = 'no'>
                          <img src = '../img/no2.svg' alt = ''/>
                          <div>您还没有关注过其他用户</div>
                      </div>
                    }
                
                    </div>
                    : null
                    }
                </Then>
                <Else>
                     {
                         myWatchColumns.length ?
                         <ColumnItems columns = {myWatchColumns} history = {props.history}/>
                      
                         :
                         <div id = 'no'>
                            <img src = '../img/no4.svg' alt = ''/>
                            <div>您还没有关注的专栏（包括自己创建的专栏）</div>
                         </div>

                     }

                </Else>
              </If>
             
          </div>
        </div>
    </div>
    )
}