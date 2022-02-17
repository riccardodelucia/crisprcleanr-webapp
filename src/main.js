import { createApp } from "vue";
import App from "./App.vue";
import getRouter from "./router";
import store from "./store";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

import "@/assets/scss/main.scss";
import "@/assets/scss/vendor/nprogress.scss";

import NProgress from "nprogress";

import { keycloak } from "@/authentication.js";

import "tippy.js/dist/tippy.css"; // optional for styling

(async function () {
  NProgress.configure({ showSpinner: false });

  const router = await getRouter();

  console.log("configuring Vue app");

  const app = createApp(App).use(store).use(router);

  // setting up keycloak
  app.provide("keycloak", keycloak);

  // directive to catch out-of-element clicks (useful for blurring/ focusing)
  app.directive("click-outside", {
    beforeMount(el, binding) {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event, el);
        }
      };
      document.body.addEventListener("click", el.clickOutsideEvent);
    },
    beforeUnmount(el) {
      document.body.removeEventListener("click", el.clickOutsideEvent);
    },
  });

  const requireComponent = require.context(
    // The relative path of the components folder
    "./components",
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /Base[A-Z]\w+\.(vue|js)$/
  );

  requireComponent.keys().forEach((fileName) => {
    // Get component config
    const componentConfig = requireComponent(fileName);

    // Get PascalCase name of component
    const componentName = upperFirst(
      camelCase(
        // Gets the file name regardless of folder depth
        fileName.replace(/^\.\/(.*)\.\w+$/, "$1")
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
  console.log("mounting Vue app");

  app.mount("#app");
})();
