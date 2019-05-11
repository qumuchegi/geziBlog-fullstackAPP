import React from 'react';
import "../Css/ArticleItem.css";

const ArticleItem = ({article}) => {

    return(
        <div id = 'article-item-body'>
            <div className = 'title'>{article.title}</div>
            <div className = 'content-picture'>
              <div className = 'content'>{article.content.length > 20 ? article.content.slice(0,20) + '......' : article.content}</div>
              <div className = 'picture'>
                <img src = { String(article.content.match(/http:\/\/localhost:3001\/\w*\.(jpg|JPG|png|PNG|GIF|gif)/g)).split(',')[0] } alt = ''></img>
              </div>
            </div>
            <div className = 'author-time'>
                <span> { article.author } * </span>
                <span> { article.time.replace(/(\d*)-(\d*)-(\d*)-(\d*)-(\d)/,'$1/$2/$3  $4:$5') } </span>
                <span className = 'praise'>
                 <i className = "fa fa-thumbs-o-up" aria-hidden="true"></i>
                 {article.praise.length}
                </span>
            </div>
        </div>
    )
}
export default ArticleItem