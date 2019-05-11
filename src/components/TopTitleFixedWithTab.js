import React from 'react';
import { createBrowserHistory } from 'history';
import '../Css/TopTitleFixedWithTab.css'
const history = createBrowserHistory();

//<TopTitleFixedWithTab title='' tabs={['关注的用户','关注的专栏']}
export const TopTitleFixedWithTab = ({title='标题',tabs=[],changeShow,selected}) =>{
    return(
        <div id='TopTitleFixedWithTab'>
         <div onClick={()=>history.goBack()} id='TopTitleFixedWithTab-back'>
            <span>
             <img src='../img/back.svg' width='20px' alt=''></img>
            </span>
            <span>
             返回
            </span>
         </div>
         <div id='TopTitleFixedWithTab-title' >{  title.length>7 ? title.substr(0,7)+'...': title}</div>
         <div id='TopTitleFixedWithTab-tabs'>
         {
             tabs.map(tab=><div key={tab} onClick={()=>changeShow(tab)} className={selected===tab?'TopTitleFixedWithTab-tab-selected':'TopTitleFixedWithTab-tab'}>{tab}</div>)
         }
         </div>
        <hr/>
        </div>
    )
}