<template>
    <div class="add-vehicle-page">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="vehicle-card pa-6" elevation="8" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold gradient-text text-center">
                Add New Vehicle
              </v-card-title>
              <v-card-subtitle class="text-center mt-2">
                Assign a vehicle to your fleet
              </v-card-subtitle>
              <v-card-text>
                <form @submit.prevent="submit">
                  <v-text-field
                    label="Model"
                    v-model="form.model"
                    :error-messages="modelErrors"
                    prepend-inner-icon="mdi-car"
                    outlined
                    dense
                    class="mb-4"
                    @blur="touchField('model')"
                    required
                  />
                  
                  <v-select
                    label="Type"
                    v-model="form.type"
                    :items="vehicleTypes"
                    :error-messages="typeErrors"
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    outlined
                    dense
                    class="mb-4"
                    @blur="touchField('type')"
                    required
                  />
                  
                  <v-text-field
                    label="License Plate"
                    v-model="form.licensePlate"
                    :error-messages="licensePlateErrors"
                    prepend-inner-icon="mdi-numeric"
                    outlined
                    dense
                    class="mb-4"
                    @blur="touchField('licensePlate')"
                    required
                  />
                  
                  <v-select
                    label="Assign Driver"
                    v-model="form.driverId"
                    :items="drivers"
                    item-title="username"
                    item-value="userId"
                    :error-messages="driverErrors"
                    prepend-inner-icon="mdi-account"
                    outlined
                    dense
                    class="mb-4"
                    @blur="touchField('driverId')"
                    :loading="loadingDrivers"
                    required
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          No drivers found. Please add drivers first.
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-select>
                  
                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    large
                    rounded
                    elevation="4"
                    :loading="loading"
                    class="mt-4 gradient-button"
                  >
                    Add Vehicle
                    <v-icon right>mdi-plus</v-icon>
                  </v-btn>
                </form>
              </v-card-text>
            </v-card>
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
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import axios from 'axios'
  import { customStorage } from '@/utils/customStorage'
  
  const router = useRouter();

   // Auth
   const storedUser = customStorage.getItem('auth')
   const user = storedUser ? JSON.parse(storedUser) : null
  
  
  // Form data
  const form = ref({
    model: '',
    type: '',
    licensePlate: '',
    driverId: null
  });
  
  // Vehicle types
  const vehicleTypes = ref([
    'Car',
    'Truck',
    'Bicycle',
    'Motorcycle',
    'Van',
    'Bus',
    'Other'
  ]);
  
  // Drivers list
  const drivers = ref([]);
  const loadingDrivers = ref(false);
  
  // UI states
  const loading = ref(false);
  const snackbar = ref(false);
  const snackbarMessage = ref('');
  const snackbarColor = ref('error');
  
  // Validation rules
  const rules = {
    form: {
      model: { required },
      type: { required },
      licensePlate: { required },
      driverId: { required }
    },
  };
  
  const v$ = useVuelidate(rules, { form });
  
  // Error messages
  const modelErrors = computed(() => {
    const field = v$.value.form.model;
    if (field.$dirty && field.$invalid) {
      return field.$errors.map((e: any) => 'Model is required');
    }
    return [];
  });
  
  const typeErrors = computed(() => {
    const field = v$.value.form.type;
    if (field.$dirty && field.$invalid) {
      return field.$errors.map((e: any) => 'Type is required');
    }
    return [];
  });
  
  const licensePlateErrors = computed(() => {
    const field = v$.value.form.licensePlate;
    if (field.$dirty && field.$invalid) {
      return field.$errors.map((e: any) => 'License plate is required');
    }
    return [];
  });
  
  const driverErrors = computed(() => {
    const field = v$.value.form.driverId;
    if (field.$dirty && field.$invalid) {
      return field.$errors.map((e: any) => 'Driver selection is required');
    }
    return [];
  });
  
  function touchField(field: string) {
    if (v$.value.form[field]) {
      v$.value.form[field].$touch();
    }
  }
  
  // Fetch drivers from backend
  async function fetchDrivers() {
    loadingDrivers.value = true;
    try {
      // Replace with your actual API call
      const response = await axios.get(
        `http://localhost:8000/api/auth/drivers`,
        {
          headers: {
            Authorization: `Bearer ${user?.token || ''}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      if(response.data.success){
       drivers.value = response.data.driversList;
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      snackbarMessage.value = 'Failed to load drivers';
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      loadingDrivers.value = false;
    }
  }
  
  async function submit() {
    v$.value.$touch();
    if (v$.value.$invalid) return;
  
    loading.value = true;
    try {
        const response = await axios.post(
        `http://localhost:8000/api/vehicles/create`,
        JSON.stringify(form.value),
        {
          headers: {
            Authorization: `Bearer ${user?.token || ''}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      
      if (response.data.success) {
        snackbarMessage.value = response.data.message;
        snackbarColor.value = 'success';
        snackbar.value = true;
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      snackbarMessage.value = err.message;
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      loading.value = false;
    }
  }
  
  // Fetch drivers when component mounts
  onMounted(() => {
    fetchDrivers();
  });
  </script>
  
  <style scoped>
  .add-vehicle-page {
    background: linear-gradient(135deg, #f9fbfd 0%, #e8ecef 100%);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  .add-vehicle-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('../assets/patterns/register-pattern.png') no-repeat center center;
    background-size: cover;
    opacity: 0.1;
    z-index: 0;
  }
  
  .vehicle-card {
    background: white;
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .vehicle-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  .gradient-button {
    background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
    color: white !important;
  }
  
  .link {
    color: #2196F3;
    text-decoration: none;
    font-weight: 500;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  
  .v-text-field,
  .v-select {
    transition: all 0.3s ease;
  }
  
  .v-text-field:hover,
  .v-select:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 600px) {
    .text-h4 {
      font-size: 1.5rem !important;
    }
  
    .vehicle-card {
      padding: 1rem;
    }
  
    .v-btn {
      font-size: 0.875rem;
    }
  }
  </style>