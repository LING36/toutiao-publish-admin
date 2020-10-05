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
        <el-form ref="form" :model="form" label-width="55px" size="small">
          <el-form-item label="状态：">
            <el-radio-group v-model="form.resource">
              <el-radio label="全部"></el-radio>
              <el-radio label="草稿"></el-radio>
              <el-radio label="待审核"></el-radio>
              <el-radio label="审核通过"></el-radio>
              <el-radio label="审核失败"></el-radio>
              <el-radio label="已删除"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道：">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option label="开发者资讯" value="shanghai"></el-option>
              <el-option label="ios" value="beijing"></el-option>
              <el-option label="c++" value="beijing"></el-option>
              <el-option label="android" value="beijing"></el-option>
              <el-option label="css" value="beijing"></el-option>
              <el-option label="数据库" value="beijing"></el-option>
              <el-option label="区块链" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <!-- DateTimePicker 日期时间选择器 -->
          <el-form-item label="日期：">
            <el-date-picker
              v-model="form.date1"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">筛选</el-button>
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
        >
          <el-table-column
            prop="date"
            label="封面"
          >
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
              <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
              <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
              <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
              <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间">
          </el-table-column>
          <el-table-column
            label="操作">
            <!-- 如果需要自定义表格列表模板，则把需要自定义的内容放到 template 里面 -->
            <template>
              <el-button
                size="medium"
                circle
                type="primary"
                icon="el-icon-edit"
                plain
               >
              </el-button>
              <el-button
                size="medium"
                circle
                type="danger"
                icon="el-icon-delete"
                plain
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
          :total="1000">
        </el-pagination>
        <!-- /分页 -->
      </div>
    </el-card>

  </div>
</template>

<script>
import { getArticles } from '@/api/article'

export default {
  name: 'ArticleIndex',
  props: {},
  components: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // 文章数据列表
      articles: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    loadArticles () {
      getArticles().then(res => {
        console.log(res)
        this.articles = res.data.data
      }).catch(err => {
        // 请求失败
        console.log('请求失败', err)
      })
    }
  },
  created () {
    this.loadArticles()
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
</style>
