<template>
  <div class="tracking-container">
    <v-card class="map-card" elevation="8" rounded="xl">
      <v-toolbar color="primary" dark flat>
        <v-icon large left>mdi-map-marker-path</v-icon>
        <v-toolbar-title class="font-weight-bold">Vehicle Tracking</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
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
            <!-- Historical Markers -->
            <GMapMarker
              v-for="(loc, index) in locationHistory"
              :key="loc.locationId"
              :position="{ lat: loc.latitude, lng: loc.longitude }"
              :icon="getMarkerIcon(index)"
            >
              <GMapInfoWindow>
                <div class="info-window">
                  Recorded: {{ formatTimestamp(loc.recordedAt) }}
                </div>
              </GMapInfoWindow>
            </GMapMarker>

            <!-- Car Marker (Latest Position) -->
            <GMapMarker
              v-if="vehiclePosition"
              :position="vehiclePosition"
              :icon="carIcon"
            >
              <GMapInfoWindow>
                <div class="info-window">
                  Latest: {{ formatTimestamp(vehiclePosition.recordedAt) }}
                </div>
              </GMapInfoWindow>
            </GMapMarker>

            <!-- Location History Path -->
            <GMapPolyline
              v-if="locationHistory.length > 1"
              :path="locationHistory.map(loc => ({ lat: loc.latitude, lng: loc.longitude }))"
              :options="{
                strokeColor: '#2196F3',
                strokeWeight: 5,
                strokeOpacity: 0.8
              }"
            />

            <!-- Selected Location Marker -->
            <GMapMarker
              v-if="selectedLocation && !hasLocation"
              :position="selectedLocation"
              :icon="{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: { width: 32, height: 32 }
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
                  :key="loc.locationId"
                  small
                  :color="index === 0 ? 'primary' : 'grey lighten-1'"
                >
                  <div class="py-2">
                    <div><strong>Lat:</strong> {{ loc.latitude.toFixed(6) }}</div>
                    <div><strong>Lng:</strong> {{ loc.longitude.toFixed(6) }}</div>
                    <div class="text-caption">{{ formatTimestamp(loc.recordedAt) }}</div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import axios from 'axios'
import type { LocationHistory, LocationHistoryResponse } from '@/types/location'
import { customStorage } from '@/utils/customStorage'

// Route params
const route = useRoute()
const vehicleId = computed(() => route.params.vehicleId as string)

// Location state
const locationHistory = ref<LocationHistory[]>([])
const hasLocation = ref(false)
const selectedLocation = ref<{ lat: number; lng: number } | null>(null)
const saving = ref(false)

// Map state
const mapRef = ref(null)
const mapCenter = ref({ lat: 23.04315296146998, lng: 72.54975871427914 }) // Default: Ahmedabad
const vehiclePosition = computed(() => {
  return locationHistory.value.length > 0 ? {
    lat: locationHistory.value[0].latitude,
    lng: locationHistory.value[0].longitude,
    recordedAt: locationHistory.value[0].recordedAt
  } : null
})

// Car icon
const carIcon = {
  url: 'https://cdn-icons-png.flaticon.com/512/744/744465.png', // Car icon
  scaledSize: { width: 48, height: 48 },
  anchor: { x: 24, y: 24 }
}

// Marker icons for history
const getMarkerIcon = (index: number) => ({
  url: index === 0 ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/grey-dot.png',
  scaledSize: { width: 24, height: 24 }
})

// Notification state
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('error');

// Auth
const storedUser = customStorage.getItem('auth');
const user = (storedUser ? JSON.parse(storedUser) : null);

// WebSocket
let ws: WebSocket | null = null

// Format timestamp
const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return 'N/A'
  return format(new Date(timestamp), 'PPpp')
}

// Fetch location history
const fetchLocationHistory = async () => {
  try {
    const response = await axios.get<LocationHistoryResponse>(`http://localhost:8000/api/locations/history/${vehicleId.value}`, {
      withCredentials: true, 
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
    });
    if (response.data.success) {

      locationHistory.value = response.data.locationHistory
        .sort((a: LocationHistory, b: LocationHistory) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
      hasLocation.value = locationHistory.value.length > 0
      if (hasLocation.value) {
        mapCenter.value = {
          lat: locationHistory.value[0].latitude,
          lng: locationHistory.value[0].longitude
        }
      } else {
        showNotification('No locations found. Please select a location on the map.')
      }
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    showNotification('Failed to load location history', 'error')
  }
}

// Setup WebSocket
const setupWebSocket = () => {
  ws = new WebSocket(`ws://your-backend/locations/${vehicleId.value}`)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
  }

  ws.onmessage = (event) => {
    try {
      const newLocation: LocationHistory = JSON.parse(event.data)
      if (newLocation.vehicleId === vehicleId.value) {
        locationHistory.value = [newLocation, ...locationHistory.value]
          .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
        mapCenter.value = {
          lat: newLocation.latitude,
          lng: newLocation.longitude
        }
        showNotification('New location received')
      }
    } catch (error) {
      showNotification('Error processing WebSocket message', 'error')
    }
  }

  ws.onerror = () => {
    showNotification('WebSocket connection error', 'error')
  }

  ws.onclose = () => {
    console.log('WebSocket disconnected')
    // Attempt to reconnect after 5 seconds
    setTimeout(setupWebSocket, 5000)
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
      lng: e.latLng.lng()
    }
    mapCenter.value = selectedLocation.value
  }
}

// Save location to backend
const saveLocation = async () => {
  if (!selectedLocation.value) return

  saving.value = true
  try {
    const newLocation = {
      vehicleId: vehicleId.value,
      latitude: selectedLocation.value.lat,
      longitude: selectedLocation.value.lng
    }
    const response = await axios.post(`/api/locations/${vehicleId.value}`, newLocation)
    if (response.data.success) {
        snackbarMessage.value = response.data.message;
        snackbarColor.value = 'success';
        snackbar.value = true;
      const savedLocation: LocationHistory = {
        locationId: response.data.locationId || crypto.randomUUID(),
        vehicleId: vehicleId.value,
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        recordedAt: new Date().toISOString()
      }
      locationHistory.value = [savedLocation, ...locationHistory.value]
      hasLocation.value = true
      selectedLocation.value = null
      mapCenter.value = { lat: savedLocation.latitude, lng: savedLocation.longitude }
      showNotification('Location saved successfully')
    } else {
      throw new Error(response.data.message)
    }
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

// Initialize and cleanup
onMounted(() => {
  fetchLocationHistory()
  setupWebSocket()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
    ws = null
  }
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
  min-width: 150px;
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