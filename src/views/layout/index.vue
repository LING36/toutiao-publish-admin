<template>
  <div>
      <!--
        用到element组件库中的
        Container 布局容器 组件
        Dropdown 下拉菜单 组件
        -->
    <el-container class="layout-container">

      <!-- 左边侧边栏 -->
      <el-aside
      class="aside"
      width="auto"
      >
        <!-- 引用侧边栏组件 传数据给子组件-->
        <app-aside
          :is-collapse="isCollapse"
        />
      </el-aside>

      <!-- 右边部分 -->
      <el-container>

        <!-- 头部 -->
        <el-header class="header">
          <!-- css样式处理 -->
            <i
              :class="{
                'el-icon-s-fold': isCollapse,
                'el-icon-s-unfold': !isCollapse,
              }"
              @click="isCollapse = !isCollapse"
            ></i>
            <div class="txt">黑马头条-后台管理系统</div>
            <el-dropdown class="dropdown-right">
                <div class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                    <span>{{user.name}}</span>
                    <el-avatar :size="30" :src="user.photo"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-setting">个人设置</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-unlock">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>

        <!-- 内容 -->
        <el-main class="main">
          <!-- 子路由出口 -->
          <router-view />
        </el-main>

      </el-container>

    </el-container>

  </div>
</template>

<script>
// 引入侧边栏组件
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'

export default {
  name: 'LayoutIndex',
  props: {},
  components: {
    AppAside // 注册组件（侧边栏组件）
  },
  data () {
    return {
      user: {}, //  用户信息
      isCollapse: false // 侧边菜单栏的展示状态
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 除了登录接口，其他所有接口都需要授权才能请求使用
    // 或者说，除了登录接口，其他接口都需要提供你的身份令牌才能获取数据
    loadUserProfild () {
      getUserProfile().then(res => {
        console.log(res)
        // 用户信息
        this.user = res.data.data
      }).catch(err => {
        // 请求失败
        console.log('请求失败', err)
      })
    }
  },
  created () {
    // 组件初始化好请求获取用户资料
    this.loadUserProfild()
  },
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.layout-container{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.aside{
    background-color: #002033;
}
.header{
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    align-items: center;
    // 左右撑开
    // justify-content: space-between;
    .txt{
        margin-left: 10px;
    }
    .dropdown-right{
        flex: 1;
        text-align: right;
        .el-dropdown-link{
            height: 30px;
            position: relative;
        }
        span , i{
            display: inline-block;
            height: 30px;
            line-height: 30px;
            float: right;
            margin: 5px;
        }
    }
}
.main{
    background-color: #e9eef3;
}
</style>
