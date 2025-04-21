import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import { components, directives } from 'vuetify/dist/vuetify.js'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#FF9800',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          }
        }
      }
    }
  })
  
const app = createApp(App).use(vuetify)

app.use(createPinia())
app.use(router)
app.mount('#app')
