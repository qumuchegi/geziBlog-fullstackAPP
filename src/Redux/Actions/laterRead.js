//使用Redux在APP全局缓存添加的待阅读文章
export const addLaterReadBlog = ( blog , hadRead )=> ({
    type:'ADD_BLOG',
    blog,
    hadRead:false
})

export const deleteLaterReadBlog = blogID => ({
    type:'DELETE_BLOG',
    deleteBlogID:blogID
})

export const read = (blogID) => ({
    type:'READ',
    blogID
})

 