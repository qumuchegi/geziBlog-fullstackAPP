export const cache_article = (article,id) => ({// id为文章在本地缓存的 ID，用于后面退出是在本地删除文章缓存，id 可以为文章在mongoDB的 id
    type:'CACHE',
    article,
    id
})

export const delete_article = (id) => ({
    type:'DELETE',
    id
})