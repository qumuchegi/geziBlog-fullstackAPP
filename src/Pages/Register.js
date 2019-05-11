import React,{Component} from 'react';
import '../Css/Register.css';
import Select from 'react-select';
import ProgressButton from 'react-progress-button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../node_modules/react-progress-button/react-progress-button.css"
import "../components/TopTitleFixed";
import { TopTitleFixed } from '../components/TopTitleFixed';
import api from '../api';
import {Link} from 'react-router-dom'

const Sex_options = [
    { value:'男', label:'男'},
    { value:'女', label:'女'}
]
const Job_options = [
    { value: '学生', label: '学生' },
    { value: '前端工程师', label: '前端工程师' },
    { value: '后端工程师', label: '后端工程师' },
    { value: '移动IOS开发工程师', label: '移动IOS开发工程师' },
    { value: '安卓开发工程师', label: '安卓开发工程师' }
  ];
const Tech_options = [
    { value: 'javascript', label: 'javascript' },
    { value: 'nodejs', label: 'nodejs' },
    { value: 'python', label: 'python' },
    { value: 'swift', label: 'swift' },
    { value: 'C#', label: 'C#' },
    { value: 'React', label: 'React' },
];

class Register extends Component{
    constructor(props){
        super(props)
        this.state={
            username:'',
            password:'',
            password_confir:'',
            selfIntroduction:'',
            sex:'男',
            job:'学生',
            techs:'',
            imgAvatar:'',
            buttonState:'',
            hadFile:false,//头像是否以及下载准备上传
            formData:'',
            localAvatarPath:''
        }
        this.passwordInput1 = React.createRef()
        this.passwordInput2 = React.createRef()
        this.imgInput = React.createRef()
         
     }
    registerInfo(type,e) {
         this.setState( {
             [type] : e.target.value
         })
    }
    changeSelectValue( type, selectedOption ) {
        this.setState({ [type]: selectedOption.value });
        console.log(`Option selected:`, type, selectedOption.value);
    }
    changeMultiSelect( type,option ) {
        console.log( option );
        let values = []
        option.map( i => values.push( i.value ))
        this.setState({[ type ]: values})
    }
    changeAvatar(e) {
        var reader = new FileReader();
        var formData = new FormData();
        var file = this.imgInput.current.files[0];// file是一个Blob对象
        if(file){
            this.setState( { hadFile: true } )
            reader.readAsDataURL( file ) //读取Blob
            let _this = this
            reader.onload = function() {
               // console.log(this.result)//base64格式
                _this.setState( { localAvatarPath: this.result } )
            }
            formData.append('avatar', file)
            formData.append('username', this.state.username)
            console.log('formData', formData, 'file', file)
            this.setState({ formData })
        }else{
            this.setState({ hadFile: false, localAvatarPath: ''})

        }
    }
   
