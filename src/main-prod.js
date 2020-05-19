import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
// import './plugins/element.js'
// 导入全局样式
import './assets/global.less'
// 导入图标样式
import './assets/fonts/iconfont.css'
// 导入table表格插件
import ZkTable from 'vue-table-with-tree-grid'
// 导入富文本插件
import VueQuillEditor from 'vue-quill-editor'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
// import 'nprogress/nprogress.css'

// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css'
// 导入axios
import axios from 'axios' // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(ZkTable)
// Vue.component('tree-table', treeTable)
// 配置url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加到vue的原型对象上
Vue.prototype.$http = axios

// 隐藏进度环
NProgress.configure({ showSpinner: false })

// 设置请求拦截器, 为了在服务器请求之前设置头部信息的token值
axios.interceptors.request.use(config => {
  // 显示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
