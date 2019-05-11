import {combineReducers} from 'redux';
import TabTypeShowing from './TabTypeShowing'
import fetchBlogsRes from './fetchBlogsRes'
import laterReadBlogs from './laterReadBlogs'
import HomeNavShowing from './HomeNavShowing'
import articleCached from './articleCached'
import history from './history'
import {createStore,applyMiddleware} from 'redux';
 
import thunk from 'redux-thunk';


export  const geziBlog = combineReducers( {
    TabTypeShowing,
    fetchBlogsRes,
    laterReadBlogs,
    HomeNavShowing,
    articleCached,
    history,
})
export const store = createStore( geziBlog,applyMiddleware( thunk ) )