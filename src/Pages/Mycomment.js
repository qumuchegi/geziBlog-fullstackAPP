import React,{Component} from 'react';
import { TopTitleFixed } from '../components/TopTitleFixed';
import api from '../api';
import {Link} from 'react-router-dom';
import '../Css/Mycomment.css';
import UseHistoryPath from '../components/UseHistoryPath';

class Mycomment extends Component{
    constructor(props){
        super(props)
        this.state={
            mypinglun:[],

        }
    }
    componentDidMount(){
        this.fetchMyPinglun()
    }
    async fetchMyPinglun(){
        let res = await api.get('/comment/mycomment',{username:localStorage['username']})
        if(res.code === 0) {
            console.log('获取我的评论成功',res.data)
            this.setState( { mypinglun: res.data})
        }
    }
    render(){
        let i=0
        return(
            <div id = 'my-comment-big-body'>
                <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history} name = '我的评论'/>
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
                <TopTitleFixed title = '我的评论'></TopTitleFixed>
                <div id = 'my-pinglun-body'>
                  { 
                      this.state.mypinglun.length !== 0 ?
                      this.state.mypinglun.map( pinglun => <div key = {i++} className = 'my-pinglun_item'>
                            <p className = 'my-pinglun-content'>评论内容：{pinglun.commentContent}</p>
                            <span className = 'my-pinglun-time'>评论时间：{pinglun.commentTime.match(/\d*-\d*-\d/)}</span>
                            <Link to = {{pathname:'/blogdetails/'+pinglun.commentBlogID}} 
                                  className='my-pinglun-blog-enter'>进入博客</Link>
                            <hr/>
                          </div>)
                      :
                      <div id = 'no'>
                          <img src = './img/no1.svg' alt = ''/>
                          <div>您还没有评论过任何文章或博客</div>

                      </div>
                  }
                </div>
            </div>
        )
    }
}
export default Mycomment