import '@/scss/style.scss';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueTablerIcons from 'vue-tabler-icons';
import VueApexCharts from 'vue3-apexcharts';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import vuetify from './plugins/vuetify';
import { router } from './router';

// Ag grid
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
// Ag grid

import { fakeBackend } from '@/utils/helpers/fake-backend';

// api
import { axiosInstance } from './services/api';
import { setupInterceptors } from './services/interceptors';

setupInterceptors(axiosInstance);

// print
import print from 'vue3-print-nb';

const app = createApp(App);
fakeBackend();
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(createPinia());
app.use(VueTablerIcons);
app.use(print);
app.use(VueApexCharts);
app.use(vuetify).mount('#app');
