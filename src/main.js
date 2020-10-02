/*
*项目的启动入口
*/
// 加载了vue
import Vue from 'vue'
// 加载了根组件
import App from './App.vue'
// 加载了路由
import router from './router'

// 引入 Element组件库（在安装好的前提下 npm i element-ui -S）
import ElementUI from 'element-ui'
// 引入 Element组件库样式
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'

// 关闭生产环境提示
Vue.config.productionTip = false
// 全局注册Element组件库
Vue.use(ElementUI)

// 创建vue根实例
// 把router 配置到根实例中
// 通过render方法把app根组件渲染到#app入口节点
new Vue({
  router,
  render: h => h(App)
  // el: '#app'//等价于$mount('#app')
}).$mount('#app')
