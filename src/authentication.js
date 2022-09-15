import Keycloak from "keycloak-js";
import getEnv from "@/utils/env";
import store from "./store";
import { getRouter } from "@/router/index.js";
import { reactive, ref } from "vue";

const authServerURL = `${getEnv("VUE_APP_URL_AUTH_SERVER")}`;

const realm = getEnv("VUE_APP_AUTH_REALM");

const clientId = getEnv("VUE_APP_AUTH_CLIENT_ID");

const appRootUrl = getEnv("VUE_APP_URL_IORIO_CCR_WEBAPP");

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
    })
    .catch((error) => {
      store.commit("user/SET_USER", {});
      store.dispatch("notification/add", {
        type: "error",
        title: "Unable to log in",
        message: error?.message,
        timeout: 5,
      });
    });
};

keycloak.onAuthLogout = function () {
  store.commit("user/SET_USER", {});
};

keycloak.onAuthRefreshSuccess = function () {
  // Do not setup token here, since this async callback is not guaranteed to be executed before the authorized route is called.
  // This could cause the protected route to call the backend before the authentication header is setup in the axios call.
};

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
    //app.provide("authentication", reactive(keycloak));
    app.provide("authenticated", ref(keycloak.authenticated)); // TODO monitor if this works fine
  },
};

export const authorize = (redirectUri) =>
  new Promise((resolve, reject) => {
    const expirationTime = 70;
    if (!keycloak.authenticated) {
      login(redirectUri);
      reject(new Error("Not authenticated"));
    } else {
      keycloak
        .updateToken(expirationTime)
        .then(() => {
          const token = keycloak.token;
          resolve(token);
        })
        .catch(() => {
          logout();
          reject("Unable to refresh token, logging out");
        });
    }
  });

export const initializeAppWithAuth = function () {
  return keycloak
    .init({ checkLoginIframe: false, enableLogging: true })
    .then(() => {
      const router = getRouter();

      router.beforeEach((to) => {
        if (to.matched.some((record) => record.meta.requiresAuth)) {
          const redirectUri = new URL(to.path, appRootUrl).toString();
          return authorize(redirectUri).then(() => true);
        }
        // This page did not require authentication
        return;
      });

      return { router, authentication: authenticationPlugin };
    });
};
