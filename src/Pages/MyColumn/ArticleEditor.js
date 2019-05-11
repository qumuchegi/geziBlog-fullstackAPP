import React,{useState,useEffect} from 'react';
import api from '../../api';
import '../../Css/ArticleEditor.css';
import TextareaAutosize from 'react-textarea-autosize';
import TextareaMarkdown from 'textarea-markdown'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TopTitleFixed} from '../../components/TopTitleFixed';
import UseHistoryPath from '../../components/UseHistoryPath';
import {Link} from 'react-router-dom'

function  ArticleEditor(props){
   const [columnID,setColumnID] = useState(props.match.params.columnID )
   const [column,setColumn] = useState({})
   const [title,setTitle] = useState('')
   const [author, setAuthor] = useState('')
   const [content, setContent] = useState('')
   const [time, setTime] = useState('')

   const [participator, setParticipator] = useState([])
   const [article, setArticle] = useState([])
  
   const [pictureFormdata, setPictureFormdata] = useState()
   const [isPreview, setIsPreview] = useState(false)//是否预览

   const textAreaRef = React.createRef()
   const pictureInputRef = React.createRef()
   useEffect(()=>{
       console.log(columnID)
       fetchColumn()
       let textarea = document.querySelector("textarea");
       new TextareaMarkdown(textarea) ;
       
   },[])
   async function fetchColumn(){
       let res = await api.get('/column/acolumn', {columnID})
       if(res.code === 0){
           console.log(res.data)
           setColumn(res.data)
           setArticle(res.data.article)
           setParticipator(res.data.participator)
       }
   }
   function id2time(id){
   
        let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
        console.log(time)
        return String(time).substr(0,20)
  }
    function contentChange(e){
        setContent(e.target.value)
    }
    async function publish(){
        if(!content || !title) return toast.warn('请编辑完整',{autoClose:1300})
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`
        console.table(title,content)
        let res = await api.post( '/column/article',{title,
                                                     author:localStorage['username'],
                                                     authorID:localStorage['_id'],
                                                     content,
                                                     time:now,
                                                     columnID})
        if( res.code === 0){
            toast.success('文章发布成功',{autoClose:1200})

        }
    }
    async function uploadPicture(){
        var formData = new FormData();
        var file = pictureInputRef.current.files[0];
        console.log(typeof file.name)
        if(file.name.match(/\s/g)){
              return toast.warn('文件名不能有空格～',{autoClose:1500})
        }
        
        formData.append('articlePicture',file)
        formData.append('username',localStorage['username'])
        console.log('formData',formData,'file',file)
        setPictureFormdata(formData)
        let config={headers: { 'Content-Type': 'multipart/form-data' }}
        let res = await api.post('/column/articlepicture',formData,config)
        if(res.code===0){
            console.log('图片上传成功',res)
            toast.success('图片上传成功',{autoClose:2000})
            let url = '![](http://localhost:3001/'+res.data.path.replace(/server\/asset\/columnarticlePicture\//,'')+')'
            console.log(content+url)
            setContent(content+url)
            
        }
    }
    return(
        <div id = 'article-editor-big-body'>
             <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {props.history} name = '编辑专栏文章'/>
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
       
        <div id = 'article-editor-body'>
           <TopTitleFixed title = {String(column.name)}></TopTitleFixed>
           
           <ToastContainer/>
           <div id = 'editor-area'>
              <h3 style = {{textAlign:'center',paddingTop:'2%'}}>在此编辑您的专栏文章</h3>
              <input type = 'text' 
                     placeholder = '输入标题' 
                     id = 'title-input'
                     onChange = {e => setTitle(e.target.value)}></input>
              <span id = 'article-publish' onClick = {() => publish()}>发布</span>
              <span id = 'preview-button' onClick = {()=>setIsPreview(!isPreview)}>
              {
                  isPreview ? '编辑':'预览' 

              }</span>
              <input    type='file' 
                        id='picture-upload-input'
                        ref={pictureInputRef} 
                        name='blogPicture' 
                        onChange={()=>uploadPicture()}
                        style={{display:'none' }}>
                     </input>
                     <label for = 'picture-upload-input' id ='label'>
                       <i className = "fa fa-file-image-o" aria-hidden="true"></i>
                     </label>
              <div id = 'content-textarea-preview'>
                <span  className = {!isPreview ? 'teaxtarea-show' : 'textarea-hidden'}>
                   
                    
                </span>
                
                  <TextareaAutosize  
                            ref={textAreaRef}
                            minRows={26} 
                            id="editor" 
                            className = {!isPreview ? 'teaxtarea-show' : 'textarea-hidden'}
                            value={content}
                            data-preview="#preview" 
                            placeholder='使用markdown语法编辑'
                            onChange={(e)=>contentChange(e)}>
                 </TextareaAutosize>
           
                 <div id = 'preview' className = {isPreview ? 'preview-show':'preview-hidden'}>
                        
                 </div>  

            
                      
                                
              </div>
           </div>
          
           <div id = 'column-info'>
             <div> 
                 <img src = {'http://localhost:3001/' + String(column.picture).replace(/server\/asset\/columnTopImg/,'')}
                 id = 'column-picture'
                 alt = ''></img>
                 <div id = 'creator-info'>
                    <img src = {'http://localhost:3001/'+
                                String(column.creatorAvatar).replace(/server\/public\/img\/usersAvatar\//,'')}
                                id = 'creator-avatar'
                                alt = ''></img>
                    <div  id = 'creator-name'>
                        <span style = {{fontSize:'60%'}}>创建人：</span>
                        <div>{column.creator}</div>
                    </div>
                    <div  id = 'created-time'>
                        <span  style = {{fontSize:'60%'}}>创建时间：</span>
                        <div style = {{fontSize:'60%'}}>{ id2time(String(column._id))}</div>
                    </div>
                 </div>
             </div>
             <div id='column-more-info'>
                 <div id = 'column-name'>{column.name}</div>
                 <div id = 'column-description'>
                    <span>专栏介绍</span>
                    <p>
                    {column.description}
                    </p>
                 </div>
                 <hr style={{margin:'1%'}}/>
                 <div id='column-labels'>
                 <span>专栏标签</span>
                  <div>
                     {Array(column.labels).map(e => <span key={e} className='label'>#{e}</span>)}

                  </div>
                  <hr style={{margin:'1%'}}/>
                  <div id = 'watch-article'>
                      <div>
                          <div className = 'key'>关注</div>
                          <div>{Array.prototype.flat.call([column.watcher]).length}</div>
                      </div>
                      <div>
                          <div className = 'key'>文章</div>
                          <div>{ article.length}</div>
                      </div>
                  </div>
                  <hr style={{margin:'1%'}}/>
                  <div>
                      <h4>共有{Array.prototype.flat.call([column.participator]).length}人参与此专栏</h4>
                      <div id = 'participators-avator'>
                          { 
                            participator.map(e => <div key={e.username}> 
                               <Link to={{pathname:'/userpage/'+e.creatorID}} style={{ textDecoration: 'none'}}>
                                 <img src={'http://localhost:3001/'+
                                      e.avatar.replace(/server\/public\/img\/usersAvatar\//,'')}
                                      className='avatar'
                                    alt=''></img>
                                </Link>
                            </div>)
                          }
                      </div>
                  </div>
                 </div>
             </div>

           </div>
        
        </div>
    </div>
    )
}
export default ArticleEditor
/*
   
*/