<!-- MapView.vue -->
<template>
    <GMapMap
      :center="{ lat: 37.7749, lng: -122.4194 }"
      :zoom="12"
      style="width: 100%; height: 400px"
    >
      <GMapMarker
        :position="{ lat: 37.7749, lng: -122.4194 }"
        :clickable="true"
        :draggable="true"
      />
    </GMapMap>
  </template>
  
  <script>
  export default {
    name: 'MapView',
  }
  </script>
  