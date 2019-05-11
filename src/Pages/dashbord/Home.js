import React,{Component} from 'react';
import {connect} from 'react-redux';
import {store} from '../../Redux/Reducers/index';
import { Link } from 'react-router-dom' ;
import BlogItem from '../../components/BlogItem';
import {fetch_all_Blogs} from '../../Redux/Actions/fetchBlogs'
import { If, Then, Else, When } from 'react-if';
import api from '../../api';
import {ColumnItems} from '../../components/ColumnItems'
import { ToastContainer, toast } from 'react-toastify';
import {addLaterReadBlog,deleteLaterReadBlog,read } from '../../Redux/Actions/laterRead';

import showHomeNav,{Navs} from '../../Redux/Actions/showHomeNav';
import UseHistoryPath from '../../components/UseHistoryPath';

import '../../Css/Home.css';

class Home extends Component{
    constructor( props ){
        super( props );
        this.state = {
            homeContentType : 'BLOG',
            blogs : [],
            columns : [],
            fetch_status : '',
            page : 1,//前端获取博客列表一页的序号
            hasMoreBlogs : true,
            isPending : false,//正在请求
            laterRead : [],//稍后阅读文章列表
           // MouseOver:false,
            labels:[],//收集文章标签
        }
        this.isScrollListenerRunning = false
        this.loadmore = React.createRef()
    }
    async fetchBlogs( page ) {
        await this.props.dispatch( fetch_all_Blogs(page) )
        let res =  this.props.fetchBlogsRes;
        console.log(res)
        if(res.code===0) {
            let blogs = [ ...this.state.blogs, ...res.res ]
            console.log(blogs)
            let labels = []
            blogs.forEach(blog => labels = labels.concat(blog.blog.type)) 
            labels = [...labels = new Set(labels)]
            this.setState( { blogs:blogs, fetch_status:res.status, isPending:false, hasMoreBlogs:true ,labels} )
        }else if(res.code===1) {
           this.setState( (prevState,props) => ( { hasMoreBlogs:false, isPending:false, page:prevState.page-1} ) )
        }
     }
    async fetchColumns(){
        
        let res = await api.get('/column/allcolumns')
        if( res.code === 0 ){
            console.log(res)
            this.setState( {columns:res.data} )
        }
    }
     scrollHandler = () => {
         console.log('0000')
        if( this.isScrollListenerRunning ){
             return
         }
         
        console.log( document.body.offsetHeight,
                     window.pageYOffset,
                     document.body.clientHeight,
                     this.loadmore.current.offsetTop,
                     window.screen.availHeight
                    )

        if( window.pageYOffset+window.screen.availHeight  > 
            this.loadmore.current.offsetTop && 
            this.state.hasMoreBlogs ) {
                this.isScrollListenerRunning = true
                console.log('该刷新了')
                this.setState( {isPending:true} )
                this.setState((preState,props) =>( {page:++preState.page} ))
                this.timer = setTimeout( () => { this.fetchBlogs(this.state.page);
                                                 //this.setState({hasMoreBlogs:true});
                                                 this.isScrollListenerRunning = false 
                                                },1000)
            }
       }
    componentDidMount(){
        //console.log(this.props.dispatch(showHomeNav(Navs.blog)))
       this.fetchBlogs(1)
       this.fetchColumns()
       this.isScrollListenerRunning = false; //这个变量决定scroll事件处理函数中的网络请求是否响应
       this.scrollEventTimer = setTimeout(() => window.addEventListener('scroll', this.scrollHandler ),500)

       console.log(this.props.history)
       console.log( ' store.getState().laterReadBlogs ',store.getState().laterReadBlogs )
       this.setState( { laterRead: store.getState().laterReadBlogs } )
       this.setState( { homeContentType: store.getState().HomeNavShowing } )
    }
    toBlogType(e){
        e.stopPropagation()//阻止事件冒泡
    }
    changeHomeShow = (type) => {
        if ( type !== 'blog' ){
            window.removeEventListener( 'scroll', this.scrollHandler )
            //切换tab时这个组件未被销毁，所以不能只在componentWillUnmount()里销毁监听器，切换tab的时候也要销毁监听器
        } else {
            window.addEventListener( 'scroll', this.scrollHandler )
            //当回到博客tab是要重新绑定scroll监听
        }
        this.props.dispatch(showHomeNav(Navs[type]))
        console.log(store.getState().HomeNavShowing)
        this.setState( { homeContentType: store.getState().HomeNavShowing } )
    }
    addlaterRead( blogID, title, authorAvatar ) {//存入Redux
        if( store.getState().laterReadBlogs.some( e => e.blogID === blogID )  || 
            this.state.laterRead.some( e => e.blogID === blogID )  ) {
                return toast.warn('已经添加！',{ autoClose: 1000 })
            }
        this.props.dispatch( addLaterReadBlog( { blogID,title,authorAvatar } ) )
        console.log(store.getState())
        let newlaterRead = [ ...store.getState().laterReadBlogs ]
        console.log( newlaterRead )
        this.setState( {laterRead: newlaterRead} )
    }
    deleteLaterread( blogID ) { //从Redux删除
        this.props.dispatch( deleteLaterReadBlog( blogID ))
        console.log( store.getState() )
        this.setState( { laterRead:store.getState().laterReadBlogs } )
    }
    addHadRead( blogID ) {
        this.props.dispatch( read(blogID) )
        this.setState({laterRead : [ ...store.getState().laterReadBlogs]})
    }
    componentWillUnmount() {
        window.removeEventListener( 'scroll', this.scrollHandler )
        clearTimeout( this.timer )
        clearTimeout( this.scrollEventTimer)
    }
    render(){
        return(
            <div id='home-body'>
            <ToastContainer/>
                 <div id='home-top'>
                    <div id='gezi-title'>
                    <img src = './img/blog.svg' alt = ''  id = 'app-icon'></img>
                    格子博客
                     <UseHistoryPath history = {this.props.history}/>
                    </div>
                    <div id='home-nav'>
                        <div onClick={()=>this.changeHomeShow('blog')} 
                            className={this.state.homeContentType==='BLOG'?'home-selected':'home-not-selected'}>博客</div>
                        <div onClick={()=>this.changeHomeShow('column')}
                            className={this.state.homeContentType==='COLUMN'?'home-selected':'home-not-selected'}>专栏</div>
                         
                    </div>
                 
                    {
                        localStorage[ 'imgAvatar_url' ] ? 
                        <div id = 'home-avatar'>
                         <img src = {'http://localhost:3001/'+
                          localStorage['imgAvatar_url'].replace(/server\/public\/img\/usersAvatar\//,'')} alt='' ></img>
                            <div    id = 'more-container-fixed' 
                                onMouseOver={()=>this.setState({MouseOver:true})} 
                                onMouseLeave={()=>this.setState({MouseOver:false})}
                              >
                            <div id = 'point'></div>
                            <div id = 'more-items'>
                                <div className = 'more-item'>
                                    <Link  to = { {pathname: '/editblog'} } 
                                        style = { {textDecoration:'none'} } 
                                        className = 'Link'>
                                    写博客
                                    </Link>
                                </div>
                                <div className = 'more-item'>
                                    <Link to = { {pathname: '/editcolumn'} } 
                                    style = { {textDecoration:'none' } } 
                                    className = 'Link'>
                                    创建专栏
                                    </Link>
                            </div>
                                <div className = 'more-item'>
                                <Link to = { {pathname: '/publishmyactive'} } 
                                    style = { {textDecoration:'none' } } 
                                    className = 'Link'>
                                    发布动态
                                    </Link>
                               </div>
                            </div>
                        </div>


                        </div>
                        :
                        <div id = 'home-not-login'>
                         <Link to = {{pathname:'/login'}} style = {{textDecoration:'none'}}><span>登录/注册</span></Link>
                        </div>
                    }
                   
                 </div>
                <If condition = { this.state.homeContentType === 'BLOG' } >
                 <Then>
                 <div id='blogs'>
                    { 
                    this.state.fetch_status === 'loading' ? 
                    <div>loding</div> :
                    this.state.blogs ?
                    Array.from( this.state.blogs ).map( blog =>
                        <div className = 'blog-item' key = {blog.blog._id} >
                            <i className = "fa fa-plus-circle" 
                               aria-hidden = "true" 
                               onClick = { () => this.addlaterRead( blog.blog._id, blog.blog.blogTitle, blog.userAvatar ) }></i>
                            <BlogItem blog = { blog } history = { this.props.history } >
                            </BlogItem>
                        </div>
                        
                    ) : null
                    }
                     <div ref = { this.loadmore }  
                          //onClick={()=>this.scrollHandler()}
                          id = 'load-more'> 
                          {
                            this.state.isPending ? 
                            <div>
                            <i className="fa fa-refresh fa-spin fa-1x fa-fw"></i>
                            <span>加载中……</span>
                            </div>
                            :
                            '没有更多了' 
                          }
                    </div>
                    </div>
                 </Then>
                 <Else>
                    <When condition = { this.state.homeContentType === 'COLUMN' } >
                     <div id = 'columns'>
                        {
                            this.state.columns ?
                            <ColumnItems columns = {this.state.columns} history = { this.props.history }/>
                            :
                            null
                        }
                     </div>
                    </When>
                     
                 </Else>
                </If>
                  <div id = 'home-right-fixed'>
                    
      
                    {
                        this.state.laterRead.length !== 0 ?
                        <div id = 'later-read-blogs'>
                        {
                            this.state.laterRead.map( (e,i) => <div key = {e.blogID}>
                                <Link to = { {pathname:'/blogdetails/'+e.blogID} } 
                                      onClick = { () => this.addHadRead( e.blogID )}    //{()=>this.setState((prevState)=>({hadReadIndex:prevState.hadReadIndex.push(i)}))}
                                      target = '_blank'
                                      style = { { textDecoration: 'none'} }>
                                    <img id = 'later-read-avatar'
                                    src = {'http://localhost:3001/' + String( e.authorAvatar ).replace( /server\/public\/img\/usersAvatar\//, '') } 
                                    alt='' ></img>
                                    <span style = { {marginLeft:'3%'}} 
                                          alt = { e.title }
                                         > 
                                        { e.title.length > 10 ? e.title.slice(0,10)+'...' : e.title }
                                    </span>
                                </Link>
                                <i className = "fa fa-trash-o" 
                                   aria-hidden = "true"
                                   onClick = { () => this.deleteLaterread( e.blogID )}
                                    ></i>
                                    { e.hadRead === true  ?
                                        <i className = "fa fa-eye-slash" 
                                           aria-hidden = "true"
                                           style = { {float:'right', marginTop:'5%', marginRight:'1%'} }></i>
                                        :  
                                        null
                                    }
                            </div>)
                        }
                        </div>
                         :
                         <div id = 'no-later-read-container'>
                             <div  id = 'no-later-read'>
                              <img src = './img/later-read.svg' alt = '' ></img>
                             </div>
                             <div>还没有稍后待看的博客</div>
                         </div>
                    }
                    <div id='labels-collection'>
                    <div>标签</div>
                      {
                          this.state.labels.map(label => <span key={label}>
                            <Link to={{pathname:'/atypeblogs/'+label}} style={{textDecoration:'none'}} className='Link'>{label}</Link></span>)

                      }

                    </div>
                     
                  </div>
            </div>
        )
    }
}
 
const HomeContainer = connect() (Home)
export default HomeContainer;
 