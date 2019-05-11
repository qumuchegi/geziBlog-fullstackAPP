import React  from 'react';
import {Link} from 'react-router-dom';

function ShareBlogItem(props){


    return(
        <Link to={{pathname:'/blogdetails/'+props.share.blogID}} className='Link'>
          <>
            <div className='share-blog-title'>{props.share.title}</div>
            <div className='share-time'>{props.share.username}分享于{props.share.time.match(/\d*-\d*-\d*/)}</div>
          </>
       </Link>
    )
}
export default ShareBlogItem