import React,{Component} from 'react';
import {TopTitleFixed} from '../../components/TopTitleFixed';
import '../../Css/Edit.css'
import TextareaMarkdown from 'textarea-markdown'
import ProgressButton from 'react-progress-button'
import api from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextareaAutosize from 'react-textarea-autosize';
import Select from 'react-select';
import {If ,Else, Then} from 'react-if';


let blog_type_options = [
    { value:'前端', label:'前端'},
    { value:'后端', label:'后端'},
    { value:'JavaScript',label:'JavaScript'},
    { value:'React',label:'React'},
    { value:'Vue',label:'Vue'},
    { value:'Node.js',label:'Node.js'},
    { value:'Express',label:'Express'},
    { value:'MongoDB',label:'MongoDB'},
    { value:'React Native',label:'React Native'}

]
class Edit extends Component{
    constructor(props){
        super(props);
        this.state={
            editContent:'',
            buttonState:'',
            title:'',
            blogType:'',
            formData:'',
            editType:''
        }
        this.pictureInput = React.createRef()
        this.blogEditArea = React.createRef()
    }
    componentDidMount(){
        let textarea = document.querySelector("textarea");
        new TextareaMarkdown(textarea) ;
        
    }
    async publish(){
        if(!this.state.title) return  toast.warn('请输入标题',{autoClose:2000})
        if(!this.state.editContent) return toast.warn('请输入内容',{autoClose:2000})
        if(!this.state.blogType) return toast.warn('输入文章标签',{autoClose:2000})
        let res = await api.post('/blog/publish',
          {
              username:localStorage['username'],
              userID:localStorage['_id'],
              blogContent:this.state.editContent,
              title:this.state.title,
              type:this.state.blogType
         })
        console.log(res)
        if(res.code===0){
            console.log(res.data)
            toast.success('成功发布！',{autoClose:2000})
        }else{
            toast.warn('发布失败！',{autoClose:2000})
        }
    }
    contentChange(e){
        this.setState({editContent:e.target.value})
        console.log(e.target.value )
        //document.getElementById('preview').appendChild(md.render(this.state.editContent))
    }
    title(type,e){
        this.setState({
            [type] : e.target.value
        })
    }
    changeMultiSelect(type,option){
        console.log(option);
        if(option.length>3) return toast.warn('最多只能选择3个标签')
        let values =[]
        option.map(i=>values.push(i.value))
        this.setState({[type]:values})
    }
    async uploadPicture(){
        var formData = new FormData();
        var file = this.pictureInput.current.files[0];
        console.log(typeof file.name)
        if(file.name.match(/\s/g)){
              return toast.warn('文件名不能有空格～',{autoClose:1500})
        }
        
        formData.append('blogPicture',file)
        formData.append('username',localStorage['username'])
        console.log('formData',formData,'file',file)
        this.setState({formData})
        let config={headers: { 'Content-Type': 'multipart/form-data' }}
        let res = await api.post('/blog/picture',formData,config)
        if(res.code===0){
            console.log('图片上传成功',res)
            toast.success('图片上传成功',{autoClose:2000})
            let url = '![](http://localhost:3001/'+res.data.pictureURL.replace(/server\/asset\/blogImg\//,'')+')'
            this.setState((preState,props)=>(
                {
                    editContent:preState.editContent+url
                }
                ))
            //this.blogEditArea.current.focus()
        }
    }
    render(){
        return(
            <div id='edit-body'>
                <TopTitleFixed title='博客编辑'/> 
                <ToastContainer/>
                <If condition = {localStorage['username'] !== ''}>
                   <Then>
                        <div id='edit-top'>
                            <input placeholder='输入标题...' onChange={this.title.bind(this,'title')} id='title-input'/>
                           
                            <div onClick={this.publish.bind(this)} 
                                            state={this.state.buttonState} 
                                            id='pc'>
                                <img src='../img/publish.svg' width='20px' alt=''></img>
                                <div>发布</div>
                            </div>
                        </div>
                
                        <div id='edlit-preview'>
                            <div id='edit-area' >
                                <span style={{marginLeft:'2%',padding: '1%'}}>编辑博客正文： </span>
                                <span id='insert-picture-button'>
                                     
                                    <input  type='file' 
                                            id='picture-upload-input'
                                            ref={this.pictureInput} 
                                            name='blogPicture' 
                                            onChange={()=>this.uploadPicture()}
                                            style={{display:'none'}}>
                                    
                                    </input>
                                    <label for = 'picture-upload-input' id = 'picture-input'>
                                        <i className="fa fa-picture-o" 
                                            aria-hidden="true" 
                                            style={{opsition:'relative',left:'10'}}  
                                        ></i>
                                      插入图片
                                    </label>
                                    <Select 
                                        placeholder='选择文章标签'
                                        isMulti
                                        onChange={this.changeMultiSelect.bind(this,'blogType')} 
                                        options={blog_type_options}
                                        style={{color:'rgba(66,149,213)'}}
                                        id='edit-blog-type'
                                    />
                                </span>
                                <TextareaAutosize  
                                        ref={this.blogEditArea}
                                        minRows={30} 
                                        id="editor" 
                                        value={this.state.editContent}
                                        data-preview="#preview" 
                                        placeholder='使用markdown语法编辑'
                                        onChange={(e)=>this.contentChange(e)}>
                                </TextareaAutosize>
                            </div>
                            <div id='preview-container'>
                                <span style={{marginLeft:'2%',paddingTop: '6%',fontSize:'120%'}}>预览界面</span>
                                <div id='preview'>

                                </div>
                            </div>
                        </div>
              
                        <div id="publish">
                        <ProgressButton onClick={this.publish.bind(this)} 
                                        state={this.state.buttonState} 
                                        id='mobile'
                                        style={{color:'white',
                                                    backgroundColor:'#af9fd3',
                                                    fontWeight:'bolder',
                                                    borderRadius: '20px',}}>
                            发布
                        </ProgressButton>

                        </div>
                   </Then>
                   <Else>
                        <div id = 'no'>
                            <img src = './img/no1.svg' alt=''></img>
                            <div>
                             您还为登录
                            </div>
                        </div>
                   </Else>
                </If>
            </div>
        )
    }
}
export default Edit;