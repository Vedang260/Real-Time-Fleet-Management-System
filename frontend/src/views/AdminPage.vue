<template>
    <Navbar />
    <!-- Add your button with navigation here -->
    <button 
      @click="navigateToPage"
      class="navigation-button"
    >
      Go to Other Page
    </button>
  </template>
  
  <script setup>
  import Navbar from '@/components/Navbar.vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const navigateToPage = () => {
    router.push('/map');
  };
  </script>
  
  <style scoped>
  .navigation-button {
    padding: 10px 20px;
    background-color: #4CAF50; /* Green background */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin: 20px;
    transition: background-color 0.3s;
  }
  
  .navigation-button:hover {
    background-color: #45a049; /* Darker green on hover */
  }
  </style>