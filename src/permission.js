import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/authredirect']// no redirect whitelist
function handleMenu(menuList,parent){
  let menu = {}
  let router = {}
  let router_temp = {}
  for(let index in menuList){
    menu = menuList[index]
    router = {
      meta: { title: menu.menu_ename, noCache: true },
      path: menu.router_path,
      name: menu.menu_ename,
      hidden: menu.category && menu.category!=1?true:false
    }
    if(menu.component){
      router['component']=require('@/views/'+menu.component).default
    }
    router_temp = store.getters.menuTree[menu.menu_id+'']
    if(router_temp){
      if(menu.redirect==1){
        router.redirect = router_temp[0].router_path
      }
      router.children = []
      parent.push(router)
      handleMenu(router_temp,router.children)
    }else{
      parent.push(router)
    }
  }
}
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserMenu').then((response)=>{
          if(response && response.status==1){
            const menuTree = response.data.menuTree
            const routers =[]
            handleMenu(menuTree[0],routers)
            store.dispatch('GenerateRoutes',routers)
            store.dispatch('SetRole')
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          }else{
            next('/login')
            NProgress.done()
          }
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
