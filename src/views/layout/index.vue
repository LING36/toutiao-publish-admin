<template>
  <div>
      <!--
        用到element组件库中的
        Container 布局容器 组件
        Dropdown 下拉菜单 组件
        -->
    <el-container class="layout-container">
      <el-aside
      class="aside"
      width="200px"
      >
      <!-- 引用侧边栏组件 -->
        <app-aside/>
      </el-aside>
      <el-container>
        <el-header class="header">
            <i class="el-icon-s-fold"></i>
            <div class="txt">后台管理系统</div>
            <el-dropdown class="dropdown-right">
                <div class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                    <span>用户名称</span>
                    <el-avatar :size="30" :src="circleUrl"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-setting">个人设置</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-unlock">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
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
export default {
  name: 'LayoutIndex',
  props: {},
  components: {
    AppAside // 注册组件（侧边栏组件）
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created () {},
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
