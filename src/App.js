import React, { Component } from 'react';
import Active from './Pages/dashbord/Active';
import Home from './Pages/dashbord/Home';
import My from './Pages/dashbord/My'
import { If, Then, Else, When } from 'react-if'
import './Css/App.css'
import TabItem from './components/TabItem';
import {connect} from 'react-redux';
import {TabTypes,showTabType} from './Redux/Actions/showTab';
import {fetch_all_Blogs,fetch_a_Blog } from './Redux/Actions/fetchBlogs';
import {add_history,delete_history} from './Redux/Actions/historyPath'
import {store} from './Redux/Reducers/index'
import UseHistoryPath from './components/UseHistoryPath';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state={
      ReduxHistory:[]
    };
  }
  componentWillMount() {
    console.log('浏览器历史',this.props.history)
     
 
    //store.dispatch(add_history('/','首页'))
    //this.props.fetchAllBlogs()
    //console.log(this.props.fetchBlogsRes)
  }
  render() {
    return (
      <div>
        <div id = 'content' >
         <If condition = { this.props.TabTypeShowing === 'DONGTAI' }>
             <Then> <Active history = { this.props.history }/> </Then>
             <Else>
               <When condition = { this.props.TabTypeShowing === 'SHOUYE' }>
                <Home changeTab = { this.props.changeTab } 
                      fetchAllBlogs = { this.props.fetchAllBlogs } 
                      fetchBlogsRes = { this.props.fetchBlogsRes } 
                      fetchABlog = { this.props.fetchABlog }
                      history = { this.props.history }
                      />
               </When>
               <When condition = { this.props.TabTypeShowing === 'WODE' }><My history = { this.props.history }/></When>
             </Else>
         </If>
        </div>
        <div id = 'tab'>
           
           <TabItem 
                 changeTab = { this.props.changeTab } 
                 type = { 'shouye' } 
                 tabType = 'SHOUYE'  
                 tabshowing = { this.props.TabTypeShowing }
                 >首页</TabItem>
           <TabItem 
                 changeTab = { this.props.changeTab } 
                 type = { 'dongtai' } 
                 tabType = 'DONGTAI'  
                 tabshowing = { this.props.TabTypeShowing }
                 >动态</TabItem>
           <TabItem 
                 changeTab = { this.props.changeTab } 
                 type = { 'wode' } 
                 tabType = 'WODE'  
                 tabshowing = { this.props.TabTypeShowing }
                 >我的</TabItem>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ( state ) => { 
  return{
    TabTypeShowing: state.TabTypeShowing,
    fetchBlogsRes: state.fetchBlogsRes,
  }
}
const mapDispatchToProps = ( dispatch ) => {
  return{
    changeTab: (type) => {
      dispatch( showTabType( TabTypes[ "show_"+type ] ) )//[]计算属性,还有dispatch在props获得
    },
    fetchABlog: (blogID) => {
      dispatch( fetch_a_Blog( blogID ) )
    }
  }
}
let APP = connect( mapStateToProps, mapDispatchToProps )( App )
export default APP;
