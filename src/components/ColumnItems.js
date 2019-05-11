import React from 'react'
import '../Css/ColumnItems.css'


export const ColumnItems = ({columns,history}) => {
    return(
        columns.map(e=><div key={e._id} className='column-item'>
        <div>
            <img src={'http://localhost:3001/'+e.picture.replace(/server\/asset\/columnTopImg/,'')}
                 alt=''>
            </img>
        </div>
        <div className='column-item-info'  onClick={()=>history.push('/columndetails/'+e._id)} >
            <h5>{e.name}</h5>
            <p>{e.description.length>10?e.description.slice(0,10)+'...':e.description}</p>
            <span>{e.creator}创建于</span><span>{id2time(e._id)}</span>
            <div>
                <span>文章数：{e.article.length}</span>
                <span>参与者：{e.participator.length}</span>
                <span>关注量：{e.watcher.length}</span>
            </div>
        </div>
      </div>
    )
    )
}
function id2time(id) {
    let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    return time.toISOString().substr(0,10)
}