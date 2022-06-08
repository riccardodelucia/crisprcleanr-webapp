import Keycloak from "keycloak-js";
import getEnv from "@/utils/env";
import store from "./store";
import { getRouter } from "@/router/index.js";
import { reactive } from "vue";
import service from "@/api/ccr.js";

const authServerURL = `${getEnv("VUE_APP_AUTH_SERVER_URL")}`;

const realm = getEnv("VUE_APP_AUTH_REALM");

const clientId = getEnv("VUE_APP_AUTH_CLIENT_ID");

const appRootUrl = getEnv("VUE_APP_ROOT_URL");

const keycloak = Keycloak({
  url: authServerURL,
  realm,
  clientId,
});

keycloak.onAuthSuccess = function () {
  keycloak
    .loadUserProfile()
    .then((profile) => {
      store.commit("user/SET_USER", profile);
      service.setupToken(keycloak.token);
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
  service.setupToken("");
};

keycloak.onAuthRefreshSuccess = function () {
  service.setupToken(keycloak.token);
};

export function authorize(redirectUri) {
  const expirationTime = 70;
  if (!keycloak.authenticated) {
    // The page is protected and the user is not authenticated. Force a login.
    return keycloak.login({
      redirectUri,
    });
  } else {
    return keycloak.updateToken(expirationTime).catch(() => {
      console.log("unable to refresh token, logging in");
      keycloak.login({ redirectUri });
    });
  }
}

service.setupAsyncInterceptor(() => {
  const redirectUri = window.location.href;
  return authorize(redirectUri);
});

function login(redirectUri) {
  const absoluteUri = new URL(redirectUri, appRootUrl).toString();
  console.log(absoluteUri);

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
          console.log(redirectUri);
          return authorize(redirectUri);
        }
        // This page did not require authentication
        return;
      });

      return { router, authentication: authenticationPlugin };
    });
};
