<template>
  <div class="image-list">
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
            v-if="isShowAdd"
        >
            上传素材
        </el-button>
    </div>
    <div class="images-box" v-loading="loading">
        <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item, index) in images.results" :key="item.id" class="col-box">
                <el-image
                    style="height: 150px"
                    :src="item.url"
                    fit="cover"
                    @click="selected=index"
                >
                </el-image>
                <div class="selected-img"
                v-if="isShowSelected && selected === index"
                ></div>
                <div class="mask" v-if="!params.collect && isShowAction">
                    <!-- <img v-if="item.is_collected" src="./collect_select.png" class="collect" @click="collect(index,false)" />
                    <img v-else src="./collect.png" class="collect" @click="collect(index,true)" />
                    <img src="./del.png" class="del" @click="deleteImage(item.id)"/> -->
                    <el-button
                        v-if="item.is_collected"
                        type="warning" size="mini"
                        icon="el-icon-star-off"
                        circle
                        :disabled="item.switchDisabled"
                        @click="collect(item,false)">
                    </el-button>
                        <el-button
                        v-else
                        type="info"
                        size="mini"
                        icon="el-icon-star-off"
                        circle
                        :disabled="item.switchDisabled"
                        @click="collect(item,true)">
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" circle :disabled="item.switchDisabled"  @click="deleteImage(item)"></el-button>
                </div>
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
        :current-page.sync="params.page"
        >
    </el-pagination>
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
import { getImage, collectImage, deleteImage } from '@/api/images'
export default {
  name: 'ImageList',
  // 使用对象的方式定义 prop，更严谨，功能更丰富，强烈建议在项目中使用
  // 参考文档：https://cn.vuejs.org/v2/guide/components-props.html#Prop-%E9%AA%8C%E8%AF%81
  props: {
    // 是否显示添加素材按钮
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    // 是否显示图片下方的操作（收藏和删除）
    isShowAction: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    isShowSelected: {
      type: Boolean, // 布尔值
      default: false // 默认值
    }
  },
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
      },
      selected: null // 选中的图标
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
        res.data.data.results.forEach(element => {
          element.switchDisabled = false // 按钮禁用状态控制
        })
        this.images = res.data.data
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
    },

    // 图片收藏
    collect (item, data) {
      item.switchDisabled = true
      collectImage(item.id, data).then(res => {
        if (data) {
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
          item.is_collected = true
        } else {
          this.$message({
            message: '取消收藏成功',
            type: 'success'
          })
          item.is_collected = false
        }
        item.switchDisabled = false
      }).catch(err => {
        console.log(err)
        item.switchDisabled = false
      })
    },

    // 删除图片素材
    deleteImage (item) {
      item.switchDisabled = true
      this.$confirm('确认删除图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteImage(item.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.loadImages()
          item.switchDisabled = false
        }).catch(err => {
          console.log(err)
          item.switchDisabled = false
        })
      }).catch(() => {
        item.switchDisabled = false
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
.images-box{
    padding-top: 20px;
    .col-box{
        position: relative;
        box-sizing: border-box;
    }
    .el-image{
        border: 1px dashed #e7e7e7;
        width: 100%;
        height: 100%;
    }
    .mask{
        height: 40px;
        width: calc(100% - 18px);
        position: absolute;
        left: 10px;
        bottom: 5px;
        // background: rgba(0,0,0,.3);
        display: flex;
        align-items: center;
        justify-content: center;
        img{
            width: 20px;
            height: auto;
            margin: 0 20px;
        }
    }
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
.selected-img{
    width: 50%;
    height: 50%;
    background: url('./selected.png') no-repeat center;
    background-size: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
</style>
