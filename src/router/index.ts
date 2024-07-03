import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import LivePage from '@/components/LivePage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Live', component: LivePage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

export default router
