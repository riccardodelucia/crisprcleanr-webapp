import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { init as authInit, plugin as authPlugin } from '@/authentication.js';

import '@/assets/style/vendor/nprogress.css';

import nProgress from 'nprogress';

import 'tippy.js/dist/tippy.css'; // optional for styling

import VueFeather from 'vue-feather';

import { AxiosError } from 'axios';

import { HTVue } from '@nf-data-iu3/ht-vue';
import {
  HTNotificationsPlugin,
  sendErrorNotification,
} from '@nf-data-iu3/ht-vue';
import '@nf-data-iu3/ht-vue/style.css';

nProgress.configure({ showSpinner: false });

function parseErrorMesssage(error) {
  let message = '';
  if (error instanceof AxiosError) {
    message = error?.response
      ? error.response?.data?.detail
        ? error.response.data.detail
        : 'Unknown API response error data'
      : error.message
        ? error.message
        : error;
  } else {
    message = error.message ? error.message : error;
  }
  return message;
}

authInit().then(() => {
  const app = createApp(App)
    .use(authPlugin)
    .use(HTVue)
    .use(HTNotificationsPlugin)
    .use(router);

  app.component(VueFeather.name, VueFeather);

  app.config.errorHandler = (error) => {
    const message = parseErrorMesssage(error);
    sendErrorNotification({
      title: 'An Error Occurred',
      message,
    });
  };

  app.mount('#app');
});
