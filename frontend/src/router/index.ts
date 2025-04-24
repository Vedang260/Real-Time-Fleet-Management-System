import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import AdminPage from '@/views/AdminPage.vue'
import Map from '@/components/Map.vue'
import AddRoutes from '@/components/AddRoutes.vue'
import DriverPage from '@/views/DriverPage.vue'
import RoutesPage from '@/views/RoutesPage.vue'
import RouteMap from '@/components/RouteMap.vue'
import TrackingPage from '@/views/TrackingPage.vue'
import AddVehicles from '@/components/AddVehicles.vue'

const router = createRouter({
  history: createWebHistory(),
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
      path: '/view/vehicles/routes/:vehicleId',
      name: 'ViewRoutes',
      component: RoutesPage,
      props: true
    },
    {
      path: '/vehicles/routes/:vehicleId',
      name: 'AddRoutes',
      component: AddRoutes,
      props: true
    },
    {
      path: '/driver/:vehicleId/routes/:routesId',
      name: 'Drivers Map Route',
      component: RouteMap,
      props: true
    },
    {
      path: '/track/vehicle/:vehicleId/routes/:routesId',
      name: 'Track Vehicle',
      component: TrackingPage,
      props: true
    },
    {
      path: '/add/vehicles',
      name: 'Add Vehicle',
      component: AddVehicles
    }
  ],
})

export default router
