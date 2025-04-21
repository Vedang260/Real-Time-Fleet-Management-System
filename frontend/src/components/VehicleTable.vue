<template>
    <div class="vehicle-table-container">
      <v-card class="vehicle-card" elevation="8" rounded="xl">
        <v-card-title class="text-h4 font-weight-bold gradient-text">
          <v-icon large left>mdi-truck</v-icon>
          Fleet Management
        </v-card-title>
        <v-card-subtitle class="mt-2">
          Manage your vehicle fleet efficiently
        </v-card-subtitle>
  
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="vehicles"
            :items-per-page="10"
            :page.sync="page"
            :search="search"
            :loading="loading"
            item-key="id"
            class="elevation-4 rounded-lg"
            @page-count="pageCount = $event"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search vehicles..."
                  single-line
                  hide-details
                  outlined
                  dense
                  rounded
                  class="mr-4"
                ></v-text-field>
                <v-spacer></v-spacer>
                <slot name="header-actions"></slot>
              </v-toolbar>
            </template>
  
            <!-- Status Badge -->
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                small
                class="font-weight-bold"
              >
                {{ item.status }}
              </v-chip>
            </template>
  
            <!-- Action Buttons Slot -->
            <template v-slot:item.actions="{ item }">
              <slot name="actions" :item="item">
                <!-- Default buttons (fallback) -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="$emit('view', item)"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>View Details</span>
                </v-tooltip>
              </slot>
            </template>
  
            <!-- Pagination -->
            <template v-slot:footer>
              <div class="d-flex justify-center">
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  :total-visible="7"
                  circle
                  color="primary"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
  
      <!-- Snackbar for notifications -->
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        timeout="3000"
        rounded="pill"
        top
      >
        {{ snackbarMessage }}
        <template v-slot:actions>
          <v-btn icon @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import type { Vehicle } from '../types'
  
  defineProps<{
    vehicles: Vehicle[]
    loading?: boolean
  }>()
  
  defineEmits<{
    (e: 'view', vehicle: Vehicle): void
    (e: 'edit', vehicle: Vehicle): void
    (e: 'delete', vehicle: Vehicle): void
    // Add other events as needed
  }>()
  
  const authStore = useAuthStore()
  const search = ref('')
  const page = ref(1)
  const pageCount = ref(0)
  const snackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('success')
  
  const isAdmin = computed(() => authStore.user?.role === 'ADMIN')
  const isManager = computed(() => authStore.user?.role === 'MANAGER')
  const isDriver = computed(() => authStore.user?.role === 'DRIVER')
  
  const headers = [
    { title: 'ID', key: 'id', width: '80px' },
    { title: 'Model', key: 'model' },
    { title: 'License Plate', key: 'plate' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '150px' }
  ]
  
  function getStatusColor(status: string) {
    const statusColors: Record<string, string> = {
      'Active': 'success',
      'Inactive': 'error',
      'Maintenance': 'warning',
      'On Route': 'info',
      'Available': 'primary'
    }
    return statusColors[status] || 'grey'
  }
  
  function showNotification(message: string, color: string = 'success') {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
  }
  </script>
  
  <style scoped>
  .vehicle-table-container {
    background: linear-gradient(135deg, #f9fbfd 0%, #e8ecef 100%);
    padding: 24px;
  }
  
  .vehicle-card {
    background: white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .vehicle-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  /* Consistent button styling with register page */
  .v-btn {
    transition: all 0.3s ease;
  }
  
  .v-btn:hover {
    transform: translateY(-2px);
  }
  
  /* Responsive adjustments */
  @media (max-width: 960px) {
    .vehicle-table-container {
      padding: 16px;
    }
    
    .vehicle-card {
      padding: 16px;
    }
    
    .v-data-table {
      overflow-x: auto;
    }
  }
  </style>