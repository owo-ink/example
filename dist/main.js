
    window.ozzx = {
      script: {}
    };
    var globalConfig = {"root":"/src","entry":"home","headFolder":"head","outFolder":"dist","autoPack":true,"minifyCss":false,"minifyJs":false,"pageFolder":"page","isOnePage":false};
  // 对象合并方法
function assign(a, b) {
  var newObj = {}
  for (var key in a){
    newObj[key] = a[key]
  }
  for (var key in b){
    newObj[key] = b[key]
  }
  return newObj
}

// 运行页面所属的方法
function runPageFunction (pageName, entryDom) {
  // ozzx-name处理
  window.ozzx.domList = {}
  pgNameHandler(entryDom)

  // 判断页面是否有自己的方法
  var newPageFunction = window.ozzx.script[pageName]
  if (!newPageFunction) return
  // 注入运行环境
  newPageFunction.created.apply(assign(newPageFunction, {
    $el: entryDom,
    activePage: window.ozzx.activePage,
    domList: window.ozzx.domList
  }))
  // 判断页面是否有下属模板,如果有运行所有模板的初始化方法
  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key]
    if (templateScript.created) {
      // 为模板注入运行环境
      templateScript.created.apply(assign(newPageFunction.template[key], {
        $el: entryDom,
        activePage: window.ozzx.activePage,
        domList: window.ozzx.domList
      }))
    }
  }
}

// ozzx-name处理
function pgNameHandler (dom) {
  // 遍历每一个DOM节点
  for (var i = 0; i < dom.children.length; i++) {
    var tempDom = dom.children[i]
    
    // 判断是否存在@name属性
    var pgName = tempDom.attributes['@name']
    if (pgName) {
      // console.log(pgName.textContent)
      window.ozzx.domList[pgName.textContent] = tempDom
    }
    // 判断是否有点击事件
    var clickFunc = tempDom.attributes['@click']
    
    if (clickFunc) {
      tempDom.onclick = function() {
        var clickFor = this.attributes['@click'].textContent
        // 判断页面是否有自己的方法
        var newPageFunction = window.ozzx.script[window.ozzx.activePage]
        
        // console.log(this.attributes)
        // 判断是否为模板
        var templateName = this.attributes['template']
        // console.log(templateName)
        if (templateName) {
          newPageFunction = newPageFunction.template[templateName.textContent]
        }
        // console.log(newPageFunction)
        // 取出参数
        var parameterArr = []
        var parameterList = clickFor.match(/[^\(\)]+(?=\))/g)
        if (parameterList && parameterList.length > 0) {
          // 参数列表
          parameterArr = parameterList[0].split(',')
          // 进一步处理参数
          for (var i = 0; i < parameterArr.length; i++) {
            var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, "")
            // console.log(parameterValue)
            // 判断参数是否为一个字符串
            if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2)
            }
            if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2)
            }
            // console.log(parameterArr[i])
          }
          clickFor = clickFor.replace('(' + parameterList + ')', '')
        }
        // console.log(newPageFunction)
        // 如果有方法,则运行它
        if (newPageFunction.methods[clickFor]) {
          // 绑定window.ozzx对象
          // console.log(tempDom)
          newPageFunction.methods[clickFor].apply({
            $el: this,
            activePage: window.ozzx.activePage,
            domList: window.ozzx.domList,
            data: newPageFunction.data,
            methods: newPageFunction.methods
          }, parameterArr)
        }
      }
    }
    // 递归处理所有子Dom结点
    if (tempDom.children.length > 0) {
      pgNameHandler(tempDom)
    }
  }
}// 获取URL #后面内容
function getarg(url){
  arg = url.split("#");
  return arg[1];
}

// 页面资源加载完毕事件
window.onload = function() {
  // 取出URL地址判断当前所在页面
  var pageArg = getarg(window.location.href)
  // 从配置项中取出程序入口
  var page = pageArg ? pageArg.split('&')[0] : globalConfig.entry
  if (page) {
    var entryDom = document.getElementById('ox-' + page)
    if (entryDom) {
      // 显示主页面
      entryDom.style.display = 'block'
      window.ozzx.activePage = page
      runPageFunction(page, entryDom)
    } else {
      console.error('入口文件设置错误!')
    }
  } else {
    console.error('未设置程序入口!')
  }
}

// url发生改变事件
window.onhashchange = function(e) {
  var oldUrlParam = getarg(e.oldURL)
  var newUrlParam = getarg(e.newURL)
  // 切换页面特效
  switchPage(oldUrlParam, newUrlParam)
}
// 页面切换效果

// 获取URL参数
function getQueryString(newUrlParam, name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  var r = newUrlParam.match(reg)
  if (r != null) return unescape(r[2])
  return null; 
}

