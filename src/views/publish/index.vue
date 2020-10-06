<template>
  <div class="publish-container">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{crumb}}</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- /面包屑 -->
        </div>
        <!-- 表单 -->
        <el-form ref="form" :model="article" label-width="60px">
            <el-form-item label="标题：" class="form-title">
                <el-input v-model="article.title"></el-input>
            </el-form-item>
             <el-form-item label="内容：">
                <el-input type="textarea" v-model="article.content"></el-input>
            </el-form-item>
            <el-form-item label="封面：">
                <el-radio-group v-model="article.cover.type">
                    <el-radio :label="1">单图</el-radio>
                    <el-radio :label="3">三图</el-radio>
                    <el-radio :label="0">无图</el-radio>
                    <el-radio :label="-1">自动</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道：">
                <el-select v-model="article.channel_id" placeholder="请选择频道">
                    <el-option
                        v-for="(item, index) in channels"
                        :label="item.name"
                        :value="item.id"
                        :key="index"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onPublish(false)">发表</el-button>
                <el-button @click="onPublish(true)">存入草稿</el-button>
            </el-form-item>
        </el-form>
        <!-- /表单 -->
    </el-card>
  </div>
</template>

<script>
import { getArticlesChannels, addArticle, getArticle, updateArticle } from '@/api/article'
export default {
  name: 'PublishIndex',
  props: {},
  components: {},
  data () {
    return {
      // 文章频道
      channels: [],
      crumb: '发布文章', // 面包屑文字
      article: {
        title: '', // 标题
        content: '', // 内容
        cover: { // 文章封面
          type: 0, // 封面类型 -1:自动 0：无图 1：1张 3：3张
          images: [] // 封面图片地址
        },
        channel_id: null // 频道id
      }
    }
  },
  computed: {},
  watch: {},
  methods: {

    onPublish (draft) {
      // 判断是发布文章还是修改文章
      const articleId = this.$route.query.id
      if (articleId) { // 修改
        updateArticle(articleId, this.article, draft).then(res => {
          console.log(res)
          this.$message({
            message: draft ? '修改存入草稿成功' : '修改成功',
            type: 'success'
          })
          this.$router.push('/article')
        }).catch(err => {
          console.log(err)
        })
      } else { // 发表
        addArticle(this.article, draft).then(res => {
          this.$message({
            message: draft ? '存入草稿成功' : '发表成功',
            type: 'success'
          })
          this.$router.push('/article')
        }).catch(err => {
          console.log(err)
        })
      }
    },

    // 获取文章频道
    loadArticlesChannels () {
      getArticlesChannels().then(res => {
        this.channels = res.data.data.channels
        console.log(res)
      }).catch(err => {
        // 请求失败
        console.log('请求失败', err)
      })
    },

    // 获取指定文章:加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.loadArticlesChannels()
    // 判断是否是编辑文章（页面路径带有id参数表示是编辑文章）
    if (this.$route.query.id) {
      this.crumb = '修改文章'
      this.loadArticle()
    }
  },
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.form-title{
    width: 30%;
}
</style>
