import Keycloak from "keycloak-js";
import getEnv from "@/utils/env";
import store from "./store";
import { getRouter } from "@/router/index.js";
import { reactive } from "vue";
import ccrApi from "@/api/ccr.js";
import uploadApi from "@/api/upload.js";

const authServerURL = `${getEnv("VUE_APP_AUTH_SERVER_URL")}`;

const realm = getEnv("VUE_APP_AUTH_REALM");

const clientId = getEnv("VUE_APP_AUTH_CLIENT_ID");

const appRootUrl = getEnv("VUE_APP_ROOT_URL");

const keycloak = new Keycloak({
  url: authServerURL,
  realm,
  clientId,
});

keycloak.onAuthSuccess = function () {
  keycloak
    .loadUserProfile()
    .then((profile) => {
      store.commit("user/SET_USER", profile);
      ccrApi.setupToken(keycloak.token);
      uploadApi.setupToken(keycloak.token);
    })
    .catch((error) => {
      store.commit("user/SET_USER", {});
      store.dispatch("notification/add", {
        type: "error",
        title: "Unable to log in",
        message: error.message,
        timeout: 5,
      });
    });
};

keycloak.onAuthLogout = function () {
  store.commit("user/SET_USER", {});
  ccrApi.setupToken("");
  uploadApi.setupToken("");
};

keycloak.onAuthRefreshSuccess = function () {
  // Do not setup token here, since this async callback is not guaranteed to be executed before the authorized route is called.
  // This could cause the protected route to call the backend before the authentication header is setup in the axios call.
  //ccrApi.setupToken(keycloak.token);
};

function authorize(redirectUri) {
  const expirationTime = 70;
  if (!keycloak.authenticated) {
    // The page is protected and the user is not authenticated. Force a login.
    return keycloak.login({
      redirectUri,
    });
  } else {
    return keycloak
      .updateToken(expirationTime)
      .then(() => {
        ccrApi.setupToken(keycloak.token);
        uploadApi.setupToken(keycloak.token);
        return true;
      })
      .catch(() => {
        console.error("unable to refresh token, logging in");
        return keycloak.login({ redirectUri });
      });
  }
}

ccrApi.setupAsyncInterceptor(() => {
  const redirectUri = window.location.href;
  return authorize(redirectUri);
});

function login(redirectUri) {
  const absoluteUri = new URL(redirectUri, appRootUrl).toString();
  return keycloak.login({ redirectUri: absoluteUri });
}

function logout() {
  const absoluteUri = new URL("/", appRootUrl).toString();

  return keycloak.logout({ redirectUri: absoluteUri });
}

const authenticationPlugin = {
  install(app, options) {
    app.provide("login", login);
    app.provide("logout", logout);
    app.provide("authentication", reactive(keycloak));
  },
};

export const initializeAppWithAuth = function () {
  return keycloak
    .init({ checkLoginIframe: false, enableLogging: true })
    .then(() => {
      const router = getRouter();

      router.beforeEach((to) => {
        if (to.matched.some((record) => record.meta.requiresAuth)) {
          const redirectUri = new URL(to.path, appRootUrl).toString();
          return authorize(redirectUri);
        }
        // This page did not require authentication
        return;
      });

      return { router, authentication: authenticationPlugin };
    });
};
