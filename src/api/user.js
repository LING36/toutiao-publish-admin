/**
 * 用户相关请求模块
 * */
import request from '@/utils/request'

// 用户登录
export const login = data => {
  return request({
    method: 'POST', // 请求方式
    url: '/mp/v1_0/authorizations', // 请求路径（接口路径）
    // data用来设置 POST 请求头
    data // 请求参数
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // // 后端要求把需要授权的用户身份放到请求头中
    // // axios 可通过 headers 选项设置请求头(在拦截器统一设置了)
    // headers: {
    //   // 属性名称和值都得看接口要求
    //   // 属性名：Authorization 接口要求的
    //   // 属性值：Bearer空格token数据
    //   // 从本地数据里拿token
    //   // Authorization: 'Bearer ' + localStorage.getItem('token')
    //   // es6字符串拼接（反引号拼接）
    //   Authorization: `Bearer ${localStorage.getItem('token')}`
    // }

  })
}

// 修改用户信息
export const updateUserInfn = data => {
  return request({
    method: 'PATCH', // 请求方式
    url: '/mp/v1_0/user/profile',
    data // 请求参数
  })
}

// 修改用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH', // 请求方式
    url: '/mp/v1_0/user/photo',
    data // 请求参数
  })
}

// 获取粉丝列表
export const fansList = params => {
  return request({
    method: 'GET', // 请求方式
    url: '/mp/v1_0/followers',
    params
  })
}
