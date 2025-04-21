<template>
    <v-app-bar app color="indigo" dark class="navbar">
      <v-toolbar-title>
        <span class="font-weight-bold gradient-text">FleetPro</span>
      </v-toolbar-title>
  
      <v-spacer></v-spacer>
  
      <v-menu
        v-if="userLoggedIn"
        v-model="menuVisible"
        :close-on-content-click="false"
        offset-y
        transition="slide-y-reverse-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on" class="d-flex align-center">
            <v-avatar size="36">
              <v-img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Avatar"></v-img>
            </v-avatar>
            <span class="ml-2">{{ userName }}</span>
          </v-btn>
        </template>
  
        <v-list>
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ userRole }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
  
            <v-list-item @click="logout">
              <v-list-item-content>
                <v-list-item-title class="text-danger">Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const userLoggedIn = ref(true);  // Simulate logged-in user state
  const menuVisible = ref(false);
  const userName = ref('John Doe');
  const userRole = ref('ADMIN');
  
  // Simulate logout functionality
  function logout() {
    console.log('Logging out...');
    // Implement the actual logout logic here, e.g., clearing auth tokens, redirecting to login page, etc.
  }
  </script>
  
  <style scoped>
  .navbar {
    background: linear-gradient(135deg, #2196F3 0%, #4CAF50 100%) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  .v-btn {
    color: white !important;
  }
  
  .v-avatar {
    background-color: white !important;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .v-list-item {
    transition: all 0.3s ease;
  }
  
  .v-list-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .text-danger {
    color: #f44336 !important;
  }
  
  .v-spacer {
    flex-grow: 1;
  }
  
  @media (max-width: 600px) {
    .v-toolbar-title {
      font-size: 1.2rem;
    }
  
    .v-btn {
      font-size: 0.875rem;
    }
  }
  </style>
  