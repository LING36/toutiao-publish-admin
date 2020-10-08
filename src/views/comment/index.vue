<template>
  <div class="comment-container">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
             <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>评论管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- /面包屑 -->
        </div>
        <!-- 表格 -->
        <el-table
            :data="articles.results"
            v-loading="loading"
            style="width: 100%">
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="total_comment_count"
                label="总评论数">
            </el-table-column>
            <el-table-column
                prop="fans_comment_count"
                label="粉丝评论数">
            </el-table-column>
            <el-table-column
                label="评论状态">
                <template slot-scope="scope" >
                    {{scope.row.comment_status?'正常':'关闭'}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.comment_status"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :disabled="scope.row.switchDisabled"
                      @change="changeStatus(scope.row)">
                    </el-switch>
                    <!-- <el-tag
                      v-if="scope.row.comment_status"
                      type="danger"
                      effect="dark">
                      关闭评论
                    </el-tag>
                    <el-tag
                      v-else
                      type="success"
                      effect="dark">
                      打开评论
                    </el-tag> -->
                </template>
            </el-table-column>
        </el-table>
        <!-- /表格 -->
        <!-- 分页 -->
        <!--
            current-page: 控制激活的页面（设置当前选中的页码）
            page-sizes：控制可选的每页大小
            page-size：每页条数
        -->
        <el-pagination
            class="pagination"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="articles.total_count">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, changeStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  props: {},
  components: {},
  data () {
    return {
      articles: [],
      currentPage4: 4,
      params: {
        page: 1, // 页码
        per_page: 10, // 一页条数
        response_type: 'comment' // 传此参数返回用于评论管理的字段
      },
      loading: true
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {

    // 获取列表数据
    loadArticles () {
      this.loading = true
      getArticles(this.params).then(res => {
        res.data.data.results.forEach(element => {
          element.switchDisabled = false // 按钮禁用状态控制
        })
        this.articles = res.data.data
        this.loading = false
      }).catch(err => {
        // 请求失败
        console.log('请求失败', err)
      })
    },

    // 修改文章评论状态
    changeStatus (article) {
      article.switchDisabled = true
      changeStatus(article.comment_status, article.id.toString()).then(res => {
        if (article.comment_status) {
          this.$message({
            message: '打开评论成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '关闭评论成功',
            type: 'success'
          })
        }
        article.switchDisabled = false
      }).catch(err => {
        console.log(err)
      })
    },

    // 切换每页条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.params.page = 1
      this.params.per_page = val
      this.loadArticles()
    },

    // 分页切换
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.params.page = val
      this.loadArticles()
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.pagination{
    margin: 20px 0;
    float: right;
}
</style>
