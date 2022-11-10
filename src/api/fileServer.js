import axios from "axios";
import getEnv from "@/utils/env";
import lodash from "lodash-es";
import deepdash from "deepdash-es";
import camelize from "camelize";
import { authorize } from "@/authentication";
const _ = deepdash(lodash);

const baseURL = `${getEnv("VITE_URL_IORIO_CCR_FILESERVER")}`;

const authInstances = new Map();

const createInstance = () => {
  const controller = new AbortController();

  // cannot setup a timeout on upload , otherwise large file uploads get canceled
  const instance = axios.create({
    signal: controller.signal,
    baseURL,
  });

  instance.interceptors.request.use(function (config) {
    const redirectUri = window.location.href;
    return authorize(redirectUri).then((token) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
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

  return {
    controller,
    instance,
  };
};

const getInstance = (uploadId) => {
  let instance = authInstances.get(uploadId);
  if (instance && !instance.controller.aborted) return instance.instance;
  instance = createInstance();
  authInstances.set(uploadId, instance);
  return instance.instance;
};

export default {
  abortAndDeleteRequest(uploadId) {
    const authInstance = authInstances.get(uploadId);
    if (authInstance && !authInstance.controller.aborted) {
      authInstance.controller.abort();
      authInstances.delete(uploadId);
    }
  },
  uploadFile({
    file,
    objectKey,
    progressCallback,
    uploadedCallback,
    errorCallback,
  }) {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Content-Range": `bytes=0-${file.size}/${file.size}`,
        "X-Object-Key": objectKey,
      },
      onUploadProgress: progressCallback,
    };

    const instance = getInstance(objectKey); // this links all job's uploads with a single abort controller

    return instance
      .post(`upload/`, formData, config)
      .then(uploadedCallback)
      .catch(errorCallback);
  },
  downloadFile({ objectKey, blob = false }) {
    const instance = getInstance(objectKey);
    const options = { params: { "object-key": objectKey } };
    if (blob) options.responseType = "blob";
    return instance.get(`/download`, options);
  },
};
