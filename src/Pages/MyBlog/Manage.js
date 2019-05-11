import React,{Component} from 'react';
import api from '../../api'
import '../../Css/Manage.css'
import { If, Then, Else } from 'react-if';
import BlogItem from '../../components/BlogItem';
import { TopTitleFixedWithTab } from '../../components/TopTitleFixedWithTab';
import {Link} from 'react-router-dom';
import UseHistoryPath from '../../components/UseHistoryPath';
import {ManageBlogTable} from '../../components/ManageBlogTable';
import { ToastContainer, toast } from 'react-toastify';

class Manage extends Component{
    constructor(props){
        super(props)
        this.state={
            myblogs:[],
            IzanedBlogs:[],
            show:'我发布的博客',
            

         }
         this.removeBlog = this.removeBlog.bind(this)
         this.republishBlog = this.republishBlog.bind(this)
    }
    
    componentDidMount(){
        let userID = this.props.match.params.userID
        //console.log(userID)
        this.fetchMyblogs(userID)
        this.fetchIzanedBlogs(userID)
       
    }
    async fetchMyblogs(id){
        let res = await api.get('/blog/myblogs',{userID:id})
        console.log(res)
        if(res.code===0){
            let blogIDRemoved = []
            for(let ele of res.data){
                if(!ele.blog.isPublished){
                    blogIDRemoved.push(ele.blog._id)
                }
            }
            this.setState({
                myblogs:res.data,
                blogIDRemoved
            })
          
        }
    }
    async fetchIzanedBlogs(userID){
        let res = await api.get('/user/izanedblogs',{userID})
        if(res.code===0){
            console.log('我的赞博客：',res.data)
            this.setState({IzanedBlogs:res.data})
        }
    }
    id2time(id) {
        let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
        return time.toISOString().substr(0,10)

    }
    changeShow(type){
        this.setState({show:type})

    }
    async removeBlog(blogID){

            let res = await api.post('/blog/remove',{blogID})
            if(res.code === 0){
                
                
                toast.success('成功从首页删除，博客以及保存为草稿',{autoClose:2000})
            }
    }
    async republishBlog(blogID){
        let res = await api.post('/blog/removetopublish',{blogID})
            if(res.code === 0){
                
                toast.success('重新发布成功',{autoClose:1200})
            }
    }
    render(){
        return(
            <div id = 'Manage-big-body'>
            <ToastContainer/>
                <div id='home-top' >

                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history} name = '博客管理'/>
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
              <TopTitleFixedWithTab title='管理博客' tabs={['我发布的博客','我赞过的博客'] } changeShow={this.changeShow.bind(this)} selected={this.state.show}/>
              <div id='manage-body'>
               
               <If condition={this.state.show==='我发布的博客'}>
                <Then>
                    <div id='myblogs'>

                    { 
                         this.state.myblogs.length !== 0 ?
                        <ManageBlogTable    blogs = {this.state.myblogs} 
                                            history = {this.props.history} 
                                            blogIDRemoved = {this.state.blogIDRemoved}
                                            republishBlog = {this.republishBlog}
                                            removeBlog = {this.removeBlog}/>
                        :
                        <div id = 'no-blogs'>
                            您还没有发布过博客
                            🤷‍
                        </div>
                    }
                    </div>
                </Then>
                <Else>
                    <div id='I-zaned-blogs'>
                    {   this.state.IzanedBlogs.length !== 0 ?

                        this.state.IzanedBlogs.map(blog=>
                            <div className='blog-item' key={blog.blog._id} >
                             <BlogItem blog={blog} history={this.props.history}></BlogItem>
                        </div>
                        )
                        :
                        <div id = 'no-blogs'>
                        您还没有赞过的博客
                        🤷‍
                    </div>
                    }
                    </div>
                </Else>
               </If>
              </div>
            </div>
        )
    }
}
export default Manage