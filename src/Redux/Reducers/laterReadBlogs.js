const laterReadBlogs = (state=[], action) => {
    switch (action.type) {
        case 'ADD_BLOG':{
            console.log('reducer:')
            return [ ...state, action.blog ];
        }
        case 'DELETE_BLOG':{
            let newState = state.filter( blog => blog.blogID !== action.deleteBlogID )
            return newState
        }
        case 'READ':{
            state.forEach(e => e.blogID === action.blogID ? e.hadRead = true : null)
            return state
        }
        default:return state
    }
}
export default laterReadBlogs