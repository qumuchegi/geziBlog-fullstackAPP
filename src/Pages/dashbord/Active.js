import React,{Component} from 'react';
import api from '../../api';
import {Link} from 'react-router-dom';
import '../../Css/Active.css';
import ShareBlogItem from '../../components/ShareBlogItem';
import uuid from 'uuid';
import UseHistoryPath from '../../components/UseHistoryPath';
import {ActiveLinkItem} from '../../components/ActiveLinkItem';
import { toast , ToastContainer} from 'react-toastify';
import {If,Else,Then} from 'react-if';

class Active extends Component{
    constructor(props){
        super(props);
        this.state={
            shareBlogs:[],
            activelinks:[],
            page:1,
            noNext:false,
            activityType:'activityLink',
          
        }

    }
    componentDidMount(){
       this.fetchAllShare()
       this.fetchActiveLink(1)
    }
    async fetchAllShare(){
       let res = await api.get('/user/allshare')
       if(res.code===0){
           console.log(res.data)
           this.setState({shareBlogs:res.data})
       }
    }
    async fetchActiveLink(page){
        let res = await api.get('/activelink/alllinks',{page})
        if(res.code === 0 ){
            this.setState({activelinks:res.data,noNext:false})
            if(res.data.length<3){
                this.setState({noNext:true})
            }
        }else{
             
            this.setState({noNext:true})
            //toast.warn('没有了',{autoClose:1200})
           
        }
    }
    fetchNext(){
        // 再 state.page 变化 重新渲染后就调用 this.fetchActiveLink(this.state.page)
        this.setState((prevState) => ({page: ++prevState.page}),()=> this.fetchActiveLink(this.state.page))
    }
    fetchLast(){
        if(this.state.page === 0) return
        this.setState((prevState) => ({page: --prevState.page}),()=> this.fetchActiveLink(this.state.page))     
    }
    changeActivityShow(type){
        this.setState({activityType:type})
    }
    render(){
        return(
            <div id='active-body'>
                <ToastContainer/>
                <div id='home-top'>
                    <div id='gezi-title'>
                    <img src = './img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history}/>
                    </div>
                    
                        <div id='activity-nav'>
                            <div onClick={()=>this.changeActivityShow('activityLink')} 
                                className={this.state.activityType==='activityLink'?'activity-selected':'activity-not-selected'}>分享连接</div>
                            <div onClick={()=>this.changeActivityShow('share')}
                                className={this.state.activityType==='share'?'activity-selected':'activity-not-selected'}>博客分享</div>
                            
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
                <If condition={this.state.activityType === 'activityLink'}>
                  <Then>
                        <div id = 'active-link'>
                        <div id = 'active-link-page-button'>
                            {
                                this.state.page > 1 ?
                                <div onClick={()=>this.fetchLast()}>
                                <i className = "fa fa-arrow-left" aria-hidden="true"></i>
                                上一页
                                </div>
                            :
                                <div></div>
                            }
                            <div>
                                分享连接
                            </div>
                            {
                                this.state.noNext ?
                                    <div></div>
                                :
                                    <div onClick={()=>this.fetchNext()}> 
                                    下一页
                                    <i className = "fa fa-arrow-right" aria-hidden="true"></i> 
                                    </div>
                            }
                            
                            
                            
                        </div>
                        {
                            this.state.activelinks ?
                            this.state.activelinks.map(ele => <div key={uuid()} className = 'link-item'>
                            <ActiveLinkItem activeLink = {ele}/>
                            </div>)
                            :
                            null
                        }
                        </div>
                  </Then>
                  <Else>
                            <div id='share'>
                            {
                                this.state.shareBlogs ?
                                this.state.shareBlogs.map(share=><div key={uuid()}   className="my-share-item">
                                <ShareBlogItem share={share}></ShareBlogItem>
                                </div>)
                                : null
                            }

                            </div>

                  </Else>
                
                </If>
                
                
            </div>
        )

    }
}
export default Active;