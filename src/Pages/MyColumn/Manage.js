import React,{Component} from 'react';
import {useState,useEffect} from 'react';
import {TopTitleFixedWithTab} from '../../components/TopTitleFixedWithTab';
import { If, Then, Else } from 'react-if';
import uuid from 'uuid'
//import useFetchedUserColumn from '../../components/logicalComponent/useFetchedUserColumn';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../api'
import {store} from '../../Redux/Reducers/index';
import{cache_article} from '../../Redux/Actions/cacheArticle';
import '../../Css/ManageColumn.css'
import {ColumnItems} from '../../components/ColumnItems';
import UseHistoryPath from '../../components/UseHistoryPath';
import {Link} from 'react-router-dom';
import ArticleItem from '../../components/ArticleItem';

class Manage extends Component{
    constructor(props){
        super(props)
        this.state={
            tab:'我创建的专栏',
            columns:[],
            articles:[],
    
        }
        //this.changeShow = this.changeShow.bind(this)
    }
    async fetchIcreatedColumns(){
        let res = await api.get('/column/usercolumn',{username:localStorage['username']})
        if(res.code===0){
            console.log(res)
            this.setState({columns:res.data})
        }
    }
    async fetchIPublishedArticles(){
        let res = await api.get('/column/myallarticles',{username:localStorage['username']})
        if(res.code === 0){
            this.setState({articles: res.data})

        }
    }
    componentDidMount(){
         this.fetchIcreatedColumns()
         this.fetchIPublishedArticles()
         
    }
    changeShow=(tab)=>{
        this.setState({tab})
    }
    id2time(id) {
        let time = new Date(parseInt( id.toString( ).substring(0, 8), 16) * 1000);
        return time.toISOString( ).substr( 0, 10)
    }
    async toArticleDetails(article){
        console.log(article)
        await store.dispatch(cache_article(article,article._id))
        this.props.history.push('/articledetails')
    }
    render(){
        return(
            <div id = 'column-manage-body'>
             <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history} name = '管理专栏'/>
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
              <ToastContainer/>
              <TopTitleFixedWithTab title = '管理专栏' 
                                    tabs = {['我创建的专栏','我的专栏文章']} 
                                    changeShow = {this.changeShow} 
                                    selected = {this.state.tab}>
              </TopTitleFixedWithTab>
              <div id = 'column-manage-content'>
               <If condition = { this.state.tab === '我创建的专栏'}>
                 <Then>
                    
                     {
                         localStorage['username'] ? 
                            <div>
                                {
                                    this.state.columns.length ?
                                    <ColumnItems columns = {this.state.columns} history = {this.props.history}/>
                                :
                                <div id = 'no'>
                                    <img src = './img/no1.svg' alt=''></img>
                                    <div>
                                    还没有创建过专栏
                                    </div>
                               </div>
                                }
                            </div>
                            :
                            <div>请先登录</div>
                    }

                 </Then>
                 <Else>
                    {
                        localStorage['username'] ? 
                         this.state.articles.length ?
                         this.state.articles.map(ele => <div  key = {uuid()} 
                                                              className = 'item'
                                                              onClick = {() => this.toArticleDetails(ele)} >
                            <ArticleItem article = {ele}/>
                        </div>)
                        : 
                        <div id = 'no'>
                            <img src = './img/no1.svg' alt=''></img>
                            <div>
                             还没有发布过专栏文章
                            </div>
                        </div>
                    :
                    <div>请先登录</div>}
                 </Else>
               </If>
              </div>
            </div>
        )
    }
    
    
}

 
export default Manage