import api from '../../api';

export const fetch_start = () =>({
    type:'FETCH_START'
})
export const fetch_success = (res) =>({
    type:'FETCH_SUCCESS',
    res:res.data,
    code:res.code,
    page:res.page
})
export const fetch_fail = (res) =>({
    type:'FETCH_FAIL',
    code:res.code
})


export const fetch_all_Blogs = (page) =>{
    return async (dispatch,getState)=>{// Redux中间件
        dispatch(fetch_start())
        let res = await api.get( '/blog/getall', {page})
        console.log('Redux fetch:', res)
        if(res.code === 0){
            dispatch(fetch_success(res))
        }else{
            dispatch(fetch_fail(res))
        }
    }
}

export const fetch_a_Blog = (blogID) =>{
    return async (dispatch)=>{
        dispatch(fetch_start())
        let res = await api.get('/blog/ablog',blogID)
        console.log(res)
        if(res.code === 0){
            dispatch(fetch_success(res.data))
        }else{
            dispatch(fetch_fail(res))
        }
    }
}

export const fetch_commen = () => {//通用的请求action，


}
