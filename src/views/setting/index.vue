<template>
    <div class="setting-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
               <!-- 面包屑 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>个人设置</el-breadcrumb-item>
                </el-breadcrumb>
                <!-- /面包屑 -->
            </div>
            <el-row>
                <el-col :span="12">
                    <!-- 表单 -->
                    <el-form
                        ref="ruleForm"
                        :model="user"
                        :rules="rules"
                        label-width="100px">
                        <el-form-item label="编号:">{{user.id}}</el-form-item>
                        <el-form-item label="手机:">{{user.mobile}}</el-form-item>
                        <el-form-item label="媒体名称:" prop="name">
                            <el-input v-model="user.name"></el-input>
                        </el-form-item>
                        <el-form-item label="媒体介绍:" prop="intro">
                            <el-input type="textarea" v-model="user.intro"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱:" prop="email">
                            <el-input v-model="user.email"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                            type="primary"
                            @click="onUpdateUser('ruleForm')"
                            :loading="updateProfileLoading"
                            >保存设置</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- /表单 -->
                </el-col>
                <el-col :span="12" class="avatar-box" >
                    <label for="file">
                        <el-avatar
                            shape="square"
                            :size="150" fit="cover"
                            :src="user.photo"
                        ></el-avatar>
                        <p>点击修改头像</p>
                    </label>
                    <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
                    <input
                      id="file"
                      type="file"
                      ref="file"
                      hidden
                      @change="onFileChange"
                    />
                </el-col>
            </el-row>
        </el-card>

        <el-dialog
            title="修改头像"
            :visible.sync="dialogVisible"
            append-to-body
            @opened="onDialogOpen"
            @closed="onDialogClosed"
            width="30%"
        >
            <div>
                <img
                  :src="previewImage"
                  class="tailor-photo"
                  ref="preview-image"
                />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button
                type="primary"
                @click="onUpdatePhoto"
                :loading="loading"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserInfn } from '@/api/user'
import globalBus from '@/utils/global-bus'
// 图片裁剪
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'SettingIndex',
  props: {},
  components: {},
  data () {
    return {
      user: {},
      dialogVisible: false, // 控制上传图片裁切预览的
      previewImage: '', // 预览图片
      cropper: null, // 裁切器实例
      loading: false,
      updateProfileLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'change' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱格式', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.loadUserProfild()
  },
  methods: {
    // 修改用户信息
    onUpdateUser (ruleForm) {
      this.updateProfileLoading = true
      this.$refs[ruleForm].validate((valid, err) => { // 表单验证
        // err 验证失败的字段
        if (!valid) {
          this.updateProfileLoading = false
          return false
        }
        // 通过验证
        updateUserInfn(this.user).then(res => {
          this.updateProfileLoading = false
          //   this.user = res.data.data
          //   localStorage.setItem('user', JSON.stringify(res.data.data))
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          //   发布通信
          globalBus.$emit('update-user', this.user)
        })
      })
    },

    // 获取用户信息
    loadUserProfild () {
      getUserProfile().then(res => {
        // 用户信息
        this.user = res.data.data
      })
    },

    // 修改头像
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData

      // 展示弹出层,预览用户选择的图片
      this.dialogVisible = true

      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },

    // Dialog 打开动画结束时的回调
    onDialogOpen () {
      // 图片裁切器必须基于 img 进行初始化
      // 注意:img必须是可见状态才能正常完成初始化
      //   因为我们这里要在对话框里初始化裁切器
      //   所以务必要在对话框完全打开的状态下去进行初始化
      //  获取图片DOM节点(vue操作dom节点)
      const image = this.$refs['preview-image']
      // 第一次初始化好后,如果预览裁切的图片发生变化,裁切器默认不会更新
      //   如果需要预览图片发生变化更新裁切器:
      //   方法一:裁切器.replace 方法
      //   方法二:销毁裁切器,重新初始化

      //   方法一
      //   if (this.cropper) {
      //     this.cropper.replace(this.previewImage)
      //     return
      //   }
      // 初始化裁切器
      this.cropper = new Cropper(image, {
        aspectRatio: 1, //  裁切器的比例
        viewMode: 1, // 限制裁切框不要超过画布的大小。
        dragMode: 'none', // 不允许拖动鼠标创建裁剪框
        // cropBoxMovable: false, // 启用通过拖动来移动裁剪框的功能。
        cropBoxResizable: false, // 启用以通过拖动来调整裁剪框的大小。
        movable: true // 启用移动图像。
        // 移动裁切器触发 crop 方法
        // crop (event) {
        // }
      })
    },

    // Dialog 关闭动画结束时的回调
    onDialogClosed () {
      // 对话框关闭,销毁裁切器
      // 方法二
      this.cropper.destroy()
    },

    // 更新头像
    onUpdatePhoto () {
      this.loading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        // fd.append(参数名称, 参数值) body参数,根据接口需要参数配置
        fd.append('photo', file)

        // 请求接口更新用户头像
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示
          //   this.user.photo = res.data.data.photo
          // 直接把裁切结果的文件对象转为 blob 数据本地预览
          this.user.photo = window.URL.createObjectURL(file)
          this.loading = false
          this.$message({
            message: '头像更新成功',
            type: 'success'
          })
          //   发布通信
          globalBus.$emit('update-user', this.user)
        })
      })
    }

  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.avatar-box{
    text-align: center;
}
.tailor-photo{
    height: 200px;
    display: block;
    max-width: 100%;
}
</style>
