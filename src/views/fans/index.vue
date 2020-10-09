<template>
  <div class="fans-container">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- /面包屑 -->
        </div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="粉丝列表" name="first">
              <el-row :gutter="20" >
                  <el-col
                  :xs="8" :sm="6" :md="4" :lg="2" v-for="(item, index) in fans.results" :key="index" class="col-box"
                  >
                    <el-avatar :src="item.photo"></el-avatar>
                    <p>{{item.name}}</p>
                  </el-col>
              </el-row>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="params2.per_page"
                @current-change="onCurrentChange"
                :current-page.sync="params2.page"
                :disabled="loading"
                :total="fans.total_count">
              </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="粉丝画像" name="second">
            <!-- 第二步:为ECharts准备一个具备大小（宽高）的Dom -->
            <div ref="main" style="width: 600px;height:400px;"></div>
          </el-tab-pane>
        </el-tabs>
        <!-- <h2>地图图标示例</h2>
        <map-demo/> -->
    </el-card>
  </div>
</template>

<script>
// 第一步:加载 echarts
import echarts from 'echarts'
import { getArticles } from '@/api/article'
import { fansList } from '@/api/user'

// import MapDemo from './components/echarts-map-demo'

export default {
  name: 'FansIndex',
  props: {},
  components: {
    // MapDemo
  },
  data () {
    return {
      params2: {
        page: 1, // 页码
        per_page: 20// 一页条数
      },
      activeName: 'first',
      fans: {},
      loading: false
    }
  },
  created () {
    this.onGetArticles()
    this.getFansList()
  },
  methods: {
    // 图文数据
    onGetArticles () {
      const params = {
        page: 1, // 页码
        per_page: 10, // 一页条数
        response_type: 'statistic'
      }
      getArticles(params).then(res => {
        // console.log(res)
        // res.data.data.results.forEach(element => {
        //   element.switchDisabled = false // 按钮禁用状态控制
        // })
        // this.articles = res.data.data
        // this.loading = false
      }).catch({
        // 请求失败
      })
    },
    // 获取粉丝列表
    getFansList () {
      fansList(this.params2).then(res => {
        this.fans = res.data.data
        this.loading = false
      })
    },

    // 分页
    onCurrentChange (page) {
      this.loading = true
      this.params2.page = page
      this.getFansList()
    }
  },
  computed: {},
  watch: {},
  mounted () {
    // 初始化操作dom
    // 第三步:基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)
    // 指定图表的配置项和数据
    var option = {
      color: ['#3398DB'],
      title: {
        text: '粉丝图表'
      },
      tooltip: {},
      legend: {
        data: ['粉丝']
      },
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {},
      series: [{
        name: '粉丝',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.col-box{
  border: 1px dashed #e7e7e7;
  text-align: center;
  margin: 20px;
  height: 150px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 30px;
}
</style>
