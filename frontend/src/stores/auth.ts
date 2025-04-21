// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { computed, ref } from 'vue'
import type { RegisterResponse, User } from '../types/user'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

//   async function login(email: string, password: string) {
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
//         email,
//         password,
//       })
//       user.value = response.data.user
//       token.value = response.data.token
     
//       router.push(user.value.role === 'admin' ? '/admin/dashboard' : user.value.role === 'driver' ? '/driver/dashboard' : '/manager/dashboard')
//     } catch (error) {
//       throw new Error('Login failed')
//     }
//   }

  async function register(username: string, email: string, password: string, role: string): Promise<RegisterResponse> {
    try {
      const response = await axios.post(`http://localhost:8000/api/auth/register`, {
        username,
        email,
        password,
        role,
      }, { withCredentials: true, headers: {
        'Content-Type': 'application/json'
      }} );
      console.log("Response: ", response);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed')
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.remove('token')
    router.push('/login')
  }

  function init() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      // Fetch user data if needed
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((response) => {
          user.value = response.data
        })
        .catch(() => {
          logout()
        })
    }
  }

  return { user, token, isAuthenticated, register, logout, init }
})