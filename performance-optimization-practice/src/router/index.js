import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/image-optimization',
    name: 'ImageOptimization',
    component: () => import('@/views/ImageOptimization.vue'),
    meta: { title: '图片优化' }
  },
  {
    path: '/list-optimization',
    name: 'ListOptimization',
    component: () => import('@/views/ListOptimization.vue'),
    meta: { title: '列表优化' }
  },
  {
    path: '/lazy-load',
    name: 'LazyLoad',
    component: () => import('@/views/LazyLoad.vue'),
    meta: { title: '懒加载' }
  },
  {
    path: '/code-split',
    name: 'CodeSplit',
    component: () => import('@/views/CodeSplit.vue'),
    meta: { title: '代码分割' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - 性能优化练习`
  next()
})

export default router

