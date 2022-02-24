import axios from "axios";
import NProgress from "nprogress";
import lodash from "lodash-es";
import deepdash from "deepdash-es";
import camelize from "camelize";
import getEnv from "@/utils/env";
import { keycloak, authorize } from "@/authentication.js";

const _ = deepdash(lodash);

const protectedRoutes = ["jobs", "files"];
const isProtected = (config) =>
  protectedRoutes.some((item) => config.url.includes(item));

const baseURL = `${getEnv("VUE_APP_CCR_BACKEND_URL")}`;

const instance = axios.create({
  baseURL: baseURL,
  //timeout: 10000,
  //headers: {'X-Custom-Header': 'foobar'}
});

// Interceptors are run before/ after each request. They control the NProgress bar.
instance.interceptors.request.use(function (config) {
  NProgress.start();
  return config;
});

instance.interceptors.request.use(async (config) => {
  const redirectUri = `${window.location.href}`;

  if (isProtected(config)) {
    const authorized = await authorize(redirectUri, redirectUri);

    if (authorized) {
      const token = keycloak.token;
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } else throw new axios.Cancel("Cannot authorize user");
  } else return config;
});

instance.interceptors.response.use(
  function (response) {
    NProgress.done();

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
  submitJob({
    title,
    email,
    label,
    library,
    normMinReads,
    nControls,
    method,
    notes,
    fileCounts,
    resultsUrl,

  }) {
    const bodyFormData = new FormData();
    bodyFormData.append("title", title);
    email && bodyFormData.append("email", email);
    bodyFormData.append("label", label);
    bodyFormData.append("library", library);
    bodyFormData.append("norm_min_reads", normMinReads);
    bodyFormData.append("n_controls", nControls);
    bodyFormData.append("method", method);
    notes && bodyFormData.append("notes", notes);
    bodyFormData.append("file_counts", fileCounts);
    bodyFormData.append("results_url", resultsUrl);

    return instance.post(`jobs/`, bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    return instance.get(`files/${id}/charts/${chart}`);
  },
  getStaticResource(resource) {
    return instance.get(`/static/${resource}`);
  },
};
