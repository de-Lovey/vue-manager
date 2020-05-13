import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/users/Users.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes:[
    { path: '/', redirect:'/login' },
    { path: '/login', component: Login, name: 'login' },
    {
 path: '/home',
component: Home,
      redirect: '/welcome',
children : [
  { path :  '/welcome', component : Welcome },
  { path: '/users', component: Users }
      ]
}

  ]
})

// 监听路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路由
  // from 从哪个路由跳转过来的
  // next() 执行下一个操作了
  if (to.path === '/login') {
 return next()
}
  // // 如果不是/login, 判断你当前有没有登录的状态, 即token
  const token = window.sessionStorage.getItem('token')
  // //  如果没有获取到token值, 强制去跳转到login界面
  if (!token) return next('/login')
  //
  // // 如果拿到了, 则放行,
  next()
})

export default router
