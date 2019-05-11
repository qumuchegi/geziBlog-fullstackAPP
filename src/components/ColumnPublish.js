import api from '../api'
import {useState,useEffect} from 'react';
import React from 'react'
import Select from 'react-select';
import '../Css/ColumnPublish.css';
import { ToastContainer, toast } from 'react-toastify';

const labels_options = [
    { value: 'javascript', label: 'javascript' },
    { value: 'nodejs', label: 'nodejs' },
    { value: 'python', label: 'python' },
    { value: 'swift', label: 'swift' },
    { value: 'C#', label: 'C#' },
    { value: 'React', label: 'React' },
];
function ColumnPublish(){
    let [labels,setLabels] = useState()
    let [columnName,setColumnName] = useState()
    let [creator,setCreator] = useState(localStorage['username'])
    let [description,setDescription] = useState()
    let [picture,setPicture] = useState()
    let [localPicture,setLocalPicture] = useState()

    useEffect(()=>{
      
    },[])
    function changeMultiSelect(options){
      console.log(options)
      let values =[]
      options.map(i=>values.push(i.value))
      setLabels(values)
    }
    function loadPicture(e){
        let formData = new FormData()
        let file =  e.target.files[0];
        
        if(file){
            console.log(file)
            formData.append('columnPicture',file)
            formData.append('creator',creator)
            setPicture(formData)

            var reader = new FileReader();
            reader.readAsDataURL(file) 
            reader.onload=function(){
                console.log(this.result)//base64格式
                setLocalPicture(this.result)
            }
        }else{
            setPicture(picture)
        }
    }
     
    async function publishColumn(){
        if(!creator) return toast.warn('请先登录！',{autoClose:1000})
        let now = Date.now()
        now = new Date(now)
        now = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`

        if(labels && columnName &&  description && picture  ){
            let res1 = await api.post('/column/create',{
                columnName,
                creator,
                creatorID:localStorage['_id'],
                creatorAvatar:localStorage['imgAvatar_url'],
                description,
                labels,
                now
            })
            if(res1.code===0){
                picture.append('columnID',res1.data.columnID)
                let config={headers: { 'Content-Type': 'multipart/form-data'}}
                let res = await api.post('/column/picture',
                 picture,config)
                if(res.code===0) toast.success('专栏创建成功！',{autoClose:2000})
            }else if(res1.code == 2){
                toast.warn('你已经右相同的专栏名！',{autoClose:1300})
            }
        }else{
            console.log(labels ,columnName , description , picture)
            toast.warn('请填写完整！',{autoClose:2000})
        }

    }
    return(
        <div id='column-publish' >
          <ToastContainer/>
          <div id='column-name-input' className='column-input'>
              <input type='text' placeholder='专栏名' onChange={(e)=>setColumnName(e.target.value)}></input>
          </div>
          <div id='column-creator' className='column-input'>
              <p>创建者：{localStorage['username']}</p>
          </div>
          <div id='column-description-input' className='column-input'>
              <textarea  rows='10' placeholder='专栏描述'  onChange={(e)=>setDescription(e.target.value)}></textarea>
          </div>
          <div id='column-labels-input'>
                <Select
                        closeMenuOnSelect={false}
                        placeholder='话题标签'
                        onChange={changeMultiSelect} 
                        isMulti
                        options={labels_options}
                        
                />
          </div>
          <div id='column-picture-input' className='column-input'>
              <p>给专栏配一张图片</p>
               {localPicture?<img src={localPicture} id='preview-column-picture' alt=''></img>:null}
              <input type='file' id='picture-input' onChange={(e)=>loadPicture(e)} style={{display:'none'}}></input>
               <label for='picture-input' id = 'avatar-label'>
                <i className="fa fa-picture-o" 
                                            aria-hidden="true" 
                                            style={{opsition:'relative',left:'10'}}  
                                        ></i>
                上传图片
               </label>
          </div>
           
          <div id='publish-column-button'>
              <span onClick={()=>publishColumn()}>发布</span>
          </div>
          
        </div>
    )
}
export default ColumnPublish