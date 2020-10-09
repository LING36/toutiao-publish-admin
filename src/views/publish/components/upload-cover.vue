<template>
  <div class="upload-cover">
      <div class="cover-wrap" @click="dialogVisible = true">
          <img v-if="coverImg || value" :src="coverImg?coverImg:value"/>
          <img v-else src="./pic_bg.png" />
          <!-- <img
           ref="cover-image"
          /> -->
      </div>
      <el-dialog
        title="选择封面"
        append-to-body
        :visible.sync="dialogVisible"
      >
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="素材库" name="image">
                <!--
                    ref 有两个作用
                    1、作用到普通 HTML 标签上可以获取 DOM
                    2、作用到组件上可以获取组件
                -->
                <image-list
                  :is-show-add="false"
                  :is-show-action="false"
                  :is-show-selected="true"
                  ref="image-list"
                />
            </el-tab-pane>
            <el-tab-pane label="上传图片" name="upload-image" class="upload-image">
                <div class="el-upload">
                    <!-- input设置 id 将id绑定到label的for上，这样点击label可触发上传弹窗 -->
                    <label for="file">
                        <!-- <img
                            class="avatar"
                            ref="preview-image"
                        /> -->
                        <img v-if="previewImage" :src="previewImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </label>
                     <input
                     type="file"
                     id="file"
                     ref="file"
                     @change="onFileChange"
                     />
                </div>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="onCoverConfirm"
              :loading="btnLoading"
            >确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/images'
import ImageList from '@/views/image/components/image-list'
export default {
  name: 'UploadCover',
  // 接收父组件传下来的数据
  //   props: ['cover-image'],
  props: ['value'],
  components: { ImageList },
  data () {
    return {
      dialogVisible: false,
      activeName: 'image',
      previewImage: '',
      coverImg: '',
      btnLoading: false
    }
  },
  created () {},
  methods: {

    // 上传图片
    onFileChange () {
      // 处理图片预览， input要设置ref，这样$refs才能访问input
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      //   this.$refs['preview-image'].src = blobData

      // 展示弹出层,预览用户选择的图片
      //   this.dialogVisible = true

      // 解决选择相同文件不触发 change 事件问题
      //   this.$refs.file.value = ''
    },

    // 点击确定
    onCoverConfirm () {
      this.btnLoading = true
      // 如果 tab 是上传图片，并且 input-file有选择的文件，才执行图片上传操作
      if (this.activeName === 'upload-image') { // 上传图片
        const file = this.$refs.file.files[0]
        if (!file) { // 没有选择的图片文件
          this.$message('请选择文件')
          this.btnLoading = false
          return
        }
        // 上传图片
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 上传成功
          this.dialogVisible = false
          this.coverImg = res.data.data.url
          //   this.$refs['cover-image'].src = res.data.data.url
          //   console.log(res.data.data.url)
          //   将图片地址发送给父组件(父子组件通信)
          //   this.$emit('update-cover', res.data.data.url)
          this.$emit('input', res.data.data.url)
          this.btnLoading = false
        })
      } else { // 从素材库里选择图片
      // 还有一种组件通信方式：父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected >= 0) {
          this.$emit('input', imageList.images.results[selected].url)
          this.btnLoading = false
          this.dialogVisible = false
          return
        }
        this.$message('请选择封面图片')
        this.btnLoading = false
      }
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.upload-cover{
    display: inline-block;
    margin-right: 20px;
    .cover-wrap{
        width: 150px;
        height: 150px;
        border: 1px dashed #e7e7e7;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}
.upload-image{
    text-align: center;
}
.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    position: relative;
    width: 178px;
    height: 178px;
    input{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
    }
  }
 .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

</style>
