<template>
  <div class="map-container">
    <v-card class="map-card" elevation="10" rounded="lg">
      <v-card-title class="primary white--text py-3">
        <v-icon left color="white">mdi-map-marker-path</v-icon>
        Route Tracking
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Route Info -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <div class="route-info">
              <strong>Starting Place:</strong> {{ selectedRoute?.startingPlaceName || 'N/A' }}<br />
              <strong>Destination Place:</strong> {{ selectedRoute?.destinationPlaceName || 'N/A' }}
            </div>
          </v-col>
        </v-row>

        <!-- Google Map -->
        <div v-if="isGoogleMapsLoaded && selectedRoute && selectedRoute.coordinates?.length" class="map-wrapper">
          <GMapMap
            ref="mapRef"
            :center="mapCenter"
            :zoom="12"
            map-type-id="roadmap"
            style="width: 100%; height: 50vh"
          >
            <!-- Original Route Polyline (Orange, Solid) -->
            <GMapPolyline
              :path="selectedRoute.coordinates"
              :options="{
                strokeColor: '#FF5722', // Orange for original route
                strokeWeight: 6,
                strokeOpacity: 0.8,
              }"
            />

            <!-- Visited Path Polyline (Green, Dashed) -->
            <GMapPolyline
              :path="visitedPath"
              :options="{
                strokeColor: '#4CAF50', // Green for visited path
                strokeWeight: 6,
                strokeOpacity: 0.8,
                icons: [{
                  icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 4,
                  },
                  offset: '0',
                  repeat: '20px',
                }],
              }"
            />

            <!-- Start Marker -->
            <GMapMarker
              :position="selectedRoute.coordinates[0]"
              :icon="{
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: { width: 40, height: 40 },
              }"
            >
              <GMapInfoWindow>
                <div class="info-window">Start: {{ selectedRoute.startingPlaceName }}</div>
              </GMapInfoWindow>
            </GMapMarker>

            <!-- Destination Marker -->
            <GMapMarker
              :position="selectedRoute.coordinates[selectedRoute.coordinates.length - 1]"
              :icon="{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: { width: 40, height: 40 },
              }"
            >
              <GMapInfoWindow>
                <div class="info-window">Destination: {{ selectedRoute.destinationPlaceName }}</div>
              </GMapInfoWindow>
            </GMapMarker>

            <!-- Vehicle Marker -->
            <GMapMarker
              v-if="currentPosition"
              :position="currentPosition"
              :icon="{
                url: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
                scaledSize: { width: 48, height: 48 },
                anchor: { x: 24, y: 24 },
              }"
            >
              <GMapInfoWindow>
                <div class="info-window">Current Position</div>
              </GMapInfoWindow>
            </GMapMarker>
          </GMapMap>
        </div>
        <div v-else class="map-wrapper text-center">
          <v-progress-circular indeterminate color="primary" />
          <p class="mt-2">
            {{ !selectedRoute ? 'No route selected' : !selectedRoute.coordinates?.length ? 'Invalid route data' : 'Loading map...' }}
          </p>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { customStorage } from '@/utils/customStorage';
import { RoutesResponse, Routes, LocationPoint } from '@/types/vehicleRoutes';
import axios from 'axios';

// State
const mapRef = ref<{ map: google.maps.Map } | null>(null);
const mapCenter = ref({ lat: 23.04445, lng: 72.54874 });
const isGoogleMapsLoaded = ref(false);
const currentPosition = ref<{ lat: number; lng: number } | null>(null);
const locationHistory = ref<{ lat: number; lng: number }[]>([]);
let pollingInterval: NodeJS.Timeout | null = null;
let ws: WebSocket | null = null;

// Notification state
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

// WebSocket URL
const wsUrl = `ws://localhost:8000/ws`;

// Route data
const route = useRoute();
const vehicleId = ref(route.params.vehicleId as string);
const routesId = ref(route.params.routesId as string);
const selectedRoute = ref<any>(null);

// Computed property for visited path (from location history)
const visitedPath = computed(() => {
  return locationHistory.value;
});

