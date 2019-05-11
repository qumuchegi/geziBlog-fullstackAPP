/* 
  用 Hooks 做一个页面浏览历史的路径，

  如 首页 > 专栏 > 文章

  其中点击每个点可以导航到对应页面

*/

import React,{useState,useEffect,useReducer} from 'react';
import {store} from '../Redux/Reducers/index';
import {add_history,delete_history} from '../Redux/Actions/historyPath';
import uuid from 'uuid';
import '../Css/UseHistoryPath.css';

function UseHistoryPath({history,name }){
    const [Redux_History, setRedux_History] = useState([]);
    useEffect(() => {
        console.log( history)
        let route = history.location.pathname;
  
        if(history.action === 'POP'){
            store.dispatch(delete_history(store.getState().history.length - 2 ))

         }else if(history.action === 'PUSH'){
             store.dispatch(add_history(route, name))
         }
        setRedux_History(store.getState().history)
    },[])
    function toPath(index,ele){
        //history.push(ele.route)
        if(index === 0){
             
            store.dispatch(delete_history( index ))
            history.replace('/')
        }
        if(index + 1 === Redux_History.length ) return; // 点击的时当前的页面的导航
        console.log(1 + index - Redux_History.length); 
        history.go( 1 + index - Redux_History.length  )// 回退
        if(Redux_History.length - index > 2){
            store.dispatch(delete_history(   index  ))// 删除后面的导航历史
        }
    }
    return(
        <div id = 'use-history-body'>
            {   
            Array(...Redux_History).map((ele,index) => 
                    <span key = {uuid()} 
                          onClick = {() => toPath(index,ele)}>
                    > 
                    <span>{ele.name}</span> 
                    </span>
                )
            }
        </div>
    )
}

export default UseHistoryPath