import axios from "axios";
import NProgress from "nprogress";
import lodash from "lodash-es";
import deepdash from "deepdash-es";
import camelize from "camelize";
import getEnv from "@/utils/env";
import { authorize } from "@/authentication";

const _ = deepdash(lodash);

const baseURL = `${getEnv("VUE_APP_URL_IORIO_CCR_BACKEND")}`;
const connectionTimeout = `${getEnv("VUE_APP_CONNECTION_TIMEOUT_MS")}`;

// instances need to be separated according to auth to enable correct interceptor auth request on auth-dependent requests
const instances = new Map();
const authInstances = new Map();

const createInstance = (auth = false) => {
  const controller = new AbortController();
  const instance = axios.create({
    signal: controller.signal,
    baseURL,
    timeout: connectionTimeout,
  });

  instance.interceptors.response.use(function (response) {
    // if this is a multipart file response, there is nothing to camelize
    if (response.headers["content-type"] === "application/json") {
      const res = _.mapKeysDeep(response.data, function (value, key) {
        return camelize(key);
      });
      response.data = res;
    }

    return response;
  });

  auth &&
    instance.interceptors.request.use(function (config) {
      const redirectUri = window.location.href;
      return authorize(redirectUri).then((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    });

  return {
    controller,
    instance,
  };
};

const getInstance = ({ path, auth }) => {
  let instance = auth ? authInstances.get(path) : instances.get(path);
  if (instance && !instance.controller.aborted) return instance.instance;
  instance = createInstance(auth);
  !auth && instances.set(path, instance);
  auth && authInstances.set(path, instance);
  return instance.instance;
};

export default {
  abortAndDeleteAllRequests(path) {
    const instance = instances.get(path);
    const authInstance = authInstances.get(path);
    if (instance && !instance.controller.aborted) {
      instance.controller.abort();
      instances.delete(path);
    }
    if (authInstance && !authInstance.controller.aborted) {
      authInstance.controller.abort();
      authInstances.delete(path);
    }
  },
  submitJob(formData) {
    const instance = getInstance({
      path: window.location.pathname,
      auth: true,
    });
    return instance.post(`jobs/`, formData);
  },
  getResultsList() {
    const instance = getInstance({
      path: window.location.pathname,
      auth: true,
    });
    return instance.get(`jobs/`);
  },
  getResultByID(id) {
    const instance = getInstance({
      path: window.location.pathname,
      auth: true,
    });
    return instance.get(`jobs/${id}`);
  },
  getFile({ id, fileUri }) {
    const instance = getInstance({
      path: window.location.pathname,
      auth: true,
    });
    return instance.get(`files/${id}/`, {
      responseType: "blob",
      params: { file_uri: fileUri },
    });
  },
  getChart({ id, chart }) {
    const instance = getInstance({
      path: window.location.pathname,
      auth: true,
    });
    return instance.get(`files/${id}/`, {
      params: { file_uri: `json/${chart}.json` },
    });
  },
  getStaticResource(resource) {
    const instance = getInstance({
      path: window.location.pathname,
      auth: false,
    });
    return instance.get(`/static/${resource}`);
  },
};
