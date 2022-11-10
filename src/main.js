import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import '@/assets/scss/main.scss';
import '@/assets/scss/vendor/nprogress.scss';

import nProgress from 'nprogress';

import { initializeAppWithAuth } from '@/authentication.js';

import 'tippy.js/dist/tippy.css'; // optional for styling

import VueFeather from 'vue-feather';

nProgress.configure({ showSpinner: false });

initializeAppWithAuth().then(({ router, authentication }) => {
  const app = createApp(App).use(store).use(router).use(authentication);
  app.config.unwrapInjectedRef = true;

  // directive to catch out-of-element clicks (useful for blurring/ focusing)
  app.directive('click-outside', {
    beforeMount(el, binding) {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event, el);
        }
      };
      document.body.addEventListener('click', el.clickOutsideEvent);
    },
    beforeUnmount(el) {
      document.body.removeEventListener('click', el.clickOutsideEvent);
    },
  });

  const componentFiles = import.meta.globEager('./components/Base*.vue');

  Object.entries(componentFiles).forEach(([path, componentConfig]) => {
    // Get PascalCase name of component
    const componentName = upperFirst(
      camelCase(
        path
          .split('/')
          .pop()
          .replace(/\.\w+$/, '')
      )
    );

    // Register component globally
    app.component(
      componentName,
      // Look for the component options on `.default`, which will
      // exist if the component was exported with `export default`,
      // otherwise fall back to module's root.
      componentConfig.default || componentConfig
    );
  });

  app.component(VueFeather.name, VueFeather);

  app.mount('#app');
});
