import Vue from 'vue'
import VueRouter from 'vue-router'

// 登录
// import Login from '../components/Login.vue'
// 主页
// import Home from '../components/Home.vue'
// Welcome
// import Welcome from '../components/Welcome.vue'

// 用户列表
// import Users from '../components/user/Users.vue'
// 用户权限列表
// import Rights from '../components/power/Rights.vue'
// 角色列表
// import Roles from '../components/power/Roles.vue'

// 商品分类
// import Cate from '../components/goods/Cate.vue'
// 分类参数
// import Params from '../components/goods/Params.vue'

// 商品列表
// import Goodlist from '../components/goods/List.vue'
// 商品添加
// import Add from '../components/goods/Add.vue'

// 订单列表
// import Order from '../components/order/Order.vue'
// 数据报表
// import Report from '../components/report/Report.vue'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../components/goods/List.vue')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: GoodsList
        },
        {
          path: '/goods/add',
          component: GoodsAdd
        },
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
