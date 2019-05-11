import React,{useState} from 'react';
import api from '../api'
import { ToastContainer, toast } from 'react-toastify';
import '../Css/PublishLink.css'

export function PublishLink(){
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [feel, setFeel] = useState('')
    

    function inputHandler(e){
        setLink(e.target.value)
    }
    function textareaHandler(e){
        setFeel(e.target.value)
    }
    async function publish(){
        if(!title || !link || !feel) return toast.warn('请填写完整！！！',{autoClose:2000})
        let res = await api.post('/activelink',{title,link,feel,username:localStorage['username'],avatar:localStorage['imgAvatar_url']})
        if(res.code === 0){
            toast.success('发布连接成功！',{autoClose:2000})
        }

    }
    return(
        <div id = 'publish-link-body'>
          <ToastContainer/>
          <div>
              <input type = 'text' placeholder = '标题' onChange = {e => setTitle(e.target.value)}/>
          </div>
          <div>
              <input type = 'text' placeholder = '在这里粘贴您的连接' onChange = {(e)=>inputHandler(e)}/>
          </div>
          <div>
              <textarea placeholder = '尽情吐露心声吧... ...' rows = '10' onChange = {(e)=>textareaHandler(e)}/>
          </div>
          <div>
              <div onClick = {()=>publish()} id = 'publish-button'>发布</div>
          </div>
        </div>
    )
}
