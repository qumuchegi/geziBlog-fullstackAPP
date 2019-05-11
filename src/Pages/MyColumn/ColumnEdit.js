import {useState,useEffect} from 'react';
import {TopTitleFixedWithTab} from '../../components/TopTitleFixedWithTab';
import api from '../../api'
import React from 'react'
import { If, Then, Else } from 'react-if';
import ColumnPublish from '../../components/ColumnPublish';
import ColumnEditor from '../../components/ColumnEditor';
import {Link} from 'react-router-dom'
import UseHistoryPath from '../../components/UseHistoryPath';

import '../../Css/ColumnEdit.css'
function ColumnEdit(props) {
    let [columnInfo,setColumnInfo] = useState()

    let [tab,setTab] = useState('创建专栏')
    const changeShow=(tab)=>{
        setTab(tab)
    }
    
    return(
        <div id = 'column-edit-big-body'>
             <div id='home-top' >
                    <div id='gezi-title'>
                    <img src = '../img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                    <UseHistoryPath history = {props.history} name = '编辑专栏'/>
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
            <TopTitleFixedWithTab title='专栏' tabs={['创建专栏','编辑专栏文章']} changeShow={changeShow} selected={tab}></TopTitleFixedWithTab>
            <div id='column-edit-body'>
             <If condition={tab==='创建专栏'}>
              <Then>
                <ColumnPublish></ColumnPublish>
              </Then>
              <Else>
                  <ColumnEditor/>
              </Else>
             </If>
            </div>
        </div>
    )
}
export default ColumnEdit