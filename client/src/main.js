import { createApp, ref } from 'vue'
import App from './App.vue';
import Router from '@/routes';
import '@/assets/scss/Root.scss';

import { LoadingTransition } from '@/components/globalComponents.js'

const app = createApp(App)

// Router
app.use(Router)
// Global variable
app.provide('pTitle', ref('Chess Website'));
app.provide('isUserAuth', ref(false));
app.provide('uid', ref(null));
// Setup global component
app.component('LoadingTransition', LoadingTransition);
app.mount('#app');
