import React,{useState,useRef} from 'react';
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';
import '../Css/UploadPicture.css'


function UploadPicture({url}){
    const [reallyUpload, setReallyUpload] = useState(false)
    const [localPicturePath, setLocalPicturePath] = useState()
    const [pictureFormData, setPictureFormData] = useState()
    const [serverPicturePath, setserverPicturePath] = useState()
    const pictureRef = useRef(null)

     
    function pictureHandler(){  
        let file = pictureRef.current.files[0]
        let reader = new FileReader()
        let formData = new FormData()

        console.log(file)

        if(file){
            setReallyUpload(true)
            reader.readAsDataURL( file )
            reader.onload = function(){
                setLocalPicturePath(this.result)
            }
            formData.append('picture',file)
            formData.append('uploader',localStorage['username'])
            setPictureFormData(formData)
        }else{
            setReallyUpload(false)
            setLocalPicturePath(null)
            setPictureFormData(null)
        }
    }
    async function upload(){
        let config = {headers: { 'Content-Type': 'multipart/form-data' }}
        let res = await api.post(url,pictureFormData,config)
        if(res.code === 0){
            toast.success('成功上传图片',{autoClose:1200})
            setserverPicturePath(res.data.pictureURL)

        }
    }
    function cancel(){
        setReallyUpload(false)
        setLocalPicturePath(null)
        setPictureFormData(null)
    }
    return(
        <div id = 'upload-picture-body'>
            <ToastContainer/>
            <span id = 'title'>上传图片</span>
            <input type = 'file' ref = {pictureRef}  onChange = {pictureHandler} id = 'input'/>
            <div id = 'really-upload'>
                {
                    reallyUpload && !serverPicturePath ?
                   <div>
                       <div>
                            确定上传这张图片吗？
                            <img src = {localPicturePath} alt = ''/>
                       </div>
                       <div onClick = {()=>upload()} className = 'yes-no'>✅ 确定</div>
                       <div onClick = {()=>cancel()} className = 'yes-no'>❌ 取消</div>
                   </div> 
                   :
                   null

                }
            </div>
            <div id = 'uploaded-path'>
                {
                    serverPicturePath ?
                    <div>
                        <div>图片在服务端的路径:
                         {serverPicturePath}
                        </div>
                        <div>
                            您可能需要在博客中添加图片的路径：
                            <div id = 'picture-path-can-add-to-blog'>
                             {'![](http://localhost:3001/'+serverPicturePath.replace(/server\/asset\/blogImg\//,'')+')'}
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
            </div>
        </div>
    )
}
export default UploadPicture
// let url = '![](http://localhost:3001/'+res.data.pictureURL.replace(/server\/asset\/blogImg\//,'')+')'
