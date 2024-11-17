import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UpdateView from '../views/UpdateView.vue'
import TestView from '@/views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todo-list',
      component: HomeView
    },
    {
      path: '/todo/:id/update',
      name: 'todo-update',
      component: UpdateView
    },
    {
      path: '/test',
      name: 'test-view',
      component: TestView
    },
  ]
})

export default router
