export const add_history = (route,name) => ({ // 每次点击一个子页面添加 页面的标题和 索引，索引用来 history.go(index)
    type:'ADD_HISTORY',
    route,
    name
})
export const delete_history = (index) => ({
    type:'DELETE_HISTORY',
    index
})