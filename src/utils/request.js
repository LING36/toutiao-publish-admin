/**
 * 基于axios封装的请求模块
 * 安装：npm i axios
 */
// 引入
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
// 非组件模块可以这样加载使用 element 的Message
import { Message } from 'element-ui'

// 创建一个axios实例，说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径

  // 定义后端返回的原始数据处理
  // 参数data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [function (data) {
    // axios 默认在内部使用 JSON.parse 来转换处理原始数据

    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败
      return data
    }
  }]
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

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里
  // response 是响应数据
  // 注意：一定要把响应结果 return ，否则真正发请求的位置拿不到数据
  return response
}, function (error) {
  const status = error.response.status
  // 任何超出 2xx 的响码应都会进入这里
  if (error.response && status === 401) {
    // 跳转到登录页面（token失效或没有）
    localStorage.removeItem('token')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (error.response && status === 403) {
    // 没有操作权限
  } else if (error.response && status === 400) {
    // 客户端参数错误
  } else if (error.response && status >= 500) {
    // 服务端错误（后端错误）
  }
  return Promise.reject(error)
})

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
