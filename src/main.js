/*
*项目的启动入口
*/
// 加载了vue
import Vue from 'vue'
// 加载了根组件
import App from './App.vue'
// 加载了路由
import router from './router'
// 加载全局样式文件
import './styles/index.less'

// 关闭生产环境提示
Vue.config.productionTip = false

// 创建vue根实例
// 把router 配置到根实例中
// 通过render方法把app根组件渲染到#app入口节点
new Vue({
  router,
  render: h => h(App)
  // el: '#app'//等价于$mount('#app')
}).$mount('#app')
