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
        <el-form
          ref="article-form"
          :model="article"
          label-width="80px"
          :rules="ruleForm"
        >
            <el-form-item label="标题：" class="form-title" prop="title">
                <el-input v-model="article.title"></el-input>
            </el-form-item>
             <el-form-item label="内容：" prop="content">
                <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
                <el-tiptap
                  v-model="article.content"
                  :extensions="extensions"
                  lang="zh"
                  height="350"
                  placeholder="请输入文章内容"
                ></el-tiptap>
            </el-form-item>
            <el-form-item label="封面：">
                <el-radio-group v-model="article.cover.type">
                    <el-radio :label="1">单图</el-radio>
                    <el-radio :label="3">三图</el-radio>
                    <el-radio :label="0">无图</el-radio>
                    <el-radio :label="-1">自动</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道：" prop="channel_id">
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
import { uploadImage } from '@/api/images'
// 引入富文本插件
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Image,
  Preview,
  Fullscreen,
  Print,
  TextColor,
  CodeBlock
} from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'

export default {
  name: 'PublishIndex',
  props: {},
  components: {
    // 注册富文本
    'el-tiptap': ElementTiptap
  },
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
      },
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(), // 必须
        new Text(), // 必须
        new Paragraph(), // 必须
        new Heading({ level: 5 }), // 最多有5级标题
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 默认会把土拍你生成 base64字符串和内容存储在一起，如果需要自定义图片上传（将原本的base64字符串图片文本，通过上传图片接口转换成在线图片地址，然后配置到富文本内容里。好处：图片已链接的方式存在文本里，优化加载速度）
          uploadRequest (file) {
            // 如果接口要求'Content-Type' 设置为 multipart/form-data，则请求头必须使用FormData
            const fd = new FormData()
            fd.append('image', file)
            // 上传图片时触发(调上传图片接口)
            return uploadImage(fd).then(res => {
              // 上传成功，拿到接口返回的图片的url
              return res.data.data.url
            }).catch(err => {
              console.log(err)
            })

            // 图片的上传方法，返回一个 Promise<url>
          }
        }),
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(), // 斜体
        new Strike(), // 删除线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(), // 任务列表
        new Print(), // 打印
        new Preview(), // 预览
        new Fullscreen(), // 全屏
        new TextColor(), // 文本颜色
        new CodeBlock() // 代码块
      ],
      // 表单验证配置
      ruleForm: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符', trigger: 'blur' }
        ],
        content: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value === '<p></p>' || value === '') { // 内容为空，验证失败
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          },
          { required: true }
        ],
        channel_id: [
          { required: true, message: '请输选择文章频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {

    onPublish (draft) {
      this.$refs['article-form'].validate((valid, err) => { // 表单验证
        // err 验证失败的字段
        if (!valid) {
          return false
        }

        // 通过验证
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
      })
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
