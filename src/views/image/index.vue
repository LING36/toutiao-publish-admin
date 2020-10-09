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
            </div>
             <image-list />
        </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list'
export default {
  name: 'ImageIndex',
  props: {},
  components: {
    ImageList
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {

  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
</style>
