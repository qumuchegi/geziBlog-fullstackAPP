import APP from './App';
import {Router } from 'react-router-dom';
import { Route,Switch} from 'react-router'
import React,{Component} from 'react'
import Login from './Pages/Login'
import Register from './Pages/Register'
import {connect} from 'react-redux';
import Edit from  './Pages/MyBlog/Edit';
import BlogDetails from './Pages/BlogDetails';
import Manage from './Pages/MyBlog/Manage';
import Mycomment from './Pages/Mycomment';
import Message from './Pages/Massage';
import ShareHistary from './Pages/ShareHistary';
import UserPage from './Pages/UserPage';
import BlogsAType from './Pages/BlogsAType';
import MyWatch from './Pages/MyWatch';
import ColumnEdit from './Pages/MyColumn/ColumnEdit';
import ManageColumn from './Pages/MyColumn/Manage';
import ArticleEditor from './Pages/MyColumn/ArticleEditor'
import ColumnDetails from './Pages/ColumnDetails';
import ArticleDetails from './Pages/ArticleDetails';
import {ModifyBlog} from './Pages/ModifyBlog';
import PublishMyActive from './Pages/PublishMyActive';


import createBrowserHistory from 'history/createBrowserHistory'
export const history = createBrowserHistory()

 class AppRouter extends Component{
     componentDidMount(){
        
     }
     render(){
         return(
                <Router history={history}>
                 <Switch>
                    <Route exact path='/' component={APP}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/register' component={Register}></Route>
                    <Route path='/editblog' component={Edit}></Route>
                    <Route path='/blogdetails/:blogID' component={BlogDetails}></Route>
                    <Route path='/manage/:userID'  component={Manage}></Route>
                    <Route path='/mycomment' component={Mycomment}></Route>
                    <Route path='/message' component={Message}></Route>
                    <Route path='/myshare' component={ShareHistary}></Route>
                    <Route path='/userpage/:userID' component={UserPage}></Route>
                    <Route path='/atypeblogs/:type' component={BlogsAType}></Route>
                    <Route path='/mywatch/:userID' component={MyWatch}></Route>
                    <Route path='/editcolumn'  component={ColumnEdit}></Route>
                    <Route path='/mycolumnmanage' component={ManageColumn}></Route>
                    <Route path='/articleeditor/:columnID' component={ArticleEditor}></Route>
                    <Route path='/columndetails/:columnID' component={ColumnDetails}></Route>
                    <Route path='/articledetails' component={ArticleDetails}></Route>
                    <Route path='/modifyblog/:blogID' component={ModifyBlog}></Route>
                    <Route path='/publishmyactive' component={PublishMyActive}></Route>
                 </Switch>
                </Router>
         )
     }
 }

const APPRouter = connect()(AppRouter)
export default APPRouter;
    

