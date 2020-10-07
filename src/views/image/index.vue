<template>
  <div class="image-container">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                 <!-- 面包屑 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>素材管理</el-breadcrumb-item>
                </el-breadcrumb>
                <!-- /面包屑 -->
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div>
                <el-radio-group
                    v-model="params.collect"
                    size='medium'
                    @change="typeChange"
                >
                    <el-radio-button :label="false">全部</el-radio-button>
                    <el-radio-button :label="true">收藏</el-radio-button>
                </el-radio-group>
                <el-button
                    class="upload-btn"
                    size='medium'
                    type="success"
                    @click="dialogTableVisible = true"
                >
                    上传素材
                </el-button>
            </div>
            <div class="images-box" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="item in images.results" :key="item.id">
                        <el-image
                            style="height: 150px"
                            :src="item.url"
                            fit="cover"
                        >
                        </el-image>
                    </el-col>
                </el-row>
            </div>
            <!-- 分页 -->
            <el-pagination
                class="pagination"
                background
                layout="prev, pager, next"
                :total="images.total_count"
                :page-size="params.per_page"
                @current-change="onCurrentChange"
                :disabled="loading"
                >
            </el-pagination>

        </el-card>

       <!-- 弹层 -->
        <el-dialog
            title="上传素材"
            :visible.sync="dialogTableVisible"
            :append-to-body="true"
            width="400px"
            >
            <!--
                upload 组件本身就支持请求提交上传操作，说白了你使用它不用自己去发请求，它会自己发
                请求方法：默认就是post
                请求路径：action 必须写完整路径
                请求头：headers
            -->
            <el-upload
                class="upload-demo"
                drag
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                :headers="uploadHeaders"
                name ="image"
                :on-success="onUploadSuccess"
                v-if="dialogTableVisible"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-dialog>

  </div>
</template>

<script>
import { getImage } from '@/api/images'
export default {
  name: 'ImageIndex',
  props: {},
  components: {},
  data () {
    const token = localStorage.getItem('token')
    return {
      images: [],
      loading: true,
      params: {
        collect: false,
        page: 1, // 页码
        per_page: 18 // 一页条数
      },
      dialogTableVisible: false, // 控制弹层显示
      uploadHeaders: {
        Authorization: `Bearer ${token}`
      }
    }
  },
  created () {
    this.loadImages()
  },
  methods: {

    // 获取素材列表
    loadImages () {
      this.loading = true
      getImage(this.params).then(res => {
        this.images = res.data.data
        console.log(res)
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },

    // 分页
    onCurrentChange (page) {
      this.params.page = page
      this.loadImages()
    },

    // 全部/收藏切换
    typeChange () {
      this.params.page = 1
      this.loadImages()
    },

    // 素材图片上传成功
    onUploadSuccess () {
      this.params.collect = false
      this.dialogTableVisible = false
      this.$message({
        message: '素材上传成功',
        type: 'success'
      })
      this.loadImages()
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.images-box{
    padding-top: 20px;
}
.el-col{
    margin-bottom: 20px;
}
.pagination{
  text-align: right;
}
.upload-btn{
    float: right;
}
</style>
