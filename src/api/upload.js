import axios from "axios";
import getEnv from "@/utils/env";
import { authorize } from "@/authentication";

const baseURL = `${getEnv("VUE_APP_URL_IORIO_CCR_FILESERVER")}`;

const authInstances = new Map();

const createInstance = () => {
  const controller = new AbortController();
  const instance = axios.create({ signal: controller.signal, baseURL });

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

const getInstance = (id) => {
  const authInstance = createInstance();
  authInstances.set(id, authInstance);
  return authInstance.instance;
};

export default {
  abortAndDeleteRequest(id) {
    const authInstance = authInstances.get(id);
    if (authInstance && authInstance.controller.aborted) {
      authInstance.controller.abort();
      authInstances.delete(id);
    }
  },
  uploadFile({
    file,
    id,
    jobId,
    progressCallback,
    uploadedCallback,
    errorCallback,
  }) {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("jobId", jobId);
    formData.append("id", id);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Content-Range": `bytes=0-${file.size}/${file.size}`,
        "X-Upload-Id": jobId,
      },
      onUploadProgress: progressCallback,
    };

    const instance = getInstance(id);

    return instance
      .post(`upload/`, formData, config)
      .then(uploadedCallback)
      .catch(errorCallback);
  },
};
