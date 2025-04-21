<template>
  <v-app-bar app color="indigo" dark class="navbar">
    <v-toolbar-title>
      <span class="font-weight-bold gradient-text">FleetPro</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu
      v-if="user"
      v-model="menuVisible"
      :close-on-content-click="true"
      offset-y
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ props }">
        <v-btn 
          text 
          v-bind="props" 
          class="d-flex align-center"
          aria-haspopup="true"
        >
          <v-avatar size="36">
            <v-img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Avatar"></v-img>
          </v-avatar>
          <span class="ml-2">{{ user?.user?.username || 'User' }}</span>
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item>
          <v-list-item-title class="text-subtitle-2">
            {{ user?.user?.email }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user?.user?.role || 'USER' }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="authStore.logout">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-danger">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { customStorage } from '@/utils/customStorage';
import { ref } from 'vue';
import type { User } from '@/types/user';
import { useAuthStore } from '@/stores/auth';

const storedUser = customStorage.getItem('auth');
const user = (storedUser ? JSON.parse(storedUser) : null)
const menuVisible = ref(false);
const authStore = useAuthStore();

console.log("user:  ", user);

</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #2196F3 0%, #4CAF50 100%) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.gradient-text {
  background: linear-gradient(90deg, #f0f1f3 0%, #ebeeeb 100%);
  font-size: xx-large;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.v-btn {
  color: white !important;
  text-transform: none;
}

.v-avatar {
  background-color: white !important;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Menu list styling */
.v-list {
  background-color: white !important;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.v-list-item {
  min-width: 200px;
}

.v-list-item:hover {
  background-color: #f5f5f5 !important;
}

.text-danger {
  color: #f44336 !important;
}

/* Ensure menu appears above other content */
.v-menu__content {
  z-index: 200 !important;
}
</style>