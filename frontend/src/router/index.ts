import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    { 
      path: '/register', 
      name: 'Register', 
      component: RegisterPage 
    },
  ],
})

export default router
