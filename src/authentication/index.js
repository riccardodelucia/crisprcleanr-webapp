import Keycloak from 'keycloak-js';
import { reactive, inject } from 'vue';
import getEnv from '@/utils/env.js';

const authServerURL = `${getEnv('VITE_URL_AUTH_SERVER')}`;

const realm = getEnv('VITE_AUTH_REALM');

const clientId = getEnv('VITE_AUTH_CLIENT_ID');

const keycloak = new Keycloak({
  url: authServerURL,
  realm,
  clientId,
});

function login(redirectUri = window.location.href) {
  return keycloak.login({ redirectUri });
}

function logout(redirectUri = window.location.origin) {
  return keycloak.logout({ redirectUri });
}

// this is the reactive property that will allow vue components to observe keycloak events
const auth = reactive({
  authenticated: false,
  userProfile: {},
  login,
  logout,
});

// this callback allows to update the reactive auth object, thus updating all vue components
keycloak.onAuthSuccess = function () {
  auth.authenticated = keycloak.authenticated;

  keycloak.loadUserProfile().then((profile) => {
    auth.userProfile = profile;
  });
};

// this callback allows to update the reactive auth object, thus updating all vue components
keycloak.onAuthLogout = function () {
  auth.authenticated = keycloak.authenticated;
  auth.userProfile = {};
};

// Do not setup any token here, since this async callback is not guaranteed to be executed before any authorized route is called.
// This could cause the protected routes to call the backend before the authentication header is setup in the axios call, thus generating a 403 error.
keycloak.onAuthRefreshSuccess = () => {};

export function authorize(redirectUri = window.location.origin) {
  return new Promise((resolve, reject) => {
    const expirationTime = 70;
    if (!keycloak.authenticated) {
      login(redirectUri);
      reject(new Error('Not authenticated')); // should never execute...
    } else {
      keycloak
        .updateToken(expirationTime)
        .then(() => {
          const token = keycloak.token;
          resolve(token);
        })
        .catch(() => {
          login();
          reject('Unable to refresh token, logging out'); // should never execute...
        });
    }
  });
}

export function init() {
  return keycloak.init({ checkLoginIframe: false, enableLogging: true });
}

export async function interceptorAuthorize(config) {
  const token = await authorize();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}

export const plugin = {
  install: function (app) {
    app.provide('auth', auth);
    app.config.globalProperties.$auth = auth;
  },
};

export function useAuth() {
  return inject('auth');
}
