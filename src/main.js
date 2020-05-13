import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
// 导入全局样式
import './assets/global.less'
// 导入图标样式
import './assets/fonts/iconfont.css'

// 导入axios
import axios from 'axios'
// 配置url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加到vue的原型对象上
Vue.prototype.$http = axios

// 设置请求拦截器, 为了在服务器请求之前设置头部信息的token值
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
