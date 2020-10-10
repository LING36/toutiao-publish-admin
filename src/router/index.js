import Vue from 'vue'
import VueRouter from 'vue-router'

// 在 vue cli 创建的项目中@表示src
// 它是src 目录的路径别名
// 好处：它不受当前文件路径影响
// 注意：@就是src路径，后面别忘了写斜杠
// 建议：如果加载的资源路径就在当前目录下，那就正常写，如果需要进行父级路径查找的都使用@
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Setting from '@/views/setting'
import Fans from '@/views/fans'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      // 页面标题title
      title: '黑马头条-登录'
    }
  },
  {
    path: '/',
    // 命名路由 layout 有一个默认子路由，这个名字没有意义，所以有代码警告
    // 正确的做法是如果有默认子路由就不要给父路由起名字了
    // name: 'layout',
    component: Layout,
    // 配置子路由
    children: [
      {
        path: '', // path为空，会作为默认子路由
        name: 'home',
        component: Home,
        meta: {
          title: '黑马头条-首页'
        }
      },
      {
        path: '/article',
        name: 'article',
        component: Article,
        meta: {
          title: '黑马头条-内容管理'
        }
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish,
        meta: {
          title: '黑马头条-发布文章'
        }
      },
      {
        path: '/image',
        name: 'image',
        component: Image,
        meta: {
          title: '黑马头条-素材管理'
        }
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment,
        meta: {
          title: '黑马头条-评论管理'
        }
      },
      {
        path: '/setting',
        name: 'setting',
        component: Setting,
        meta: {
          title: '黑马头条-个人设置'
        }
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans,
        meta: {
          title: '黑马头条-粉丝管理'
        }
      }
    ]
  }
]

// router实例
const router = new VueRouter({
  routes
})

// 路由导航守卫：说白了所有页面的导航都会经过这里  https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
// 守卫页面的导航的
// to：要去的路由路由信息
// from：来自哪的路由信息
// next：放行方法
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 如果要访问的页面不是登录页面，则校验登录状态
  // 如果没有登录，则跳转到登录页
  // 如果登录了，则允许通过
  const token = localStorage.getItem('token')
  if (to.path !== '/login') {
    if (token) {
      // 表示用户已登录，允许通过
      next()
    } else {
      // 表示用户没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    // 允许通过
    next()
  }
})

// 我们在组件中使用的 this.$router 其实就是这个模块中的 router
export default router
