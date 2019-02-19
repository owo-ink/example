module.exports = {
  // 项目根目录
  root: "/src",
  // 项目入口文件
  entry: "home",
  // 输出目录
  outFolder: "./dist",
  // 是否监测文件改动重新打包
  autoPack: true,
  // 监测文件发生改变目录
  watcherFolder: './src',
  // 是否压缩css
  minifyCss: false,
  // 是否压缩js
  minifyJs: false,
  // 强制打包所有样式
  choiceAnimation: false,
  // 在全局样式文件
  globalStyle: './src/main.css',
  // 静态文件服务
  server: true,
  // 自动重新加载
  autoReload: true,
  // 输出文件自动追加版本号，可以用来消除缓存
  outFileAddVersion: true,
  // head属性清单
  headList: [
    {
      'http-equiv': 'content-type',
      content: 'text/html; charset=UTF-8',
    },
    {
      name: 'viewport',
      content: 'initial-scale=1,user-scalable=no,maximum-scale=1',
    }
  ],
  // 使用到的外部脚本清单
  scriptList: [
    {
      name: "gif",
      src: "./src/script/log.js",
      // 是否使用babel处理
      babel: true,
      // 是否异步加载此脚本,请确保此脚本不会对DOM进行操作
      defer: true
    }
  ],
  // 页面清单
  pageList: [
    {
      // 是否为页面主入口
      main: true,
      isPage: true,
      name: 'home',
      src: './src/page/home.page'
    },
    {
      isPage: true,
      name: 'name',
      src: './src/page/name.page'
    },
    {
      isPage: true,
      name: 'animation',
      src: './src/page/animation.page'
    }
  ]
}