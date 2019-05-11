import React from 'react'
import {useState,useEffect} from 'react';
import api from '../api';
import MyColumnItem from './MyColumnItem'
import '../Css/ColumnEditor.css';
import {TopTitleFixed} from './TopTitleFixed';

function ColumnEditor(){

    let [article,setArticle] = useState({})
    let [myColumn,setMyColumn] = useState([])
    async function fetchMyCollumn(){//获取我参与或者创建的专栏
          let res = await api.get('/column/usercolumn',
          {username:localStorage['username']})
          if(res.code === 0){
            setMyColumn(res.data)
          }
    }
    useEffect(() => {
         fetchMyCollumn()
    },[])
    useEffect(() => {
       console.log(myColumn)
    },[])
    return(
        <div id='collumn-editor-body'>
  
           <div id='column-editor-items'>
             {
               myColumn ?  
               myColumn.map(e => <MyColumnItem column={e} key={e._id}/>)
               : null
             }
           </div>
        </div>
    )
}

export default ColumnEditor