import React,{useState} from 'react'
import {TopTitleFixedWithTab} from '../components/TopTitleFixedWithTab';
import UseHistoryPath from '../components/UseHistoryPath';
import {Link} from 'react-router-dom';
import {If,Else,Then} from 'react-if';
import {PublishLink} from '../components/PublishLink';
import '../Css/PublishMyActive.css';

function PublishMyActive(props){
    const [tab, setTab] = useState('发布链接🔗')

    function changeShow( tab ) {
        setTab(tab)
    }
    return(
        <div id = 'publish-my-active-body'>
           <TopTitleFixedWithTab 
                                title = '发布动态'  
                                tabs = {['发布链接🔗'] } 
                                changeShow = {changeShow} 
                                selected = {tab}/>
          <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {props.history} name = '发布动态'></UseHistoryPath>
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
        <If condition = {tab === '发布链接🔗'}>
           <Then>
               <PublishLink/>
           </Then>
        </If>
        </div>
    )
}
export default PublishMyActive