<template>
    <div class="route-container">
      <v-card class="route-card" elevation="10" rounded="lg">
        <v-card-title class="primary white--text py-3">
          <v-icon left color="white">mdi-map-marker-path</v-icon>
          Plan Your Route
        </v-card-title>
  
        <v-card-text class="pa-6">
          <!-- Location Inputs -->
          <div class="location-form">
            <div class="input-group">
              <label class="input-label">Starting Location</label>
              <GMapAutocomplete
                @place_changed="onStartPlaceChanged"
                class="search-bar"
              >
                <template #default="{ attrs }">
                  <v-text-field
                    v-bind="attrs"
                    placeholder="Enter starting location"
                    prepend-inner-icon="mdi-map-marker"
                    outlined
                    dense
                    clearable
                    class="search-input"
                    :disabled="saving"
                  ></v-text-field>
                </template>
              </GMapAutocomplete>
            </div>
  
            <div class="input-group mt-4">
              <label class="input-label">Destination Location</label>
              <GMapAutocomplete
                @place_changed="onDestinationPlaceChanged"
                class="search-bar"
              >
                <template #default="{ attrs }">
                  <v-text-field
                    v-bind="attrs"
                    placeholder="Enter destination location"
                    prepend-inner-icon="mdi-map-marker-check"
                    outlined
                    dense
                    clearable
                    class="search-input"
                    :disabled="saving"
                  ></v-text-field>
                </template>
              </GMapAutocomplete>
            </div>
  
            <v-btn
              color="secondary"
              class="save-btn mt-6"
              :disabled="!startLocation || !destinationLocation || saving"
              :loading="saving"
              @click="saveLocations"
              elevation="4"
            >
              <v-icon left>mdi-content-save</v-icon>
              Save Route
            </v-btn>
          </div>
  
          <!-- Google Map -->
          <div class="map-wrapper mt-6">
            <GMapMap
              ref="mapRef"
              :center="mapCenter"
              :zoom="12"
              map-type-id="roadmap"
              style="width: 100%; height: 50vh"
              @click="onMapClick"
            >
              <!-- Starting Location Marker -->
              <GMapMarker
                v-if="startLocation"
                :position="startLocation"
                :icon="{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  scaledSize: { width: 40, height: 40 }
                }"
              >
                <GMapInfoWindow>
                  <div class="info-window">Starting Location</div>
                </GMapInfoWindow>
              </GMapMarker>
  
              <!-- Destination Location Marker -->
              <GMapMarker
                v-if="destinationLocation"
                :position="destinationLocation"
                :icon="{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: { width: 40, height: 40 }
                }"
              >
                <GMapInfoWindow>
                  <div class="info-window">Destination Location</div>
                </GMapInfoWindow>
              </GMapMarker>
  
              <!-- Path Between Start and Destination -->
              <GMapPolyline
                v-if="startLocation && destinationLocation"
                :path="[startLocation, destinationLocation]"
                :options="{
                  strokeColor: '#FF5722',
                  strokeWeight: 6,
                  strokeOpacity: 0.8
                }"
              />
            </GMapMap>
          </div>
        </v-card-text>
      </v-card>
  
      <!-- Snackbar -->
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        timeout="4000"
        rounded="pill"
        top
        elevation="6"
      >
        {{ snackbarMessage }}
        <template v-slot:actions>
          <v-btn text @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import { customStorage } from '@/utils/customStorage'
  
  // Location state
  const startLocation = ref<{ lat: number; lng: number } | null>(null)
  const destinationLocation = ref<{ lat: number; lng: number } | null>(null)
  const startPlaceName = ref<string>('')
  const destinationPlaceName = ref<string>('')
  const saving = ref(false)
  
  // Map state
  const mapRef = ref(null)
  const mapCenter = ref({ lat: 23.04315296146998, lng: 72.54975871427914 }) // Default: Ahmedabad
  
  // Notification state
  const snackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('success')
  
  // Auth
  const storedUser = customStorage.getItem('auth')
  const user = storedUser ? JSON.parse(storedUser) : null
  
  // Vehicle ID
  const route = useRoute()
  const vehicleId = ref(route.params.vehicleId as string || 'sample-vehicle-id')
  
  // Handle place selection for start location
  const onStartPlaceChanged = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return
    startLocation.value = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }
    startPlaceName.value = place.formatted_address
    console.log("Start: ", startPlaceName.value);
    updateMapCenter()
  }
  
  // Handle place selection for destination location
  const onDestinationPlaceChanged = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return
    destinationLocation.value = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }
    destinationPlaceName.value = place.formatted_address
    console.log("Destination: ", destinationPlaceName.value);
    updateMapCenter()
  }
  
  // Update map center based on selected locations
  const updateMapCenter = () => {
    if (startLocation.value && destinationLocation.value) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(startLocation.value)
      bounds.extend(destinationLocation.value)
      mapRef.value?.fitBounds(bounds, { padding: 50 })
    } else if (startLocation.value) {
      mapCenter.value = startLocation.value
    } else if (destinationLocation.value) {
      mapCenter.value = destinationLocation.value
    }
  }
  
  // Handle map click for location selection
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      if (!startLocation.value) {
        startLocation.value = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        }
        startPlaceName.value = `Lat: ${e.latLng.lat().toFixed(6)}, Lng: ${e.latLng.lng().toFixed(6)}`
      } else if (!destinationLocation.value) {
        destinationLocation.value = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        }
        destinationPlaceName.value = `Lat: ${e.latLng.lat().toFixed(6)}, Lng: ${e.latLng.lng().toFixed(6)}`
      }
      updateMapCenter()
    }
  }
  
  // Save both locations to backend
  const saveLocations = async () => {
    if (!startLocation.value || !destinationLocation.value) return
  
    saving.value = true
    try {
      const routeData = {
        vehicleId: vehicleId.value,
        startingPlaceName: startPlaceName.value,
        destinationPlaceName: destinationPlaceName.value,
        startingLocation: {
          latitude: startLocation.value.lat,
          longitude: startLocation.value.lng,
        },
        destinationLocation: {
          latitude: destinationLocation.value.lat,
          longitude: destinationLocation.value.lng,
        },
      }
      const response = await axios.post(
        `http://localhost:8000/api/routes/save`,
        routeData,
        {
          headers: {
            Authorization: `Bearer ${user?.token || ''}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      if (response.data.success) {
        snackbarMessage.value = response.data.message || 'Route saved successfully!'
        snackbarColor.value = 'success'
        snackbar.value = true
        // Reset locations after saving
        startLocation.value = null
        destinationLocation.value = null
        startPlaceName.value = ""
        destinationPlaceName.value = ""
        mapCenter.value = { lat: 23.04315296146998, lng: 72.54975871427914 }
      } else {
        throw new Error(response.data.message || 'Failed to save route')
      }
    } catch (error: any) {
      snackbarMessage.value = error.message || 'Failed to save route. Please try again.'
      snackbarColor.value = 'error'
      snackbar.value = true
    } finally {
      saving.value = false
    }
  }
  </script>
  
  <style scoped>
  .route-container {
    background: linear-gradient(135deg, #f0f4f8 0%, #e6e9ef 100%);
    padding: 32px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  
  .route-card {
    max-width: 800px;
    width: 100%;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .route-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
  
  .primary {
    background: linear-gradient(90deg, #1976D2, #2196F3);
  }
  
  .location-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .input-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .search-input {
    transition: border-color 0.3s ease;
  }
  
  .search-input:hover {
    border-color: #1976D2;
  }
  
  .map-wrapper {
    width: 100%;
    height: 50vh;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  .map-wrapper:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  .save-btn {
    align-self: flex-start;
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
    background: linear-gradient(90deg, #FF9800, #FFB300);
    transition: transform 0.2s ease, background 0.3s ease;
  }
  
  .save-btn:hover {
    transform: scale(1.05);
    background: linear-gradient(90deg, #FFB300, #FFCA28);
  }
  
  .info-window {
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #1F2937;
  }
  
  @media (max-width: 600px) {
    .route-container {
      padding: 16px;
    }
  
    .route-card {
      max-width: 100%;
    }
  
    .map-wrapper {
      height: 40vh;
    }
  
    .save-btn {
      width: 100%;
      padding: 10px;
    }
  }
  </style>