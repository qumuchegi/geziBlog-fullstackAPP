import React,{Component} from 'react';
import { TopTitleFixed } from '../components/TopTitleFixed';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import ProgressButton from 'react-progress-button'
import '../Css/Login.css'
import { createBrowserHistory } from 'history';
import {Link} from 'react-router-dom';

const history = createBrowserHistory();

class Login extends Component{
    constructor( props ){
        super( props );
        this.state = {
            username: '',
            password: '',
            buttonState: ''
        }
    }
    loginInfo( type, e ){
        this.setState({
            [type] : e.target.value
        })
    }
    async login() {
        console.log( this.state )
        let res = await api.post('/user/login', this.state)
        console.log(res.userInfo)
        if(res.code === 0 ){
            toast.success('登录成功', {autoClose:2000})
             
            localStorage.setItem('token', res.token)
            localStorage.setItem('userInfo', res.userInfo)
            for(var v in res.userInfo){
              
                console.log( v,res.userInfo[v] )
                localStorage.setItem(v, res.userInfo[v])

            }
            console.log('localStorage token:', localStorage.getItem('token'), 'userInfo', localStorage.getItem('username'))
            setTimeout( () => {
                history.goBack() 
            }, 2000)
        }else if(res.code === 1){
            toast.warn('密码错误',{ autoClose: 2000})
            setTimeout(() => {                         //之后会以异步请求代替
                this.setState({ buttonState: 'error'})
            }, 1000)
        }else{
            toast.warn('用户名不存在',{ autoClose: 2000})
            setTimeout(() => {                         //之后会以异步请求代替
                this.setState({ buttonState: 'error'})
            }, 1000)
        }
        
    }

    render(){
        return(
            <div id = 'login-body'>
               <TopTitleFixed title = '登录'></TopTitleFixed>
               <ToastContainer />
               <div id = 'login-form'>
                  <h3>格子博客</h3>
                  <Link to = {{pathname:'/register'}} 
                        style = {{textDecoration:'none',marginTop:'10%'}}>注册</Link>
                  <h2>登录</h2>
                  <input placeholder = "用户名" 
                         onChange = {this.loginInfo.bind( this, 'username')} 
                         className = 'input'></input>
                  <input type = 'password' 
                         placeholder = "密码" 
                         onChange = {this.loginInfo.bind(this,'password')} 
                         className = 'input'></input>
               
               </div>
               <div id='submit'> 
                   <ProgressButton onClick = {this.login.bind(this)} 
                                   state = {this.state.buttonState} 
                                   style = {{color:'#af9fd3',fontWeight:' bolder'}}>
                     登录
                   </ProgressButton>
                  </div>
            </div>


        )
    }

}
export default Login