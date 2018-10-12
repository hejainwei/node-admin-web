import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    meta: { title: 'dashboard', noCache: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        hidden: true
      }
    ]
  },
  { path: '*',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  }

]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
