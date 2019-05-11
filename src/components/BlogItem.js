import React,{useEffect,useState}  from 'react';
import {Link} from 'react-router-dom';
import '../Css/BlogItem.css';

function BlogItem(props){
    let [blog,setBlog] = useState(props.blog)

    useEffect(()=>{
      //console.log( blog.blog.blogContent.match(/[\u4e00-\u9fa5]*/))
         
    },[])

    function id2time(id){
        let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
        return time.toISOString().substr(0,10)
        
    }
    function  toBlogType(e){
        e.stopPropagation()//阻止事件冒泡
    }
    //onClick={()=>history.push('/blogdetails/'+blog.blog._id)}
// replace(/![]\(http:\/\/localhost:3001\/\w*\.(jpg|JPG|png|PNG|GIF|gif)\)/g,'')
    return(
        
        
        <div onClick={()=>props.history.push('/blogdetails/'+blog.blog._id)} style={{fontWeight:'bolder'}}>
            <div style={{display: 'flex',justifyContent:'flex-start'}}>
                <img src={'http://localhost:3001/'+blog.userAvatar.replace(/server\/public\/img\/usersAvatar\//,'')} 
                    alt='' id='blog-item-user-avatar'>
                </img>
                <div className='home-username'>{blog.username}</div>
                <div className="blog-types">
                {
                    Array.from(blog.blog.type).map(type=><Link to={{pathname:'/atypeblogs/'+type}}  
                                                               key={type} 
                                                               onClick={e=>toBlogType(e)}>
                    <span className='blog-type' >{type}</span>
                </Link>)
                }
                </div>
            </div>
            <div>{blog.blog.blogTitle}</div>
            <div className='blog-content'>
              <div id='blog-fonts'>
               {blog.blog.blogContent.length>80 ? 
                blog.blog.blogContent.replace(/\!\[\]\(http:\/\/localhost:3001\/\w*\.(jpg|JPG|png|PNG|GIF|gif)\)/g,'').substr(0,80)+'...' 
                : 
                blog.blog.blogContent.match(/\w*/)[0]}
              </div>
              <div id='blog-pitcure'>
               <img src={ String(blog.blog.blogContent.match(/http:\/\/localhost:3001\/\w*\.(jpg|JPG|png|PNG|GIF|gif)/g)).split(',')[0]} alt=''></img>
              </div>
            </div>
            <div id='blog-more-info'>
                 
                    <div style={{color:'#444',fontSize:'70%'}}>
                    {blog.blog.blogPublisherName}
                    发布于{id2time(blog.blog._id)}</div>
                    <div className='praise'>
                        <img src={blog.blog.starsNum>1?'../img/zan-active.svg':'../img/zan.svg'} alt='' width='20px'></img>
                        <span>{blog.blog.starsNum||0}</span>
                    </div>
                    <div className='share'  >
                        <img src={blog.blog.shareNum>1?'../img/share-active.svg':'../img/share.svg'} alt='' width='20px'></img>
                        <span>{blog.blog.shareNum||0}</span>
                    </div>
              
            </div>
        </div>
        
    )

}
export default BlogItem