// 无特效翻页
function dispalyEffect (oldDom, newDom) {
  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'
  }
  // 查找页面跳转后的page
  newDom.style.display = 'block'
}

// 淡入效果
function fadeinEffect (oldDom, newDom) {
  // 查找页面跳转后的page
  newDom.style.position = 'fixed'
  newDom.style.left = 0
  newDom.style.top = 0
  newDom.style.width = '100%'
  newDom.style.height = '100%'
  newDom.style.opacity = 0
  newDom.style.transition = 'opacity 1s'
  newDom.style.display = 'block'
  setTimeout(() => {
    if (oldDom) {
      // 隐藏掉旧的节点
      oldDom.style.display = 'none'
      // 清除临时设置的style
      newDom.style.position = ''
      newDom.style.left = ''
      newDom.style.top = ''
      newDom.style.width = ''
      newDom.style.height = ''
      newDom.style.opacity = ''
      newDom.style.transition = ''
    }
  }, 900)
  setTimeout(() => {
    newDom.style.opacity = 1
  }, 0)
}

// 淡出效果
function fadeoutEffect (oldDom, newDom) {
  // 查找页面跳转后的page
  oldDom.style.zIndex = 999
  oldDom.style.position = 'fixed'
  oldDom.style.left = 0
  oldDom.style.top = 0
  oldDom.style.width = '100%'
  oldDom.style.height = '100%'
  oldDom.style.opacity = 1
  oldDom.style.transition = 'opacity 1s'
  newDom.style.display = 'block'
  setTimeout(() => {
    if (oldDom) {
      // 隐藏掉旧的节点
      oldDom.style.display = 'none'
      // 清除临时设置的style
      oldDom.style.position = ''
      oldDom.style.left = ''
      oldDom.style.top = ''
      oldDom.style.width = ''
      oldDom.style.height = ''
      oldDom.style.opacity = ''
      oldDom.style.transition = ''
    }
  }, 900)
  setTimeout(() => {
    oldDom.style.opacity = 0
  }, 0)
}

function switchPage (oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam
  var newPage = newUrlParam
  let newPagParamList = newPage.split('&')
  if (newPage) newPage = newPagParamList[0]
  // 查找页面跳转前的page页(dom节点)
  // console.log(oldUrlParam)
  // 如果源地址获取不到 那么一般是因为源页面为首页
  if (oldPage === undefined) {
    oldPage = globalConfig.entry
  } else {
    oldPage = oldPage.split('&')[0]
  }
  var oldDom = document.getElementById('ox-' + oldPage)
  var newDom = document.getElementById('ox-' + newPage)
  if (!newDom) {
    console.error('页面不存在!')
    return
  }
  // 判断是否有动画效果
  if (newPagParamList.length > 1) {
    var animationIn = getQueryString(newUrlParam, 'in')
    var animationOut = getQueryString(newUrlParam, 'out')
    // 如果没用动画参数则使用默认效果
    if (!animationIn || !animationOut) {
      dispalyEffect(oldDom, newDom)
      return
    }
    console.log(animationIn, animationOut)
    newDom.style.display = 'block'
    newDom.style.position = 'fixed'
    newDom.style.left = 0
    newDom.style.top = 0
    newDom.style.width = '100%'
    newDom.style.height = '100%'
    document.body.style.overflow = 'hidden'
    animationIn.split(',').forEach(value => {
      oldDom.classList.add('ox-page-' + value)
    })
    animationOut.split(',').forEach(value => {
      newDom.classList.add('ox-page-' + value)
    })
    
    setTimeout(() => {
      // 隐藏掉旧的节点
      oldDom.style.display = 'none'
      // 清除临时设置的style
      newDom.style.position = ''
      newDom.style.left = ''
      newDom.style.top = ''
      newDom.style.width = ''
      newDom.style.height = ''

      // 清除临时设置的class
      animationIn.split(',').forEach(value => {
        oldDom.classList.remove('ox-page-' + value)
      })
      animationOut.split(',').forEach(value => {
        newDom.classList.remove('ox-page-' + value)
      })
      document.body.style.overflow = ''
    }, 2000)
  } else {
    dispalyEffect(oldDom, newDom)
  }
  
  window.ozzx.activePage = newPage
  runPageFunction(newPage, newDom)
}
      window.ozzx.script = {home:{data:{nameList:{rank1:{name:"lis",like:"orange"},rank2:{name:"kim",like:"yellow"},rank3:{name:"tony",like:"white"}}},created:function created(){console.log('hellow word!');},methods:{showAlert:function showAlert(othersName,myName){console.log('可以传递参数:',othersName,myName);console.log('方便的获取到可能会用到的信息!');console.log(this);this.$el.innerText="Hellow ".concat(othersName,", My name is ").concat(myName);}}},name:{created:function created(){console.log('my name is pack!');}}}
    