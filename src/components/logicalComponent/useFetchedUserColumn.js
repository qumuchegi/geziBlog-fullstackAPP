import api from '../../api'
import {useState,useEffect} from 'react';
 

// * 自定义请求用户专栏hooks
function useFetchedUserColumn(username){
     let [column,setColumn] = useState('0')
     async function fetch(){
         let res = await api.get('/column/usercolumn',{username})
         if(res.code===0){
             console.log(res)
            setColumn(res.data)
         }
     }
     useEffect(()=>{
         fetch()
     },[username])

     return column
}
export default useFetchedUserColumn;