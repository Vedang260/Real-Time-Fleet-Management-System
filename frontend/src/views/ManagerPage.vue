<template>
    <Navbar />
    <div class="manager-page">
      <v-container>
        <VehicleTable 
          :vehicles="vehicles" 
          :loading="loading"
          @track="trackVehicle"
        >
          <template #item-actions="{ item }">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  color="info"
                  class="mr-2"
                  @click.stop="trackVehicle(item)"
                >
                  <v-icon>mdi-map-marker-path</v-icon>
                </v-btn>
              </template>
              <span>Track Vehicle</span>
            </v-tooltip>
          </template>
        </VehicleTable>
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
  import { useRouter } from 'vue-router'
  import VehicleTable from '@/components/VehicleTable.vue'
  import type { GetVehiclesResponse, Vehicle } from '@/types/vehicle'
  import Navbar from '@/components/Navbar.vue'
  import axios from 'axios'
  import { customStorage } from '@/utils/customStorage'
  
  // State
  const vehicles = ref<Vehicle[]>([])
  const loading = ref(false)
  const deleteDialog = ref(false)
  const selectedVehicle = ref<Vehicle | null>(null)
  const router = useRouter()
  const snackbar = ref(false);
  const snackbarMessage = ref('');
  const snackbarColor = ref('error');
  
  const storedUser = customStorage.getItem('auth');
  const user = (storedUser ? JSON.parse(storedUser) : null);
  
  // Fetch vehicles from API
  const fetchVehicles = async () => {
    loading.value = true
    try {
      const response = await axios.get<GetVehiclesResponse>(`http://localhost:8000/api/vehicles`, { 
          withCredentials: true, 
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      if(response.data.success){
          snackbarMessage.value = response.data.message;
          snackbarColor.value = 'success';
          snackbar.value = true;
         vehicles.value = response.data.vehicles;
      }
      
    } catch (error: any) {
      snackbarMessage.value = error.message;
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchVehicles)
  
  const trackVehicle = (vehicle: Vehicle) => {
    router.push(`/view/vehicles/routes/${vehicle.vehicleId}`)
  }
  
  </script>
  
  <style scoped>
  .manager-page {
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