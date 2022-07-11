import axios from "axios";
import NProgress from "nprogress";
import lodash from "lodash-es";
import deepdash from "deepdash-es";
import camelize from "camelize";
import getEnv from "@/utils/env";
import { formatDefaultLocale } from "d3";

const _ = deepdash(lodash);

const protectedRoutes = ["jobs", "files"];
const isProtected = (config) =>
  protectedRoutes.some((item) => config.url.includes(item));

const baseURL = `${getEnv("VUE_APP_CCR_BACKEND_URL")}`;

const instance = axios.create({
  baseURL: baseURL,
  //timeout: 10000,
});

const controller = new AbortController();

// Interceptors are run before/ after each request. They control the NProgress bar.
instance.interceptors.request.use(function (config) {
  return config;
});

instance.interceptors.response.use(function (config) {
  return config;
});

instance.interceptors.response.use(
  function (response) {
    //NProgress.done();

    // if this is a multipart file response, there is nothing to camelize
    if (response.headers["content-type"] === "application/json") {
      const res = _.mapKeysDeep(response.data, function (value, key) {
        return camelize(key);
      });
      response.data = res;
    }

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    NProgress.done();
    return Promise.reject(error);
  }
);

export default {
  controller,
  setupAsyncInterceptor(f) {
    instance.interceptors.request.use(async (config) => {
      await f();
      return config;
    });
  },
  setupToken(token) {
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  },
  submitJob(formData) {
    return instance.post(`jobs/`, formData);
  },
  getResultsList() {
    return instance.get(`jobs/`);
  },
  getResultByID(id) {
    return instance.get(`jobs/${id}`);
  },
  getFile({ id, fileUri }) {
    return instance.get(`files/${id}/`, {
      responseType: "blob",
      params: { file_uri: fileUri },
    });
  },
  getChart({ id, chart }) {
    return instance.get(`files/${id}/`, {
      params: { file_uri: `json/${chart}.json` },
    });
  },
  getStaticResource(resource) {
    return instance.get(`/static/${resource}`);
  },
};