    async submit(){
        this.setState({ buttonState: 'loading' })
        console.log('提交', this.state)
        if(/作者/.test( this.state.username )) return toast.warn( '用户名不规范！',{ autoClose:2000 })
        if(
            this.state.username
            && this.state.password 
            && this.state.password_confir
            && this.state.selfIntroduction 
            && this.state.sex 
            && this.state.job 
            && this.state.hadFile
            && this.state.techs){
                if( this.state.password === this.state.password_confir ) {
                    console.log( '测试：', this.state.formData)
                    let config = {headers: { 'Content-Type': 'multipart/form-data' }}
                    let  {
                        username,
                        password,
                        selfIntroduction,
                        sex,
                        job,
                        techs,
                    } = this.state
                    let registerInfo = {
                        username,
                        password,
                        selfIntroduction,
                        sex,
                        job,
                        techs,
                    }
                    let res = await api.post('/user/register', registerInfo)
                    console.log('res',res)
                    if(res.code === 1) toast.warn('已经有相同用户名，请选择其他用户名',{autoClose:2000})
                    else {
                        toast.success('注册成功',{ autoClose:2000 })
                        let resAvatar = await api.post( '/user/avatar', this.state.formData , config)
                        console.log(resAvatar)

                    }
                    
                    console.log('formData', this.state.formData)
                }else {
                    toast.warn('密码不一致,请重新输入并确认密码',{ autoClose: 2000 });
                    this.passwordInput1.current.value = this.passwordInput2.current.value = null
                    setTimeout( () => {                         //之后会以异步请求代替
                        this.setState( {buttonState: 'error'} )
                    }, 1000 )
                }  
        }else{
            console.log('不完整')
            toast.warn('请填写完整', { autoClose:2000 } )
            setTimeout(() => {                       
                this.setState({ buttonState: 'error'})
            }, 1000)
           
        }
    }
    componentWillUnmount(){
       
    }
    render(){
        return(
            <div id = 'register-body'>
                <TopTitleFixed title = '注册'></TopTitleFixed>
                <ToastContainer />
                <div id = 'form'>
                  <h3>格子博客</h3>
                  <Link to = {{ pathname: '/login'}} style = {{textDecoration: 'none',marginTop: '10%'}}>登录</Link>
                  <h2>注册</h2>
                  <div>
                    <input placeholder = "用户名" 
                            onChange = {this.registerInfo.bind( this,'username')} 
                            className = 'input'/>
                  </div>
                  <div>
                    <input placeholder = "密码"   
                            type = 'password' 
                            onChange = {this.registerInfo.bind( this,'password')} 
                            className = 'input'
                            ref = {this.passwordInput1}/>
                    
                  </div>
                  <div>
                      <input placeholder = "确认密码" 
                            type = 'password' 
                            onChange = {this.registerInfo.bind(this,'password_confir')} 
                            className = 'input'
                            ref = {this.passwordInput2}/>
                  </div>
                 <div>
                    
                    <input type = "file" 
                           id = "avatar" 
                           className = 'input-avatar'
                           style={{display:'none'}}   
                           onChange = { this.changeAvatar.bind( this )} 
                           ref = { this.imgInput }></input>
                    <label for = 'avatar' id = "avatar-label" >
                        <i className="fa fa-picture-o" 
                                            aria-hidden="true" 
                                            style={{opsition:'relative',left:'10'}}  
                                        ></i>
                                        上传头像 
                    </label>
                    { this.state.localAvatarPath ? 
                      <img src = {this.state.localAvatarPath} 
                           alt = '' 
                           id = 'preview-avatar'></img>
                    :null }
                 </div>
                 <div>
                   <input placeholder = "写一句话介绍你自己" 
                          onChange = { this.registerInfo.bind( this,'selfIntroduction')} 
                          className = 'input'/>
                 </div>
                  <div id = "sex-radio" 
                       className = 'select'>
                    <Select 
                        placeholder = '性别'
                        onChange = { this.changeSelectValue.bind( this,'sex')} 
                        options = {Sex_options}
                        style = { {color:'rgba(66,149,213)'}}
                    />
                  </div>
                  <div id = 'job-radio' className = 'select'>
                    <Select 
                        placeholder = '职业'
                        onChange = {this.changeSelectValue.bind( this,'job')} 
                        options = {Job_options}
                        style = {{color:'rgba(66,149,213)' }}
                    />
                  </div>
                  <div id = "tech" className = 'select'>
                    <Select
                        closeMenuOnSelect = {false}
                        placeholder = '技术栈'
                        onChange = { this.changeMultiSelect.bind( this,'techs')} 
                        isMulti
                        options = { Tech_options }
                        style = { {color:'rgba(66,149,213)' }}
                    />
                  </div>
                  <div id = 'submit'> 
                   <ProgressButton onClick = {this.submit.bind(this)} 
                                   state = {this.state.buttonState} 
                                   style = {{color:'#af9fd3',fontWeight:' bolder'}}>
                     提交
                   </ProgressButton>
                  </div>
                  
                </div>
            </div>
        )
    }

}
export default Register;