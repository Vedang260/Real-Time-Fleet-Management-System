<template>
  <v-card class="vehicle-card" elevation="8" rounded="xl">
    <v-card-title class="text-h4 font-weight-bold gradient-text">
      <v-icon large left>mdi-truck</v-icon>
      Fleet Vehicles
    </v-card-title>
    
    <v-data-table
      :headers="filteredHeaders"
      :items="vehicles"
      :items-per-page="itemsPerPage"
      :page.sync="currentPage"
      :search="searchQuery"
      :loading="loading"
      item-key="id"
      class="elevation-4 rounded-lg"
      @update:page-count="totalPages = $event"
    >
      <!-- Search and Toolbar -->
      <template #top>
        <v-toolbar flat>
          <v-text-field
            v-model="searchQuery"
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
          <slot name="table-actions"></slot>
        </v-toolbar>
      </template>

      <!-- Status Column -->
      <template #item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" small>
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <div class="action-buttons">
          <slot name="item-actions" :item="item">
            <!-- Default fallback button -->
            <v-btn
              icon
              color="primary"
              small
              @click="$emit('view', item)"
            >
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
          </slot>
        </div>
      </template>

      <!-- Pagination Footer -->
      <template #bottom>
        <div class="text-center pt-2">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            circle
          ></v-pagination>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DataTableHeader } from 'vuetify'

// Props
defineProps<{
  vehicles: any[]
  loading?: boolean
  itemsPerPage?: number
}>()

// Emits
defineEmits<{
  (e: 'view', vehicle: any): void
  (e: 'edit', vehicle: any): void
  (e: 'delete', vehicle: any): void
}>()

// Local state
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(0)

// Table headers with proper typing
const headers: DataTableHeader[] = [
  { title: 'ID', key: 'id', width: '100px' },
  { title: 'Model', key: 'model' },
  { title: 'License Plate', key: 'plate' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '150px' }
]

// Filtered headers for TypeScript safety
const filteredHeaders = computed(() => headers.filter(h => h))

// Helper methods
const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Active': 'success',
    'Inactive': 'error',
    'Maintenance': 'warning',
    'Available': 'primary'
  }
  return statusMap[status] || 'grey'
}
</script>

<style scoped>
.vehicle-card {
  background: white;
  padding: 20px;
  margin: 16px;
}

.gradient-text {
  background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.v-data-table {
  margin-top: 16px;
}
</style>