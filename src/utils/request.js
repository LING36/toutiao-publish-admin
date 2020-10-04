/**
 * 基于axios封装的请求模块
 * 安装：npm i axios
 */
// 引入
import axios from 'axios'

// 创建一个axios实例，说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
})

// 请求拦截器 start--------------------------------------------------
// 我们通过request发起请求，所以设置request拦截
request.interceptors.request.use(
  // 所有接口请求都经过这里
  // config 是当前请求相关的配置信息对象
  // config是可以修改的
  function (config) {
    // 然后我们就可以在允许请求发出去之前定制统一业务功能处理
    // 例如：统一设置 token
    const token = localStorage.getItem('token')

    // 如果本地存储有token，则统一设置token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 当return config 之后请求才会真正发出去
    return config
  },
  // 请求失败，会经过这里
  function (error) {
    return Promise.reject(error)
  }
)
// 请求拦截器 end------------------------------------------------------

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
