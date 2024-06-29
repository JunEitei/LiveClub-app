import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import GoodsPage from '@/components/GoodsPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Goods', component: GoodsPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

export default router
