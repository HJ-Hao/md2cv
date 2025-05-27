import './style.css';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import App from './App.vue';
import myTheme from '@/plugins/primeTheme';
const pinia = createPinia();

const app = createApp(App);
app
    .use(PrimeVue, {
        theme: {
            preset: myTheme ,
            options: {
                darkModeSelector: '.my-app-dark',
            }
        }
    })
    .use(pinia);
app.mount('#app')