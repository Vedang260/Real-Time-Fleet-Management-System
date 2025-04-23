<template>
    <Navbar />
    <div class="routes-page">
      <v-container>
        <RoutesTable 
          :routes="routes" 
          :loading="loading"
          @viewOnMap="viewOnMap"
        >
          <template #item-actions="{ item }">  
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  color="info"
                  class="mr-2"
                  @click.stop="viewOnMap(item)"
                >
                  <v-icon>mdi-map-marker-path</v-icon>
                </v-btn>
              </template>
              <span>View On Map</span>
            </v-tooltip>
          </template>
        </RoutesTable>
        <v-snackbar
                v-model="snackbar"
                :color="snackbarColor"
                timeout="3000"
                rounded="pill"
                top
              >
                {{ snackbarMessage }}
                <template v-slot:actions>
                  <v-btn text @click="snackbar = false">Close</v-btn>
                </template>
        </v-snackbar>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import RoutesTable from '@/components/RoutesTable.vue'
  import type { RoutesResponse, Routes } from '@/types/vehicleRoutes'
  import Navbar from '@/components/Navbar.vue'
  import axios from 'axios'
  import { customStorage } from '@/utils/customStorage'
  import { computed } from 'vue';
  
  // State
  const routes = ref<Routes[]>([])
  const loading = ref(false)
  const selectedRoute = ref<Routes | null>(null)
  const route = useRoute()
  const router = useRouter()
  const snackbar = ref(false);
  const snackbarMessage = ref('');
  const snackbarColor = ref('error');
  
  const vehicleId = computed(() => route.params.vehicleId as string)

  const storedUser = customStorage.getItem('auth');
  const user = (storedUser ? JSON.parse(storedUser) : null);
  
  // Fetch vehicles from API
  const fetchRoutes = async () => {
    loading.value = true
    try {
      const response = await axios.get<RoutesResponse>(`http://localhost:8000/api/routes/vehicles/${vehicleId.value}`, { 
          withCredentials: true, 
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("Responses: ", response);
      if(response.data.success){
          snackbarMessage.value = response.data.message;
          snackbarColor.value = 'success';
          snackbar.value = true;
          routes.value = response.data.routes;
      }
      
    } catch (error: any) {
        console.log(error);
      snackbarMessage.value = error.message;
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchRoutes)
  
  const viewOnMap = (routes: Routes) => {
    router.push(`/driver/${vehicleId.value}/routes/${routes.routesId}`)
  }
  
  </script>
  
  <style scoped>
  .routes-page {
    background: linear-gradient(135deg, #f9fbfd 0%, #e8ecef 100%);
    min-height: 100vh;
    padding: 24px;
  }
  
  .gradient-button {
    background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
    color: white !important;
    transition: all 0.3s ease;
  }
  
  .gradient-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .v-btn {
    transition: all 0.2s ease;
  }
  
  .v-btn:hover {
    transform: scale(1.1);
  }
  </style>