// 全局通信总线
// 呼叫中心
// 作用:可以让任何组件之间通信

// 加载了vue
import Vue from 'vue'

export default new Vue()

// 用法
// 假设 a 组件要给 b 组件发送数据

// b 组件注册通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('自定义事件名称', () => {
//     // 处理函数
// })

// a 组件发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('自定义事件名称', 123455)

// 注意: 自定义事件名称一致(否则无效)
