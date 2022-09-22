import axios from "axios";
import getEnv from "@/utils/env";
import { authorize } from "@/authentication";

const baseURL = `${getEnv("VUE_APP_URL_IORIO_CCR_FILESERVER")}`;

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
    uploadId,
    fileId,
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
        "X-Upload-Id": uploadId,
        "X-File-Id": fileId,
      },
      onUploadProgress: progressCallback,
    };

    const instance = getInstance(uploadId); // this links all job's uploads with a single abort controller

    return instance
      .post(`upload/`, formData, config)
      .then(uploadedCallback)
      .catch(errorCallback);
  },
};
