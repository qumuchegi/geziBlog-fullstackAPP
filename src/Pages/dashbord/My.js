import React,{Component} from 'react';
import UserInfo from '../../components/UserInfo';
import '../../Css/My.css'
import UserEdit from '../../components/UserEdit';
import {Link} from  'react-router-dom';
import UseHistoryPath from '../../components/UseHistoryPath';

class My extends Component{
    constructor(props){
        super(props);
        this.state={
            username:''
             
        }
        this.exitfather = this.exitfather.bind(this)
    
    }
     
    componentDidMount(){
        if(localStorage.getItem('userInfo')){
            console.log('获取用户信息1',localStorage.getItem('username'))
            this.setState({username:localStorage.getItem('username')})
             
        }else{
            console.log('0')
        }
       
    }
    exitfather(){
        this.setState({username:null})
    }
    render(){
        return(
            <div>
                <div id='home-top'>
                    <div id='gezi-title'>
                    <img src = './img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {this.props.history}/>
                    </div>
                     
                    {
                        localStorage['imgAvatar_url'] ? 
                        <>
                            <div id='home-avatar'>
                            <img src={'http://localhost:3001/'+localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')} alt='' ></img>
                            </div>
                        </>
                        :
                        <div id='home-not-login'>
                        <Link to={{pathname:'/login'}} style={{textDecoration:'none'}}><span>登录/注册</span></Link>
                        </div>
                    }
                </div>
                 <div  id='my-body'>
                    <div>
                        <UserInfo id='userinfo' exitfather={this.exitfather}/>
                    </div>
                
                    <div id='button-container'>
                    {
                        this.state.username ? <UserEdit history={this.props.history}/> : null
                    }
                    </div>
                 </div>
            </div>
        )

    }
}
export default My;