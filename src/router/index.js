import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/welcome.vue'
// import Users from '../components/users/Users.vue'
// import Rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'
// import Cate from '../components/shop/Cate'
// import GoodsList from '../components/shop/List'
// import Params from '../components/shop/Params'
// import Add from '../components/shop/Add'
// import Report from '../components/report/Report'

const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/welcome.vue')
const Users = () => import(/* webpackChunkName:"user" */ '../components/users/Users.vue')
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName:"shop" */ '../components/shop/Cate.vue')
const Params = () => import(/* webpackChunkName:"shop" */ '../components/shop/Params.vue')
const List = () => import(/* webpackChunkName:"shop" */ '../components/shop/List.vue')
const Add = () => import(/* webpackChunkName:"shop" */ '../components/shop/Add.vue')
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/Report.vue')

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'login' },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/reports', component: Report }
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
