import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Lazy load components to avoid type declaration issues
const HomeView = () => import('../views/home/HomeView.vue')
const MoviesView = () => import('../views/movies/MoviesView.vue')
const AboutView = () => import('../views/about/AboutView.vue')

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/movies',
    name: 'movies',
    component: MoviesView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
]

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
