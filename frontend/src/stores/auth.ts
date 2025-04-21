// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { computed, ref } from 'vue'
import type { LoginResponse, RegisterResponse, User } from '../types/user'
import router from '../router'
import { customStorage } from '@/utils/customStorage'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

export const useAuthStore = defineStore('auth', () => {
  // State - no manual hydration needed anymore
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  // Set axios headers if token exists (will run after hydration)
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // Computed
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  async function login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`http://localhost:8000/api/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        token.value = response.data.token
        user.value = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
        }

                // Axios headers will be set automatically due to reactivity
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      }
      return response.data
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  async function register(username: string, email: string, password: string, role: string): Promise<RegisterResponse> {
    try {
      const response = await axios.post(`http://localhost:8000/api/auth/register`, {
        username,
        email,
        password,
        role,
      }, { 
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      throw new Error('Registration failed')
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }

  return { 
    user, 
    token, 
    isAuthenticated, 
    login, 
    register, 
    logout 
  }
}, {
  persist: {
    storage: customStorage,
    paths: ['user', 'token'],
    afterRestore: (ctx: any) => {
      console.log('Restored token:', ctx.store.token)
      console.log('Restored user:', ctx.store.user)
      if (ctx.store.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${ctx.store.token}`
      }
    }
  } as PersistenceOptions
})