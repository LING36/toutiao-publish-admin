<template>
  <div class="home-container"></div>
</template>

<script>
export default {
  // 指定 name 选项的另一个好处是便于调试。有名字的组件有更友好的警告信息。
  // 另外，当在有 vue-devtools，未命名组件将显示成 <AnonymousComponent>，这很没有语义。
  // 通过提供 name 选项，可以获得更有语义信息的组件树。
  // 结论：给一个组件起个名字是非常有意义的，尽量不要让组件的名字重复
  name: 'HomeIndex',
  props: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created () {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.home-container{
  width: 100%;
  height: 100%;
   // background-color: #e9eef3;
    background: url('../../assets/images/index_bg.jpg') no-repeat;
    background-size: contain;
}
</style>
