import React,{useReducer} from 'react';
import {Link} from 'react-router-dom';
import uuid from 'uuid';
import '../Css/ManageBlogTable.css';

function  toBlogType(e){
    e.stopPropagation()//阻止事件冒泡
}
function id2time(id){
    let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    return time.toISOString().substr(0,10)
    
}
function reducer(state,action){
    switch(action.type){
        case 'remove':{
            state.push(action.blogID)
            state = [...new Set(state)]
            return state   
        }
        case 'republish':{
            let newstate = state.filter(ele => ele!==action.blogID)
            state = [...new Set(state)]
            return  newstate;
        }
        default: return state
    }

}
export function ManageBlogTable(props){
    const [state, dispatch] = useReducer(reducer,props.blogIDRemoved)
  
    function remove(blogID){
        props.removeBlog(blogID)
        dispatch({type:'remove',blogID})
        console.log(state)
    }
    function republish(blogID){
        props.republishBlog(blogID)
        dispatch({type:'republish',blogID})
        console.log(state)
    }
    return(
        <table>
            <tr>
                <th>
                    博客标题
                </th>
                <th>
                    标签
                </th>
                <th>
                    获赞
                </th>
                <th>
                    分享
                </th>
                <th>
                    发布时间
                </th>
                 
            
                <th>
                    操作
                </th>

            </tr>
            {
                props.blogs.map(e => <tr key = {uuid()}>
                    <td onClick={()=>props.history.push('/blogdetails/'+e.blog._id)}
                        id = 'blog-title'
                    >
                        {e.blog.blogTitle}
                    </td>
                    <td>
                        {
                            Array.from(e.blog.type).map(type=><Link to={{pathname:'/atypeblogs/'+type}}  
                                                                    key={type} 
                                                                    onClick={e=>toBlogType(e)}>
                                        <span className='blog-type' >{type}</span>
                            </Link>)
                        }
                    </td>   
                    <td>
                       {e.blog.starsNum||0}
                    </td>
                    <td>
                       {e.blog.shareNum||0}
                    </td>
                    <td>
                       {id2time(e.blog._id)}
                    </td>
                     
                    <td>
                        <div className = 'modify-remove' >
                            <Link to={{pathname:'/modifyblog/' + e.blog._id}} style = {{textDecoration:'none'}}>
                              修改内容
                            </Link>
                        </div>
                        {
                            !state.some(ele => ele===e.blog._id)   ?
                            <div className = 'modify-remove' onClick = {()=>remove(e.blog._id)}>删除</div>
                            :
                            <div className = 'modify-remove' onClick = {()=>republish(e.blog._id)}>发布</div>
                        }
                    </td>
                </tr>)
            }
           
        </table>
    )
}
// || props.blogIDRemoved.some(ele => ele===e.blog._id)