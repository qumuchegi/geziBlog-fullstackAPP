import React,{Component} from 'react';
import '../Css/UserInfo.css'
import { Link } from 'react-router-dom'


class UserInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            notRefresh:true
        }
        this.toregister = this.toregister.bind(this)
    }
    componentDidMount(){
        this.setState({username:localStorage['username']})
        
    }
    shouldComponentUpdate(){
        return this.state.notRefresh
    }

   toregister(path){
     this.props.toregister(path)
   }
   exit(){
    localStorage.clear()
    this.setState({notRefresh:true})
    this.setState({username:null})
    this.props.exitfather()
   }
 
    render(){
        return(
            <div id="user-info">
            {
                this.state.username ?
                <div>
                       <div className="info" >
                            <div id="short-profile">
                                <div id='avatar-container'>
                                    <img src={'http://localhost:3001/'+localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')}  alt=''  ></img>
                                </div>
                                <div id='profile-n-j'>
                                 <div id='profile-name'>{localStorage['username']}</div>
                                 <div id='profile-job'>{localStorage['job']}</div>
                                </div>
                                <div id='exit-container' >
                                    <div onClick={()=>this.exit()} id='exit-button' >
                                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                                        <span>退出</span>
                                    </div>
                                </div>
                             
                            </div>
                            <div id='more-container'>
                                <div id='more-profile'>
                                    <div>
                                        <span className='key'>用户名></span>
                                        <span className='value'>{localStorage['username']}</span>
                                    </div>
                                    <hr/>
                                    <div>
                                        <span className='key'>职业></span>
                                        <span className='value'>{localStorage['job']}</span>
                                    </div>
                                    <hr/>
                                    <div>
                                        <span className='key'>性别></span>
                                        <span className='value'>{localStorage['sex']}</span>
                                    </div>
                                    <hr/>
                                    <div>
                                        <span className='key'>一句话自我介绍></span>
                                        <span className='value'>{localStorage['selfIntroduction']}</span>
                                    </div>
                                    <hr/>
                                    <div>
                                        <span className='key'>技术栈></span>
                                        <span className='value'>{localStorage['techs']}</span>
                                    </div>

                                </div>
                                <div id='more-info'>
                                <ul className='fa-ul'>
                                <li>
                                    <i className="fa fa-th" aria-hidden="true"></i>
                                    <p>专栏</p>
                                    <p>{localStorage['myColumn'].split(',').length}</p>
                                </li>
                                <li>
                                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                                    <p>关注用户</p>
                                    <p>{localStorage['watchAuthors'].split(',').length}</p>
                                </li>
                                <li>
                                <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                    <p>赞</p>
                                    <p>{ localStorage['starsGiveOthers'].split(',').length}</p>
                                </li>
                                </ul>
                                </div>
                            </div>
                           
                           
                       </div>
                    
                   </div> :
                    <div>
                        <div className="touxiang-nologin">
                            <img src='./img/user.svg' alt=''></img>
                        </div>
                        <div className="info-nologin">
                         
                            <Link className='button' to={{pathname:'/login'}}>
                            <i className = "fa fa-sign-in" aria-hidden = "true"></i>
                            登录
                            </Link>
                            <Link className='button' to={{pathname:'/register'}}>
                            <i className = "fa fa-registered" aria-hidden="true"></i>
                            注册
                            </Link>
                        
                        </div>
                    </div>

            }
            </div>
        )
    }

}
export default UserInfo