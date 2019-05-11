import {useState,useEffect} from 'react'
import api from '../api'
import React from 'react'
import uuid from 'uuid';
import {TopTitleFixed} from '../components/TopTitleFixed'
import '../Css/UserPage.css'
import { If, Then, Else ,When} from 'react-if';
import BlogItem from '../components/BlogItem';
import UseHistoryPath from '../components/UseHistoryPath';
import {Link} from 'react-router-dom';
import UseFetchIWatchedColumns from '../components/logicalComponent/UseFetchIWatchedColumns';
import {ColumnItems} from '../components/ColumnItems';



function UserPage (props){
    let [ userInfo, setUserInfo ] = useState( 0 );
    let [ blogs, setBlogs ] = useState( 0 )
    let [ praised, setPraised ] = useState()
    let [ tab, setTab ] = useState( '0' )
    var columns =  UseFetchIWatchedColumns(userInfo.username)

    async  function fetchUserInfo() {
        let res = await api.get( '/user/userinfo', { userID: props.match.params.userID })
        if(res.code===0){
            console.log(res.data)
            setUserInfo( res.data )
        }
    };
    async function fetchBlogs() {
        let res = await api.get( '/blog/myblogs', { userID: props.match.params.userID })
        if(res.code===0){
            console.log(res.data)
            setBlogs( res.data )
        }
    }
    async function fetchPraised() {
        let res = await api.get( '/user/izanedblogs', { userID: props.match.params.userID })
        if(res.code === 0){
            setPraised( res.data )
        }
    }
    useEffect( () => {
        console.log(props)
        fetchUserInfo()
        },
        []
    )
    useEffect( () => {
        fetchBlogs()
    },[])
    useEffect( () => {
        fetchPraised()
        
    },[])
    return(
        <div id = 'user-page-body'>
            <TopTitleFixed title = '个人主页'></TopTitleFixed>
            <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {props.history} name = '个人主页' />
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
            <div  id = 'userpage-body'>
             <div id = 'user-info-flex-container'>
                <div id = 'avatar' >
                    <img src = {'http://localhost:3001/'+
                    String( userInfo.imgAvatar_url ).replace( /server\/public\/img\/usersAvatar\//, '' ) } alt=''>
                    </img>
                </div>
                <div id = 'user-info-page'>
                    <div>
                        <i className = "fa fa-user-circle" aria-hidden="true"></i>
                        <span>{ userInfo.username }</span>
                    </div>
                    <div  >
                       <i className = "fa fa-briefcase" aria-hidden="true"></i>
                       <span>{ userInfo.job }</span>
                    </div>
                    <div  >
                        <i className = "fa fa-thumbs-up" aria-hidden="true"></i>
                        <span> 获赞{ Array( userInfo.starsFromOthers ).length } </span>
                    </div>
                    <div  >
                        <i className = "fa fa-transgender" aria-hidden="true"></i>
                        <span> { userInfo.sex }</span>
                    </div>
                    <div>
                        <i className = "fa fa-cogs" aria-hidden="true"></i>
                        { Array.prototype.flat.call([userInfo.techs]).map( ( t,i ) => <span key = { i }>{ t }</span> )} 
                    </div>
                    <div id='self-introduction'>
                        <i class="fa fa-bullhorn" aria-hidden="true"></i>
                        <span>一句话自我介绍</span>
                        <div>
                          { userInfo.selfIntroduction }
                        </div>
                    </div>
                </div>
             </div>
             <div id = 'his-blogs'>
             <div id = 'tabs'>
                <span className = { tab === '0' ? 'userpage-selected' : 'userpage-not-selected' } 
                      onClick = { () => setTab( '0' ) }>他发布的博客</span>
                <span className = { tab === '1' ? 'userpage-selected' : 'userpage-not-selected' } 
                      onClick = { () => setTab( '1' ) }>他赞过的博客</span>
                <span className = { tab === '2' ? 'userpage-selected' : 'userpage-not-selected'} 
                      onClick={ () => setTab( '2' ) }>他创建/关注的专栏</span>
             </div>
             <hr/>
             <If condition = { tab === '0' }>
               <Then>
                    {
                        blogs ? blogs.map( blog => <div key = { blog.blog._id } 
                                                     className = 'userpage-blog-item'>
                               <BlogItem blog = { blog } history = { props.history } ></BlogItem>
                        </div>)
                        : 
                        <div id = 'no'>
                            <img src = '../img/no1.svg' alt = ''/>
                            <div>他还没有发布过博客</div>
                        </div>
                    }
               </Then>
               <Else>
                   <When condition = { tab === '1' }>
                   {
                        praised ? praised.map( blog => <div key = { blog.blog._id } 
                                                            className = 'userpage-blog-item'>
                               <BlogItem blog = { blog } history = { props.history }></BlogItem>
                        </div>)
                        :
                        <div id = 'no'>
                            <img src = '../img/no3.svg' alt = ''/>
                            <div>他还没有赞过其他用户的博客</div>
                         </div>
                    }
                   </When>
                   <When condition = { tab === '2'} >
                   <div id = 'columns'>
                        {
                            columns.length ?
                            <ColumnItems columns = {columns} history = {props.history}/>
                            :
                            <div id = 'no'>
                                <img src = '../img/no4.svg' alt = ''/>
                                <div>他还没有关注的专栏（包括自己创建的专栏）</div>
                            </div>
                        }
                   </div>
                   
                   </When>
               </Else>
             </If>
             </div>
            </div>
        </div>
    )
}
export default UserPage