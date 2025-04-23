import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import AdminPage from '@/views/AdminPage.vue'
import Map from '@/components/Map.vue'
import AddRoutes from '@/components/AddRoutes.vue'
import DriverPage from '@/views/DriverPage.vue'

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
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminPage
    },
    {
      path: '/driver',
      name: 'driver',
      component: DriverPage
    },
    {
      path: '/vehicles/track/:vehicleId',
      name: 'Map',
      component: Map,
      props: true
    },
    {
      path: '/vehicles/routes/:vehicleId',
      name: 'AddRoutes',
      component: AddRoutes,
      props: true
    }
  ],
})

export default router
