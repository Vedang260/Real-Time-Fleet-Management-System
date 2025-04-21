<template>
    <div>
      <!-- Search Bar -->
      <GMapAutocomplete @place_changed="onPlaceChanged">
        <input
          type="text"
          placeholder="Search a place"
          style="width: 100%; padding: 10px; font-size: 16px; margin-bottom: 10px;"
        />
      </GMapAutocomplete>
  
      <!-- Google Map -->
      <GMapMap
        ref="mapRef"
        :center="center"
        :zoom="14"
        style="width: 100%; height: 600px"
      >
        <!-- Destination Marker -->
        <GMapMarker :position="markerPosition" />
  
        <!-- Car Marker -->
        <GMapMarker
          :position="carPosition"
          :icon="{
            url: '/images/car-icon.png',
            scaledSize: { width: 40, height: 40 }
          }"
        />
  
        <!-- Route Polyline -->
        <GMapPolyline
          v-if="routePolyline.length"
          :path="routePolyline"
          :options="{ strokeColor: '#FF0000', strokeWeight: 4 }"
        />
      </GMapMap>
  
      <!-- Coordinates -->
      <div style="margin-top: 10px;">
        <strong>Destination Lat:</strong> {{ markerPosition.lat }}<br />
        <strong>Destination Lng:</strong> {{ markerPosition.lng }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MapView',
    data() {
      return {
        center: { lat: 37.7749, lng: -122.4194 }, // Map center
        origin: { lat: 37.7749, lng: -122.4194 }, // Fixed start point
        markerPosition: { lat: 37.7749, lng: -122.4194 }, // Destination marker
        carPosition: { lat: 37.7749, lng: -122.4194 }, // Car position
        routePolyline: [],
        stepIndex: 0,
        interval: null,
      }
    },
    methods: {
      onPlaceChanged(place) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        this.markerPosition = { lat, lng }
        this.center = { lat, lng }
  
        this.getRouteAndAnimate()
      },
  
      getRouteAndAnimate() {
        const directionsService = new google.maps.DirectionsService()
  
        const request = {
          origin: this.origin,
          destination: this.markerPosition,
          travelMode: google.maps.TravelMode.DRIVING,
        }
  
        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const route = result.routes[0].overview_path.map((coord) => ({
              lat: coord.lat(),
              lng: coord.lng(),
            }))
  
            this.routePolyline = route
            this.animateCar(route)
          } else {
            console.error('Failed to get route:', status)
          }
        })
      },
  
      animateCar(route) {
        this.stepIndex = 0
        clearInterval(this.interval)
  
        this.interval = setInterval(() => {
          if (this.stepIndex < route.length) {
            this.carPosition = route[this.stepIndex]
            this.stepIndex++
          } else {
            clearInterval(this.interval)
          }
        }, 300) // speed: smaller = faster
      },
    },
    beforeUnmount() {
      clearInterval(this.interval)
    },
  }
  </script>
  
  
  