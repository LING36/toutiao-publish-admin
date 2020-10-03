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
export const getUserInfo = () => {

}

// 修改用户信息
export const updateUserInfn = () => {

}
