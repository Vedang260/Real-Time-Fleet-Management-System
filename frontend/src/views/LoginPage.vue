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
        router.push('/login');
      }, 2000);
    } else {
      throw new Error('Login failed');
    }
  } catch (err) {
    snackbarMessage.value = 'Login failed. Please try again.';
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
}
</script>