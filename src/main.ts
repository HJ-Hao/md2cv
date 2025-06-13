import './style.css'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import App from './App.vue'
import myTheme from '@/plugins/primeTheme'
import templateLoader, { loadTemplateStyles } from '@/plugins/templateLoader'

const pinia = createPinia()

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: myTheme,
        options: {
            darkModeSelector: '.my-app-dark',
        },
    },
})
    .use(templateLoader)
    .use(pinia)

// load template styles before mounting the app
loadTemplateStyles().then(() => {
    app.mount('#app')
})
