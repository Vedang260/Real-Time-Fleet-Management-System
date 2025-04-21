// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
    },
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme: {
          dark: false,
          colors: {
            primary: '#fb8c00', // Orange for buttons and accents
            accent: '#f57c00', // Slightly darker orange
            secondary: '#e0e0e0', // Light gray for backgrounds
            success: '#4caf50', // Green for checkmarks
            background: '#f5f5f5', // Light gray for sections
          },
        },
      },
    },
  })

export default vuetify;