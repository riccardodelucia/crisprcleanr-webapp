import axios from "axios";
import getEnv from "@/utils/env";

const baseURL = `${getEnv("VUE_APP_FILE_SERVER_URL")}`;

const instance = axios.create({
  baseURL: baseURL,
});

const controller = new AbortController();

export default {
  controller,
  setupAsyncInterceptor(f) {
    instance.interceptors.request.use(async (config) => {
      await f();
      return config;
    });
  },
  setupToken(token) {
    console.log("upload token: ", token);
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  },
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

    return instance
      .post(`upload/`, formData, config)
      .then(uploadedCallback)
      .catch((err) => {
        console.log("Error! ", err);
        errorCallback();
      });
  },
};
