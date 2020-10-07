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

  </div>
</template>

<script>
import { getImage } from '@/api/images'
export default {
  name: 'ImageIndex',
  props: {},
  components: {},
  data () {
    return {
      images: [],
      loading: true,
      params: {
        collect: false,
        page: 1, // 页码
        per_page: 18 // 一页条数
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
