import React,{useState}  from 'react';
import '../Css/MyColumnItem.css';
import {Link} from 'react-router-dom';

function id2time(id) {
   

    let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    return time.toISOString().substr(0,10)
}

function MyColumnItem( { column } ) {
    const [hover,useHover] = useState(false)
     return(
       <div className='my-column-item' onMouseOver={()=>useHover(true)} onMouseLeave={()=>useHover(false)}>
            <div>{
                column.picture ?
                <div id = 'img'>
                  <img src={'http://localhost:3001/'+ column.picture.replace(/server\/asset\/columnTopImg/,'')}
                       alt=''/>
                </div>
            :  null
            }
               
            </div>
            <div className={hover?'hover-my-column-item-info' : 'my-column-item-info' }>
                <h5>{column.name}</h5>
                <p>{column.description.length>10?column.description.slice(0,10)+'...':column.description}</p>
                <span>{column.creator}创建于</span><span>{id2time(column._id)}</span>
                <hr/>
                <div>
                    <span className = 'other-info'>文章数{column.article.length}</span>
                    <span className = 'other-info'>参与者{column.participator.length}</span>
                    <span className = 'other-info'>关注量{column.watcher.length}</span>
                </div>
            </div>
            {
                hover ?
                <div className='edit-buttons'>
                    <div>
                        <Link to={{pathname:'/articleeditor/'+column._id}} className='Link'>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        编辑文章
                        </Link>
                    </div>
                </div>
            :  null
            }
            
       </div>
    )
}

export default MyColumnItem
 