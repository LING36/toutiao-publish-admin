<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-head"></div>
      <!--
        el-form 表单组件
        每个表单项都必须使用 el-form-item 组件包裹
      -->
      <!--
        配置 form表单验证：
        1、必须给 el-from 组件绑定 model 为表单数据对象
        2、给需要验证的表单项 el-form-item 绑定prop属性
          注意：prop 属性需要指定表单对象中的数据名称
        3、通过 el-form 组件的 rules 属性配置验证规则
          具体的验证规则可以参考：https://github.com/yiminghe/async-validator
          如果内置的验证规则不满足，也可以自定义验证规则

        点击登录的时候手动触发表单验证
        1、给 el-form 设置 ref 起个名（随便起名，不要重复即可）
        2、通过 ref 获取 el-form 组件，调用组件的 validate 方法进行验证
      -->
      <el-form
        ref="loginForm"
        :model="user"
        :rules="formRules"
      >
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="onLogin('loginForm')" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '', //  验证码
        agree: false // 是否同意协议
      },
      loginLoading: false, // 登录的loading状态
      formRules: { // 表单验证规则配置
        // 要验证的数据名称：规则列表[]
        // required：表示是必填项
        // message：提示文字
        // trigger：触发提示的机制（blur：失去焦点）（change：值改变）
        // pattern：正则表达式配置
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin (formName) {
      this.$refs[formName].validate((valid, err) => { // 表单验证
        // err 验证失败的字段
        if (!valid) {
          return false
        }

        // 通过验证，请求登录
        this.login()
      })
    },
    login () {
      // 获取表单数据（根据接口要求绑定数据）
      // 表单验证
      // 验证通过，提交登录（发起接口请求）
      // 处理后端响应结果
      //   成功：xxx
      //   失败：xxx
      const user = this.user
      this.loginLoading = true // 开启登录中loading。。。
      // 对于代码中的请求操作
      // 1、接口请求可能需要重用
      // 2、实际工作中，接口非常容易变动，改起来麻烦
      // 建议的做法是把所有的请求都封装成函数然后统一组织到模块中进行管理
      // 这样做的好处就是：管理维护更方便，也好重用

      // 调用api user.js 文件里封装的 login 函数（传入请求参数）
      login(user).then(res => {
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
