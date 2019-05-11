import React from 'react';
import {useState,useEffect} from 'react'
import api from '../api'
import { TopTitleFixed } from '../components/TopTitleFixed';
import BlogItem from '../components/BlogItem';
import '../Css/BlogsAType.css';
import {Link} from 'react-router-dom';
import UseHistoryPath from '../components/UseHistoryPath';

function BlogsAType(props){
    let [blogs,setBlogs] = useState({})
    async function fetchATypeBlogs(){
        let res = await api.get('/blog/atype',{type:props.match.params.type})
        console.log(res.data)
        if(res.code===0){
            setBlogs(res.data)
        }
    }
    useEffect( () => {
        fetchATypeBlogs()
    },[])
    useEffect(()=>{
        console.log(blogs)
    })
    return(
     <div id = 'blogs-a-type-big-body'> 
      <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                     <UseHistoryPath history = {props.history} name = {props.match.params.type}/>
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
       <div id='blogs-a-type-body'>
        <TopTitleFixed 
         title = {props.match.params.type + '博客'}></TopTitleFixed>
        <div id = 'blogs-container'>
            {
                blogs  ? Array.from( blogs ).map( blog => <div key = {blog.blog._id} 
                                                               className = 'type-blog-item'>
                 <BlogItem blog = {blog} 
                           history = {props.history}></BlogItem>
                </div>)
                : null
            }
      </div>
      </div>
    </div>
    )
}
export default BlogsAType