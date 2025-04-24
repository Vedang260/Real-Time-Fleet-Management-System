<template>
  <div class="map-container">
    <v-card class="map-card" elevation="10" rounded="lg">
      <v-card-title class="primary white--text py-3">
        <v-icon left color="white">mdi-map-marker-path</v-icon>
        Route Map
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
          <v-col cols="12" sm="6" class="text-right">
            <v-btn
              color="secondary"
              :disabled="isMoving || !isGoogleMapsLoaded || !selectedRoute || !selectedRoute.coordinates?.length"
              :loading="isMoving && !isPaused"
              @click="startMovement"
              elevation="4"
            >
              <v-icon left>mdi-play</v-icon>
              Start
            </v-btn>
            <v-btn
              v-if="isMoving"
              :color="isPaused ? 'warning' : 'error'"
              class="ml-2"
              @click="togglePause"
              elevation="4"
            >
              <v-icon left>{{ isPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
              {{ isPaused ? 'Resume' : 'Pause' }}
            </v-btn>
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
            <!-- Visited Path Polyline (Green) -->
            <GMapPolyline
              :path="visitedPath"
              :options="{
                strokeColor: '#4CAF50', // Green for visited path
                strokeWeight: 6,
                strokeOpacity: 0.8,
              }"
            />

            <!-- Remaining Path Polyline (Orange) -->
            <GMapPolyline
              :path="remainingPath"
              :options="{
                strokeColor: '#FF5722', // Orange for remaining path
                strokeWeight: 6,
                strokeOpacity: 0.8,
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
const isMoving = ref(false);
const isPaused = ref(false);
const currentStep = ref(0);
let movementInterval: NodeJS.Timeout | null = null;
let ws: WebSocket | null = null;

// Notification state
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

// Route data
const route = useRoute();
const vehicleId = ref(route.params.vehicleId as string);
const routesId = ref(route.params.routesId as string);
const selectedRoute = ref<any>(null);

// Computed properties for visited and remaining paths
const visitedPath = computed(() => {
  if (!selectedRoute.value || !selectedRoute.value.coordinates) return [];
  return selectedRoute.value.coordinates.slice(0, currentStep.value + 1);
});

const remainingPath = computed(() => {
  if (!selectedRoute.value || !selectedRoute.value.coordinates) return [];
  return selectedRoute.value.coordinates.slice(currentStep.value);
});

// WebSocket URL
const wsUrl = `ws://localhost:8000/ws`;

// Auth
const storedUser = customStorage.getItem('auth');
const user = storedUser ? JSON.parse(storedUser) : null;

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

// Start movement simulation (only for fresh start)
const startMovement = () => {
  if (isMoving.value) {
    showNotification('Simulation already running.', 'warning');
    return;
  }
  if (!selectedRoute.value || !selectedRoute.value.coordinates.length || !ws || ws.readyState !== WebSocket.OPEN) {
    showNotification('Cannot start simulation. Check connection or route data.', 'error');
    return;
  }

  // Initialize fresh start
  isMoving.value = true;
  isPaused.value = false;
  currentStep.value = 0;
  currentPosition.value = selectedRoute.value.coordinates[0];
  mapCenter.value = selectedRoute.value.coordinates[0];

  // Clear any existing interval
  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }

  movementInterval = setInterval(() => {
    console.log(`Current Step: ${currentStep.value}, Position:`, currentPosition.value);

    if (currentStep.value < selectedRoute.value.coordinates.length - 1) {
      currentStep.value++;
      currentPosition.value = selectedRoute.value.coordinates[currentStep.value];

      if (currentPosition.value) {
        mapCenter.value = currentPosition.value;

        ws?.send(
          JSON.stringify({
            type: 'positionUpdate',
            payload: {
              vehicleId: vehicleId.value,
              routesId: routesId.value,
              latitude: currentPosition.value.lat,
              longitude: currentPosition.value.lng,
              stepIndex: currentStep.value,
            },
          })
        );
      }
    } else {
      stopMovement();
      showNotification('Route completed!', 'success');
    }
  }, 3000);
};

// Toggle pause/resume
const togglePause = () => {
  if (!isMoving.value) {
    showNotification('Simulation not running.', 'warning');
    return;
  }

  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    // Pause the movement
    if (movementInterval) {
      clearInterval(movementInterval);
      movementInterval = null;
    }
    console.log(`Paused at step: ${currentStep.value}, Position:`, currentPosition.value);
    showNotification('Simulation paused.', 'warning');
  } else {
    // Resume the movement
    console.log(`Resuming from step: ${currentStep.value}, Position:`, currentPosition.value);
    isMoving.value = true;
    isPaused.value = false;
    
    // Clear any existing interval (just in case)
    if (movementInterval) {
      clearInterval(movementInterval);
      movementInterval = null;
    }
    
    // Start a new interval from the current position
    movementInterval = setInterval(() => {
      console.log(`Current Step: ${currentStep.value}, Position:`, currentPosition.value);

      if (currentStep.value < selectedRoute.value.coordinates.length - 1) {
        currentStep.value++;
        currentPosition.value = selectedRoute.value.coordinates[currentStep.value];

        if (currentPosition.value) {
          mapCenter.value = currentPosition.value;

          ws?.send(
            JSON.stringify({
              type: 'savePosition',
              payload: {
                vehicleId: vehicleId.value,
                routesId: routesId.value,
                latitude: currentPosition.value.lat,
                longitude: currentPosition.value.lng,
                stepIndex: currentStep.value,
              },
            })
          );
        }
      } else {
        stopMovement();
        showNotification('Route completed!', 'success');
      }
    }, 3000);
    
    showNotification('Simulation resumed.', 'success');
  }
};

// Stop movement simulation (complete stop)
const stopMovement = () => {
  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }
  isMoving.value = false;
  isPaused.value = false;
  currentStep.value = 0;
  currentPosition.value = selectedRoute.value?.coordinates[0] || null;
};

// Show notification
const showNotification = (message: string, color: string = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

// Lifecycle hooks
onMounted(() => {
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

  setupWebSocket();
});

onUnmounted(() => {
  stopMovement();
  if (ws) {
    ws.close();
    ws = null;
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