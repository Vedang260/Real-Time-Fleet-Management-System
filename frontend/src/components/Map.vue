<template>
  <div class="tracking-container">
    <v-card class="map-card" elevation="8" rounded="xl">
      <v-toolbar color="primary" dark flat>
        <v-icon large left>mdi-map-marker-path</v-icon>
        <v-toolbar-title class="font-weight-bold">Vehicle Tracking</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <!-- Vehicle Info Card -->
        <v-card v-if="vehicle" class="mb-6" elevation="4" rounded="lg">
          <v-card-text class="d-flex align-center">
            <v-avatar color="secondary" size="56" class="mr-4">
              <v-icon large>mdi-car</v-icon>
            </v-avatar>
            <div>
              <div class="text-h6">{{ vehicle.model }}</div>
              <div class="text-subtitle-1">Plate: {{ vehicle.plate }}</div>
              <div class="text-caption">Last updated: {{ formatTimestamp(vehicle.lastUpdated) }}</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Search and Controls -->
        <div class="map-controls">
          <GMapAutocomplete @place_changed="onPlaceChanged" class="search-bar">
            <template #default="{ attrs }">
              <v-text-field
                v-bind="attrs"
                placeholder="Search for a location"
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                hide-details
                clearable
              ></v-text-field>
            </template>
          </GMapAutocomplete>

          <v-btn
            v-if="!hasLocation && selectedLocation"
            color="secondary"
            @click="saveLocation"
            :loading="saving"
            class="ml-4"
            elevation="2"
          >
            <v-icon left>mdi-content-save</v-icon>
            Save Location
          </v-btn>
        </div>

        <!-- Google Map -->
        <div class="map-wrapper">
          <GMapMap
            ref="mapRef"
            :center="mapCenter"
            :zoom="15"
            map-type-id="roadmap"
            style="width: 100%; height: 60vh"
            @click="onMapClick"
          >
            <!-- Vehicle Marker -->
            <GMapMarker
              v-if="vehiclePosition"
              :position="vehiclePosition"
              :icon="carIcon"
            >
              <GMapInfoWindow>
                <div class="info-window">
                  <strong>{{ vehicle?.model }}</strong><br />
                  Plate: {{ vehicle?.plate }}<br />
                  Last updated: {{ formatTimestamp(vehicle?.lastUpdated) }}
                </div>
              </GMapInfoWindow>
            </GMapMarker>

            <!-- Location History Path -->
            <GMapPolyline
              v-if="locationHistory.length > 1"
              :path="locationHistory"
              :options="{
                strokeColor: '#2196F3',
                strokeWeight: 5,
                strokeOpacity: 0.8,
              }"
            />

            <!-- Selected Location Marker -->
            <GMapMarker
              v-if="selectedLocation && !hasLocation"
              :position="selectedLocation"
              :icon="{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: { width: 32, height: 32 },
              }"
            />
          </GMapMap>
        </div>

        <!-- Location History -->
        <v-expansion-panels v-if="hasLocation" class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-icon left>mdi-history</v-icon>
              Location History
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-timeline dense>
                <v-timeline-item
                  v-for="(loc, index) in locationHistory"
                  :key="index"
                  small
                  :color="index === 0 ? 'primary' : 'grey lighten-1'"
                >
                  <div class="py-2">
                    <div><strong>Lat:</strong> {{ loc.lat.toFixed(6) }}</div>
                    <div><strong>Lng:</strong> {{ loc.lng.toFixed(6) }}</div>
                    <div class="text-caption">{{ formatTimestamp(loc.timestamp) }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <!-- Snackbar -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import axios from 'axios'
import type { Vehicle, LocationPoint } from '@/types'

// Route params
const route = useRoute()
const vehicleId = computed(() => route.params.id as string)

// Vehicle and location state
const vehicle = ref<Vehicle | null>(null)
const locationHistory = ref<LocationPoint[]>([])
const hasLocation = ref(false)
const selectedLocation = ref<{ lat: number; lng: number } | null>(null)
const saving = ref(false)

// Map state
const mapRef = ref(null)
const mapCenter = ref({ lat: 37.7749, lng: -122.4194 }) // Default: San Francisco
const vehiclePosition = computed(() => {
  return locationHistory.value.length > 0 ? locationHistory.value[0] : null
})

// Car icon
const carIcon = {
  url: 'https://cdn-icons-png.flaticon.com/512/744/744465.png', // Car icon
  scaledSize: { width: 48, height: 48 },
  anchor: { x: 24, y: 24 },
}

// Notification state
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Format timestamp
const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return 'N/A'
  return format(new Date(timestamp), 'PPpp')
}

// Fetch vehicle and location data
const fetchVehicleData = async () => {
  try {
    const response = await axios.get(`/api/vehicles/${vehicleId.value}`)
    const { vehicle: vehicleData, locations } = response.data

    vehicle.value = {
      id: vehicleData.id,
      model: vehicleData.model,
      plate: vehicleData.plate,
      status: vehicleData.status,
      lastUpdated: vehicleData.lastUpdated,
    }

    locationHistory.value = locations
      .sort((a: LocationPoint, b: LocationPoint) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map((loc: LocationPoint) => ({
        lat: loc.lat,
        lng: loc.lng,
        timestamp: loc.timestamp,
      }))

    hasLocation.value = locations.length > 0
    if (locations.length > 0) {
      mapCenter.value = { lat: locations[0].lat, lng: locations[0].lng }
    } else {
      showNotification('No location found. Please select a location on the map.')
    }
  } catch (error) {
    showNotification('Failed to load vehicle data', 'error')
  }
}

// Handle place selection from autocomplete
const onPlaceChanged = (place: google.maps.places.PlaceResult) => {
  if (!place.geometry?.location) return
  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()
  selectedLocation.value = { lat, lng }
  mapCenter.value = { lat, lng }
}

// Handle map click for location selection
const onMapClick = (e: google.maps.MapMouseEvent) => {
  if (hasLocation.value) return
  if (e.latLng) {
    selectedLocation.value = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }
    mapCenter.value = selectedLocation.value
  }
}

// Save location to backend
const saveLocation = async () => {
  if (!selectedLocation.value || !vehicle.value) return

  saving.value = true
  try {
    const newLocation: LocationPoint = {
      lat: selectedLocation.value.lat,
      lng: selectedLocation.value.lng,
      timestamp: new Date().toISOString(),
    }

    await axios.post(`/api/vehicles/${vehicleId.value}/locations`, newLocation)
    locationHistory.value = [newLocation, ...locationHistory.value]
    hasLocation.value = true
    vehicle.value.lastUpdated = newLocation.timestamp
    selectedLocation.value = null

    showNotification('Location saved successfully')
  } catch (error) {
    showNotification('Failed to save location', 'error')
  } finally {
    saving.value = false
  }
}

// Show notification
const showNotification = (message: string, color: string = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// Initialize
onMounted(() => {
  fetchVehicleData()
})
</script>

<style scoped>
.tracking-container {
  background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%);
  padding: 24px;
  min-height: 100vh;
}

.map-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.map-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.search-bar {
  flex: 1;
}

.map-wrapper {
  width: 100%;
  height: 60vh;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.map-wrapper:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.info-window {
  padding: 8px;
  min-width: 200px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .map-controls {
    flex-direction: column;
    gap: 12px;
  }

  .map-wrapper {
    height: 50vh;
  }

  .tracking-container {
    padding: 16px;
  }
}
</style>
  