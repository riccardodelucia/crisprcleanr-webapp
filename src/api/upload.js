import axios from "axios";
import getEnv from "@/utils/env";
import { authorize } from "@/authentication";

const baseURL = `${getEnv("VUE_APP_URL_IORIO_CCR_FILESERVER")}`;

const authInstance = axios.create({
  baseURL: baseURL,
});

const controller = new AbortController();

authInstance.interceptors.request.use(function (config) {
  const redirectUri = window.location.href;
  return authorize(redirectUri).then((token) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
});

export default {
  controller,
  uploadFile({
    file,
    id,
    jobId,
    progressCallback,
    uploadedCallback,
    errorCallback,
    controller,
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
      signal: controller.signal,
      onUploadProgress: progressCallback,
    };

    return authInstance
      .post(`upload/`, formData, config)
      .then(uploadedCallback)
      .catch((err) => {
        console.log("Error! ", err);
        errorCallback();
      });
  },
};
