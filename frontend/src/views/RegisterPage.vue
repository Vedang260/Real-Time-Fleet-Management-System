<!-- src/views/RegisterPage.vue -->
<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="headline">Register</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="submit">
                <v-text-field
                  label="Name"
                  v-model="form.name"
                  :error-messages="nameErrors"
                  required
                ></v-text-field>
                <v-text-field
                  label="Email"
                  v-model="form.email"
                  :error-messages="emailErrors"
                  required
                ></v-text-field>
                <v-text-field
                  label="Password"
                  v-model="form.password"
                  type="password"
                  :error-messages="passwordErrors"
                  required
                ></v-text-field>
                <v-select
                  label="Role"
                  v-model="form.role"
                  :items="['admin', 'manager', 'driver']"
                  :error-messages="roleErrors"
                  required
                ></v-select>
                <v-btn type="submit" color="primary" block :loading="loading">Register</v-btn>
              </v-form>
              <p class="mt-4 text-center">
                Already have an account? <router-link to="/login">Login</router-link>
              </p>
            </v-card-text>
          </v-card>
          <v-snackbar v-model="snackbar" color="error">{{ error }}</v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useVuelidate } from '@vuelidate/core'
  import { required, email } from '@vuelidate/validators'
  
  const authStore = useAuthStore()
  const form = ref({ name: '', email: '', password: '', role: '' })
  const loading = ref(false)
  const snackbar = ref(false)
  const error = ref('')
  
  const rules = {
    name: { required },
    email: { required, email },
    password: { required },
    role: { required },
  }
  
  const v$ = useVuelidate(rules, form)
  
  const nameErrors = computed(() => {
    if (v$.value.name.$dirty && v$.value.name.$invalid) {
      return v$.value.name.$errors.map((e) => e.$message)
    }
    return []
  })
  
  const emailErrors = computed(() => {
    if (v$.value.email.$dirty && v$.value.email.$invalid) {
      return v$.value.email.$errors.map((e) => e.$message)
    }
    return []
  })
  
  const passwordErrors = computed(() => {
    if (v$.value.password.$dirty && v$.value.password.$invalid) {
      return v$.value.password.$errors.map((e) => e.$message)
    }
    return []
  })
  
  const roleErrors = computed(() => {
    if (v$.value.role.$dirty && v$.value.role.$invalid) {
      return v$.value.role.$errors.map((e) => e.$message)
    }
    return []
  })
  
  async function submit() {
    v$.value.$touch()
    if (v$.value.$invalid) return
  
    loading.value = true
    try {
      await authStore.register(form.value.name, form.value.email, form.value.password, form.value.role)
    } catch (err) {
      error.value = 'Registration failed. Please try again.'
      snackbar.value = true
    } finally {
      loading.value = false
    }
  }
  </script>