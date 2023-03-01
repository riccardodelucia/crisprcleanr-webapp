import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import {
  init as authInit,
  plugin as authPlugin,
} from './authentication/index.js';

import '@/assets/scss/vendor/nprogress.scss';

import nProgress from 'nprogress';

import 'tippy.js/dist/tippy.css'; // optional for styling

import VueFeather from 'vue-feather';

import { HTVue } from '@computational-biology-web-unit/ht-vue';
import '@computational-biology-web-unit/ht-design/style.css';

nProgress.configure({ showSpinner: false });

authInit().then(() => {
  const app = createApp(App).use(authPlugin).use(HTVue).use(store).use(router);

  app.component(VueFeather.name, VueFeather);

  app.mount('#app');
});
