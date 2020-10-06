<template>
  <div class="publish-container">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>发布文章</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- /面包屑 -->
        </div>
        <!-- 表单 -->
        <el-form ref="form" :model="article">
            <el-form-item label="标题：">
                <el-input v-model="article.title"></el-input>
            </el-form-item>
             <el-form-item label="内容：">
                <el-input type="textarea" v-model="article.content"></el-input>
            </el-form-item>
            <el-form-item label="封面：">
                <el-radio-group v-model="article.resource">
                    <el-radio label="单图"></el-radio>
                    <el-radio label="三图"></el-radio>
                    <el-radio label="无图"></el-radio>
                    <el-radio label="自动"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道：">
                <el-select v-model="article.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">发表</el-button>
                <el-button>存入草稿</el-button>
            </el-form-item>
        </el-form>
        <!-- /表单 -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PublishIndex',
  props: {},
  components: {},
  data () {
    return {
      article: {
        title: '', // 标题
        content: '', // 内容
        cover: { // 文章封面
          type: 0, // 封面类型 -1:自动 0：无图 1：1张 3：3张
          images: [] // 封面图片地址
        }
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  },
  created () {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
</style>
