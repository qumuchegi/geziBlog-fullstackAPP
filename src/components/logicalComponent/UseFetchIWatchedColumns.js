import api from '../../api'
import {useState,useEffect} from 'react';

function UseFetchIWatchedColumns(username){
    console.log(username)
    const [columns, setColumns] = useState([])
    useEffect( ()=>{
        fetch()
    },[username])
    async function fetch(){
        let res = await api.get('/column/watchedcolumns',{username})
        if(res.code === 0){
            setColumns(res.data)
            console.log('自定义 Hooks fetch 关注的专栏',res.data)
        }
    }
    return columns

}

export default UseFetchIWatchedColumns