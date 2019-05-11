import React from 'react';
import { createBrowserHistory } from 'history';
import '../Css/TopTitleFixed.css'
const history = createBrowserHistory();


export const TopTitleFixed = ({title}) =>{
    return(
        <div id='TopTitleFixed'>
         <div onClick={()=>history.goBack()} id='back'>
            <span>
             <img src='../img/back.svg' width='20px' alt=''></img>
            </span>
            <span>
             返回
            </span>
         </div>
         <div id='h3' >{  title.length>15 ? title.substr(0,15)+'...': title}</div>
         <hr/>
        </div>
    )
}