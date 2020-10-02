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

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
