module.exports = {
  // 项目根目录
  "root": "/src",
  // 项目入口文件
  "entry": "home",
  // 输出目录
  "outFolder": "dist",
  // 是否监测文件改动重新打包
  "autoPack": false,
  // 是否压缩css
  "minifyCss": false,
  // 是否压缩js
  "minifyJs": false,
  // 页面目录
  "pageFolder": "page",
  // 强制打包所有样式
  "choiceAnimation": false,
  // head列表
  "headList": [
    {
      'http-equiv': 'content-type',
      content: 'text/html; charset=UTF-8',
    },
    {
      name: 'viewport',
      content: 'initial-scale=1,user-scalable=no,maximum-scale=1',
    }
  ]
}