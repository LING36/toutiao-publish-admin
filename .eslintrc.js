
// ESLint diamond规范校验工具的配置文件
// 该文件如果修改必须重启才能生效
// 规则:https://eslint.bootcss.com/docs/rules/
// 提示：有时候修改了这个配置文件不会生效，如果不生效就手动删除 node_modules /.cache 目录，然后启动项目
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 自定义代码校验规范
  rules: {
    // process.env.NODE_ENV === 'production' 可以用来判定代码运行的环境
    // production 生产环境
    // development 开发环境
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    // 'no-unused-vars': 'off' // 关闭这个规则验证
  }
}
