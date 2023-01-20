import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import auth from './authentication/index.js';

import '@/assets/scss/vendor/nprogress.scss';

import nProgress from 'nprogress';

import 'tippy.js/dist/tippy.css'; // optional for styling

import VueFeather from 'vue-feather';

import HTComponents from '@computational-biology-web-unit/ht-vue/components';
import '@computational-biology-web-unit/ht-design/dist/style.css';

nProgress.configure({ showSpinner: false });

auth.init().then(() => {
  const app = createApp(App).use(auth).use(HTComponents).use(store).use(router);

  app.component(VueFeather.name, VueFeather);

  app.mount('#app');
});
