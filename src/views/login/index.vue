<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-head"></div>
      <!--
        el-form 表单组件
        每个表单项都必须使用 el-form-item 组件包裹
      -->
      <el-form ref="form" :model="user">
        <el-form-item>
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import request from '@/utils/request'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' //  验证码
      },
      checked: false, //  是否同意协议
      loginLoading: false // 登录的loading状态
    }
  },
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // 表单验证
      // 验证通过，提交登录（发起接口请求）
      // 处理后端响应结果
      //   成功：xxx
      //   失败：xxx
      const user = this.user
      this.loginLoading = true // 开启登录中loading。。。
      request({
        method: 'POST', // 请求方式
        url: '/mp/v1_0/authorizations', // 请求路径（接口路径）
        // data用来设置 POST 请求头
        data: user // 请求参数
      }).then(res => {
        // 成功请求
        if (res.status === 201) {
          console.log(res)
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 关闭loading
          this.loginLoading = false
        }
      }).catch(err => {
        // 请求失败
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误')
        // 关闭loading
        this.loginLoading = false
      })
    }
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-form{
    background: #fff;
    padding: 30px 50px;
    min-width: 300px;
    .login-head{
    width: 259px;
    height: 57px;
    background: url('./logo_index.png') no-repeat center center;
    margin: 0 auto;
    background-size:70%;
    margin-bottom: 10px;
  }
    .login-btn{
      width: 100%;
    }
  }
}
</style>
