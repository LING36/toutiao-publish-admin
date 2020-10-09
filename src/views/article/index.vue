<template>
  <div class="article-container">
    <!-- Card 卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <div class="text item">
        <!-- 数据筛选表单 Form 表单-->
        <el-form ref="form" :model="params" label-width="55px" size="small">
          <el-form-item label="状态：">
            <el-radio-group v-model="params.status">
              <!-- el-radio 默认把 label作为文本和选中之后的 value 值 -->
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道：">
            <el-select v-model="params.channel_id" placeholder="请选择">
              <el-option
                label="全部"
                :value="null"
              ></el-option>
              <el-option
                v-for="(item, index) in channels"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- DateTimePicker 日期时间选择器 -->
          <el-form-item label="日期：">
            <el-date-picker
              v-model="rangeDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="loading" @click="onSubmit">筛选</el-button>
          </el-form-item>
        </el-form>
        <!-- /数据筛选表单 -->
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{articles.total_count}} 条结果：
      </div>
      <div class="text item">
        <!-- 数据列表 Table 表格-->
        <!--
          1、把需要展示的数组列表数据绑定给 table 组件data属性
             注意：你不用去 v-for 遍历，它自己会遍历
          2、设计表格列表 el-table-column
             width 可以设定表格列的宽度
             label 可以设定列的标题
             prop  用来设定要渲染的列表项数据字段，只能展示文本
          3、表格列默认只能渲染普通文本，如果需要展示其他内容，
             例如放个按钮、放个图片，那就需要自定义表格模板了：https://element.eleme.cn/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban
        -->
        <el-table
          size="small"
          :data="articles.results"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column
            prop="date"
            label="封面"
          >
            <template slot-scope="scope">
              <!-- 这种情况是在运行期间动态改变处理的，而本地图片必须在打包的时候就存在，所以不能用三元运算 -->
              <!-- <img class="article-cover" :src="scope.row.cover.images.length ? scope.row.cover.images[0] : '../../assets/images/article_cover.gif'" alt=""/> -->

              <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0] " alt=""/>
              <img v-else class="article-cover" src="../../assets/images/article_cover.gif" alt=""/>
              <!-- <el-image
              style="width: 150px; height: 100px"
              :src="scope.row.cover.images[0]"
              :fit="cover" lazy>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
          >
          </el-table-column>
          <el-table-column
            label="状态">
            <!--
              如果需要在自定义列模板中获取当前遍历项的数据，那么就在template上声明
              slot-scope="scope"
            -->
            <template slot-scope="scope" >
              <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
              <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
              <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
              <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
              <!-- 优化 -->
              <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间">
          </el-table-column>
          <el-table-column
            label="操作">
            <!-- 如果需要自定义表格列表模板，则把需要自定义的内容放到 template 里面 -->
            <template slot-scope="scope">
              <el-button
                size="medium"
                circle
                type="primary"
                icon="el-icon-edit"
                plain
                @click="$router.push('/publish?id=' + scope.row.id)"
               >
              </el-button>
              <el-button
                size="medium"
                circle
                type="danger"
                icon="el-icon-delete"
                plain
                @click="onDeleteArticle(scope.row.id)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- /数据列表 -->

        <!-- 分页 Pagination 分页-->
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :total="articles.total_count"
          :page-size="params.per_page"
          :disabled="loading"
          @current-change="onCurrentChange"
          :current-page.sync="params.page"
        >
        </el-pagination>
        <!-- /分页 -->
      </div>
    </el-card>

  </div>
</template>

<script>
import { getArticles, getArticlesChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  props: {},
  components: {},
  data () {
    return {
      // 文章数据列表
      articles: [],
      articleStatus: [
        { text: '草稿', status: 0, type: 'warning' },
        { text: '待审核', status: 1, type: '' },
        { text: '审核通过', status: 2, type: 'success' },
        { text: '审核失败', status: 3, type: 'danger' },
        { text: '已删除', status: 4, type: 'info' }
      ],
      // 文章列表接口参数
      params: {
        status: null, // 状态 null默认不传(获取全部状态数据)
        channel_id: null, // 频道id
        begin_pubdate: null, // 起始时间
        end_pubdate: null, // 截至时间
        page: 1, // 页码
        per_page: 10 // 一页条数
      },
      // 文章频道
      channels: [],
      rangeDate: null, // 筛选范围日期
      loading: true // 表格数据加载中loading
    }
  },
  computed: {},
  watch: {},
  methods: {

    // 筛选
    onSubmit () {
      this.params.page = 1
      if (this.rangeDate) {
        this.params.begin_pubdate = this.rangeDate[0]
        this.params.end_pubdate = this.rangeDate[1]
      } else {
        this.params.begin_pubdate = null
        this.params.end_pubdate = null
      }
      this.loadArticles()
    },

    // 调文章列表接口
    loadArticles () {
      this.loading = true
      getArticles(this.params).then(res => {
        this.articles = res.data.data
        // 关闭loading
        this.loading = false
      }).catch({
        // 请求失败
      })
    },

    // 分页
    onCurrentChange (page) {
      this.params.page = page
      this.loadArticles()
    },

    // 获取文章频道
    loadArticlesChannels () {
      getArticlesChannels().then(res => {
        this.channels = res.data.data.channels
      }).catch({
        // 请求失败
      })
    },

    // 删除
    onDeleteArticle (articleId) {
      // 1、后端返回的数据都是字符串
      // 我们可以通过调试工具中的 Network -> Response
      // 网络面板看到原始的返回数据

      // 2、我们在项目中使用 axios 发出的请求
      // axios 为了方便，它会在内部把原始的 JSON 格式的字符串转为
      // JavaScript 对象给你使用

      // 3、JavaScript 能够准确表示的整数方位在-2的53次方到2的53次方之间（不含两个端点）
      // 文章id超出了范围，所以格式化后错误了，显示的id与原本的文章id对不上
      // 解决办法：使用第三方包json-bigint:https://github.com/sidorares/json-bigint
      //     安装：npm i json-bigint
      //     在 main.js 演示如何使用

      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // 更新当前页列表数据
          this.loadArticles()
        }).catch(err => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
          // 请求失败
          console.log('请求失败', err)
        })
      }).catch(() => { })
    }

  },
  created () {
    this.loadArticles()
    this.loadArticlesChannels()
  },
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.box-card{
  margin-bottom: 22px;
}
.pagination{
  margin-top: 20px;
  text-align: right;
}
.article-cover{
  width: 150px;
  height: 100px;
  object-fit: cover;
}
</style>
