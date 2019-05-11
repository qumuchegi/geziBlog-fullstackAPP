import React,{Component} from 'react';
import { TopTitleFixedWithTab } from '../components/TopTitleFixedWithTab';
import api from '../api';
import { Link } from 'react-router-dom';
import '../Css/ShareHistary.css';
import UseHistoryPath from '../components/UseHistoryPath';
import {ActiveLinkItem} from '../components/ActiveLinkItem';
import uuid from 'uuid'
import {If,Else,Then} from 'react-if';

class ShareHistary extends Component{
    constructor( props ) {
        super( props )
        this.state = {
            myshare:[],
            myLinks:[],
            show:'我分享的连接'

        }
    }
    componentDidMount() {
        this.fetchMyshare()
        this.fetchMyActiveLinks()
    }
    async fetchMyshare() {
        let res = await api.get( '/user/myshare', { username: localStorage['username'] })
        if(res.code === 0){
            this.setState({ myshare: res.data })
       
        }
    }
    async fetchMyActiveLinks(){
        let res = await api.get('/activelink/myalllinks',{username:localStorage['username']})
        if(res.code === 0){
         
            this.setState({myLinks:res.data})

        }
    }
    changeShow(type){
        this.setState({show:type})

    }
    render(){
        return(
            <div id = 'my-share-big-body'>
              <TopTitleFixedWithTab title='我的分享' tabs={['我分享的连接','我分享的博客'] } changeShow={this.changeShow.bind(this)} selected={this.state.show}/>
                <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history} name = '我的分享'></UseHistoryPath>
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
                <If condition = {this.state.show === '我分享的连接'}>
                   <Then>
                        <div id ='my-share-links'>
                        {
                            this.state.myLinks.length ?
                            this.state.myLinks.map(ele => <ActiveLinkItem key = {uuid()} activeLink = {ele}></ActiveLinkItem>)
                            :
                            <div id = 'no'>
                                    <img src = '../img/no4.svg' alt = ''/>
                                    <div> 您还没有任何分享 </div>
                            </div>
                        }
                        
                        </div>
                   </Then>
                   <Else>
                        <div  id = 'my-share-blogs'>
                        {
                            this.state.myshare.length ?
                            this.state.myshare.map( share => <div key = {share.blogID}   className = "my-share-item">
                            <Link to={{ pathname:'/blogdetails/'+ share.blogID }} className = 'Link'>
                            <div className = 'share-blog-title'>{ share.title }</div>
                            <div className = 'share-time'>分享于{ share.time.match( /\d*-\d*-\d*/ ) }</div>
                            </Link>
                            </div>
                            )
                            :
                            <div id = 'no'>
                                    <img src = '../img/no4.svg' alt = ''/>
                                    <div> 您还没有任何分享 </div>
                            </div>
                        }
                    </div>
                   </Else>
                </If>

               
                
            </div>
        )
    }
}
export default ShareHistary