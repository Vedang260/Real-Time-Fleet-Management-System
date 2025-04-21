<template>
    <div class="login-page">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="login-card pa-6" elevation="8" rounded="xl">
              <v-card-title class="text-h4 font-weight-bold gradient-text text-center">
                Welcome, Back!
              </v-card-title>
              <v-card-subtitle class="text-center mt-2">
                Start tracking your Fleet
              </v-card-subtitle>
              <v-card-text>
                <form @submit.prevent="submit">
                  <v-text-field
                    label="Email Address"
                    v-model="form.email"
                    :error-messages="emailErrors"
                    prepend-inner-icon="mdi-email"
                    outlined
                    dense
                    class="mb-4"
                    @blur="touchField('email')"
                    required
                  />
                  <v-text-field
                    label="Password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :error-messages="passwordErrors"
                    prepend-inner-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    outlined
                    dense
                    class="mb-4"
                    @blur="touchField('password')"
                    required
                  />
                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    large
                    rounded
                    elevation="4"
                    :loading="loading"
                    class="mt-4 gradient-button"
                  >
                    Login
                    <v-icon right>mdi-rocket</v-icon>
                  </v-btn>
                </form>
                <p class="mt-6 text-center body-2">
                  Don't have an account? <router-link to="/register" class="link">Register</router-link>
                </p>
              </v-card-text>
            </v-card>
            <v-snackbar
              v-model="snackbar"
              :color="snackbarColor"
              timeout="3000"
              rounded="pill"
              top
            >
              {{ snackbarMessage }}
              <template v-slot:actions>
                <v-btn text @click="snackbar = false">Close</v-btn>
              </template>
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
});
const showPassword = ref(false);
const loading = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('error');

const rules = {
  form: {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  },
};

const v$ = useVuelidate(rules, { form });

const emailErrors = computed(() => {
  const field = v$.value.form.email;
  if (field.$dirty && field.$invalid) {
    return field.$errors.map((e: any) =>
      e.$validator === 'required' ? 'Email is required' : 'Enter a valid email address'
    );
  }
  return [];
});

const passwordErrors = computed(() => {
  const field = v$.value.form.password;
  if (field.$dirty && field.$invalid) {
    return field.$errors.map((e: any) =>
      e.$validator === 'required'
        ? 'Password is required'
        : 'Password must be at least 6 characters'
    );
  }
  return [];
});

function touchField(field: string) {
  if (v$.value.form[field]) {
    v$.value.form[field].$touch();
  }
}

async function submit() {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  loading.value = true;
  try {
    const response = await authStore.login(
      form.value.email,
      form.value.password,
    );
    if (response.success) {
      snackbarMessage.value = response.message;
      snackbarColor.value = 'success';
      snackbar.value = true;
      setTimeout(() => {
      if (response.role === 'ADMIN') {
        router.push('/admin');  // Redirect to admin page
      } else if (response.role === 'MANAGER') {
        router.push('/manager');  // Redirect to manager page
      } else {
        router.push('/driver');  // If role is not recognized, redirect to login page
      }
    }, 2000); 
    } else {
      throw new Error(response.message);
    }
  } catch (err: any) {
    snackbarMessage.value = err.message;
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
}
</script>


<style scoped>
.login-page {
  background: linear-gradient(135deg, #f9fbfd 0%, #e8ecef 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/patterns/register-pattern.png') no-repeat center center;
  background-size: cover;
  opacity: 0.1;
  z-index: 0;
}

.login-card {
  background: white;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.gradient-text {
  background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.gradient-button {
  background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
  color: white !important;
}

.link {
  color: #2196F3;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.v-text-field,
.v-select {
  transition: all 0.3s ease;
}

.v-text-field:hover,
.v-select:hover {
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }

  .login-card {
    padding: 1rem;
  }

  .v-btn {
    font-size: 0.875rem;
  }
}
</style>