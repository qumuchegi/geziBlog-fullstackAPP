import React,{Component} from 'react';
import api from '../api';
import UseHistoryPath from '../components/UseHistoryPath';
import { ToastContainer, toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import '../Css/ModifyBlog.css';
import TextareaAutosize from 'react-textarea-autosize';
import TextareaMarkdown from 'textarea-markdown'
import UploadPicture from '../components/UploadPicture';
import {TopTitleFixed} from '../components/TopTitleFixed';


export class ModifyBlog extends Component{
    constructor(props){
        super(props);
        this.state = {
            blog:'',
            newBlogContent:'',
            newTitle:'',
            newType:''

        }
    }
    componentDidMount(){
        this.fetchBlog()
       
    }
    async fetchBlog(){
        let res = await api.get('/blog/ablog',{blogID:this.props.match.params.blogID})
        if(res.code === 0){
            this.setState({blog:res.data.blog})
            this.setState({newBlogContent: res.data.blog.blogContent,newTitle: res.data.blog.blogTitle})
            console.log(res.data)
            let textarea = document.querySelector("textarea");
            new TextareaMarkdown(textarea) ;
        }
    }
    async rePublish(){
        let res = await api.post('/blog/modify',{
            content:this.state.newBlogContent,
            title:this.state.newTitle,
            blogID:this.props.match.params.blogID,
            isdraft:false})
        if(res.code ===0 ){
            toast.success('博客修改成功并发布！',{autoClose:1200})
        }

    }
    async draft(){
        let res = await api.post('/blog/modify',{
            content:this.state.newBlogContent,
            title:this.state.newTitle,
            blogID:this.props.match.params.blogID,
            isdraft:true})
        if(res.code ===0 ){
            toast.success('博客修改成功并作为草稿！',{autoClose:1200})
        }

    }
/*
              username:localStorage['username'],
              userID:localStorage['_id'],
              blogContent:this.state.editContent,
              title:this.state.title,
              type:this.state.blogType
*/
    render(){
        return(
            <div id = 'modify-blog-body'>
              <ToastContainer/>
              <TopTitleFixed title = '修改博客'/>
              <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history} name = '修改博客'/>
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
               
               <div id = 'blog-title-content-labels'>
                    <div id = 'republish'>
                        <div onClick = {()=>this.rePublish()}>
                            发布
                        </div>
                        <div onClick = {()=>this.draft()}>
                            保存为草稿
                        </div>
                    </div>
                  {
                      this.state.blog ?
                      <div>
                          <div id = 'modify-title-picture'>
                            <div>修改标题：
                              <input type = 'text'  value = {this.state.newTitle} onChange = {(e)=>this.setState({newTitle:e.target.value})}/>
                            </div>
                            <div >修改插图：
                            <UploadPicture url = {'/uploadordeletepicture/modifyblogpicture'}/>
                            </div>
                          </div>
                          <div>
                              <div>修改内容：</div>
                              <TextareaAutosize  
                                        minRows={3} 
                                        id="editor" 
                                        value={this.state.newBlogContent}
                                        data-preview="#preview" 
                                        onChange = {(e)=>this.setState({newBlogContent:e.target.value})}>
                                </TextareaAutosize>                          
                          </div>
                      </div>
 
                      : 
                      null
                  }
               
               </div>
               <div id = 'preview-body'>
                    <h1>{this.state.newTitle}</h1>
                    <div id = 'preview'>
                    
                    </div>
               </div>
              

            </div>
        )
    }
    
}