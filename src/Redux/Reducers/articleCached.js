const articleCached = (state = {},action) => {
    switch(action.type){
        case 'CACHE':{
            console.log('正在缓存文章',action.article)
            return action.article;
        }
        case 'DELETE':{
            console.log('正在删除文章',action.id);
            return {};
        }
        default:return state
    }
}
export default articleCached