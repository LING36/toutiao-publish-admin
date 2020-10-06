/**
 * 文章相关请求模块
*/
import request from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body 参数使用 data 设置
    // Query 参数使用 params 设置
    // Headers 参数使用 Headers 设置
    // 在axios 中通过 headers 选项设置请求头参数
    // axios发送的请求默认会设置 'Content-Type'（不用自己添加）
    // headers: {
    //   'Content-Type':'application/json'
    // }
    params
  })
}

// 获取文章频道
export const getArticlesChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // ： 冒号后加 路径参数
    // es6 拼接方式
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 新建文章 draft设置默认值为false
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否存为草稿（true为草稿）
    },
    data
  })
}

// 修改文章
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    data,
    params: {
      draft // 是否存为草稿（true为草稿）
    }
  })
}

// 获取指定文章
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
