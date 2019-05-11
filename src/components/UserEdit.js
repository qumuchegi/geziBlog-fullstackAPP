import React,{Component} from 'react';
import '../Css/UserEdit.css';
import { Link } from 'react-router-dom';
import api from '../api';

class UserEdit extends Component{
    constructor(props){
        super(props)
        this.state={
            notReadComments:[],
            notReadReply:[],
            starsFromOthers:[],
            notReadArticleComments:[],
            notReadArticleReplys:[],
        }
    }
    componentDidMount(){
        console.log(this.props.history)
    }
    componentWillMount(){
        this.fetchMyMessage()
    }
    async fetchMyMessage(){
        let res = await api.get('/user/mymessage',{username:localStorage['username']})
        if(res.code===0){
            console.log(res.data)
            if(res.data){
                this.setState({
                    notReadComments:res.data.commentNotRead,//blogID,pinglunContent,pinglunTime,username
                    notReadReply:res.data.replyNotRead,
                    starsFromOthers:res.data.starsFromOthers,
                    notReadArticleComments:res.data.articleCommentNotRead,
                    notReadArticleReplys:res.data.articleReplyNotRead
                })    
            }
            
        }
        
    }
    render(){
        return(
            <div id='user-edit-body'>
             
                <Link id='blog-edit'  to={{pathname:'/editblog'}} className='link'>
                    < div>
                       <img src='../img/edit.svg' alt='' width='30px'></img>
                    </div>
                 编辑博客
                </Link>
               
                <Link id='blog-manage' to={{pathname:'/manage/'+localStorage['_id']}} className='link'>
                    < div>
                       <img src='../img/manage.svg' alt='' width='30px'></img>
                    </div>
                管理博客
                </Link>
                <Link id='my-pinglun' to={{pathname:'/mycomment'}} className='link'>
                    < div>
                       <img src='../img/comment.svg' alt='' width='30px'></img>
                    </div>
                我的评论
                </Link>
                <Link id='message' to={{pathname:'/message'}} className='link'>
                    <div>
                        <img src='../img/message.svg' alt='' width='30px'></img>
                    </div>
                消息{this.state.notReadComments.length + 
                    this.state.notReadReply.length + 
                    Number(this.state.starsFromOthers.filter(i=>i.hasRead===false).length||'') +
                    Number(this.state.notReadArticleComments.length) +
                    Number(this.state.notReadArticleReplys.length)


                    }
                </Link>
                <Link id='zan' to={{pathname:'/myshare'}} className='link'>
                   <div>
                       <img src='../img/share-active.svg' alt='' width='30px'></img>
                   </div>
                我的分享
                </Link>
                <Link id='watch' to={{pathname:'/mywatch/'+localStorage['_id']}} className='link'>
                   <div>
                       <img src='../img/watch.svg' alt='' width='30px'></img>
                   </div>
                我的关注
                </Link>
                <Link id='column' to={{pathname:'/mycolumnmanage'}} className='link'>
                   <div>
                       <img src='../img/column.svg' alt='' width='30px'></img>
                   </div>
                管理专栏
                </Link>
            </div>
        )
    }

}
export default UserEdit