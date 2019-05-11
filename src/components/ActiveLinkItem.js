import React from 'react'
import '../Css/ActiveLinkItem.css';

function id2time(id){
    let time = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    return time.toISOString().substr(0,10)
    
}
export function ActiveLinkItem({activeLink}) {
    return(
        <div className = 'active-link-item-body'>
            <div className = 'link-username-time'>
                
                <div>
                   <img src = {'http://localhost:3001/'+activeLink.avatar.replace(/server\/public\/img\/usersAvatar\//,'')} alt = ''/>
                   <div>{activeLink.publisherName}</div>
                </div>
                <div>
                    {
                        id2time(activeLink._id)
                    }
                </div>
            </div>
            <div className = 'link-title'>{activeLink.title}</div>
            <div className = 'link-link'>
            <a href = {activeLink.link} target = '_blank'>连接🔗</a>
            </div>
            <div className = 'link-feel'>{activeLink.feel}</div>
         
       </div>
    )
}