// Fetch routes
const fetchRoutes = async () => {
  try {
    const response = await axios.get<RoutesResponse>(`http://localhost:8000/api/routes/${routesId.value}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data.success && response.data.routes?.coordinates?.length) {
      selectedRoute.value = {
        ...response.data.routes,
        coordinates: response.data.routes.coordinates.map(coord => ({
          lat: coord.latitude,
          lng: coord.longitude,
        })),
      };
      snackbarMessage.value = response.data.message;
      snackbarColor.value = 'success';
      snackbar.value = true;
    } else {
      showNotification('No valid route data found.', 'error');
    }
  } catch (error: any) {
    console.error('Fetch routes error:', error);
    showNotification(error.response?.data?.message || error.message, 'error');
  }
};

// Fetch location history
const fetchLocationHistory = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/locations/history/${vehicleId.value}/routes/${routesId.value}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data.success && response.data.locationHistory?.length) {
      locationHistory.value = response.data.locationHistory.map((coord: any) => ({
        lat: coord.latitude,
        lng: coord.longitude,
      }));
      // Update current position to the latest coordinate
      if (locationHistory.value.length > 0) {
        currentPosition.value = locationHistory.value[locationHistory.value.length - 1];
        mapCenter.value = currentPosition.value;
      }
      // Check if the route is completed (based on proximity to destination)
      if (locationHistory.value.length > 0 && selectedRoute.value?.coordinates?.length) {
        const lastCoord = locationHistory.value[locationHistory.value.length - 1];
        const destination = selectedRoute.value.coordinates[selectedRoute.value.coordinates.length - 1];
        const distance = getDistance(lastCoord, destination);
        if (distance < 0.0001) { // Roughly 10 meters threshold
          showNotification('Route completed!', 'success');
        }
      }
    } else {
      showNotification('No location history found.', 'warning');
    }
  } catch (error: any) {
    console.error('Fetch location history error:', error);
    showNotification(error.response?.data?.message || error.message, 'error');
  }
};

// Calculate distance between two coordinates (in degrees, approximate)
const getDistance = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }) => {
  const latDiff = coord1.lat - coord2.lat;
  const lngDiff = coord1.lng - coord2.lng;
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
};

// Initialize map
const initializeMap = () => {
  if (!mapRef.value || !selectedRoute.value || !selectedRoute.value.coordinates.length) {
    console.error('Map initialization failed: Missing mapRef or route data');
    showNotification('Cannot initialize map: Missing route data.', 'error');
    return;
  }

  currentPosition.value = selectedRoute.value.coordinates[0];
  mapCenter.value = selectedRoute.value.coordinates[0];

  const bounds = new window.google.maps.LatLngBounds();
  selectedRoute.value.coordinates.forEach((coord: any) => {
    bounds.extend(coord);
  });
  mapRef?.value?.map.fitBounds(bounds);
};

// Auth
const storedUser = customStorage.getItem('auth');
const user = storedUser ? JSON.parse(storedUser) : null;

// Setup WebSocket
const setupWebSocket = () => {
  if (!user?.token) {
    showNotification('Please log in to continue.', 'error');
    return;
  }

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'positionAck') {
        showNotification('Position update saved.', 'success');
      } else if (data.type === 'inactivityAlert') {
        handleAlert(data);
      }
    } catch (error) {
      showNotification('Error processing WebSocket message.', 'error');
    }
  };

  ws.onerror = () => {
    showNotification('WebSocket connection error.', 'error');
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    setTimeout(setupWebSocket, 5000);
  };
};

// Handle alerts
const handleAlert = (data: any) => {
  let color = 'info';
  if (data.type === 'routeDeviation') {
    color = 'error';
  } else if (data.type === 'inactivityAlert') {
    color = 'warning';
  } else if (data.type === 'maintenance') {
    color = 'info';
  }
  showNotification(data.message, color);
};

// Show notification
const showNotification = (message: string, color: string = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

// Lifecycle hooks
onMounted(() => {
  setupWebSocket();
  fetchRoutes();

  const checkGoogleMaps = setInterval(() => {
    if (window.google && window.google.maps) {
      isGoogleMapsLoaded.value = true;
      clearInterval(checkGoogleMaps);
      if (selectedRoute.value && selectedRoute.value.coordinates.length) {
        initializeMap();
      }
    }
  }, 100);

  // Start polling location history every 3 seconds
  fetchLocationHistory(); // Initial fetch
  pollingInterval = setInterval(fetchLocationHistory, 3000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
});

// Watch for route changes
watch(selectedRoute, (newRoute) => {
  if (newRoute && newRoute.coordinates.length && isGoogleMapsLoaded.value) {
    initializeMap();
  } else if (newRoute && !newRoute.coordinates.length) {
    showNotification('Invalid or missing route data.', 'error');
  }
});
</script>

<style scoped>
.map-container {
  background: linear-gradient(135deg, #f0f4f8 0%, #e6e9ef 100%);
  padding: 32px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.map-card {
  max-width: 800px;
  width: 100%;
  min-height: 400px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.map-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.primary {
  background: linear-gradient(90deg, #1976D2, #2196F3);
}

.map-wrapper {
  width: 100%;
  height: 50vh;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  isolation: isolate;
  transition: box-shadow 0.3s ease;
}

.map-wrapper:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.route-info {
  font-size: 14px;
  color: #374151;
}

.info-window {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
}

@media (max-width: 600px) {
  .map-container {
    padding: 16px;
  }

  .map-card {
    max-width: 100%;
  }

  .map-wrapper {
    height: 40vh;
    min-height: 300px;
  }
}
</style>
