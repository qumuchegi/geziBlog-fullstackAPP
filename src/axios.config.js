import axios from "axios";


import {history} from './AppRouter';

// 响应拦截
/*
axios.interceptors.response.use(res => {
    // 报错执行 axios then 方法错误的回调，成功返回正确的数据
    return res.data.code !== 0 ? Promise.reject(res.data) : res.data;
}, res => {
    // 如果 token 验证失败则跳回登陆页，并执行 axios then 方法错误的回调
    if (res.response.status === 401) {
        history.push("/login");
    }
    return Promise.reject("Not Allowed");
});
*/


// 请求拦截，用于将请求统一带上 token

axios.interceptors.request.use(config => {
    // 在 localStorage 获取 token
    let token = localStorage.getItem("token");
    console.log('axios配置:token',token)
    // 如果存在则设置请求头
    if (token) {
      
        config.headers['Authorization'] = token;
        console.log(config)
    }
    return config;
});
 
 
export default axios;

 