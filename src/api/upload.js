import axios from "axios";
import lodash from "lodash-es";
import deepdash from "deepdash-es";

const _ = deepdash(lodash);

const baseURL = "http://localhost:8888";

const instance = axios.create({
  baseURL: baseURL,
});

const controller = new AbortController();

export default {
  controller,
  initFile({ file }) {
    return instance.post("/upload-request", {
      fileName: file.name,
    });
  },
  deleteUpload({ fileId }) {
    return instance.delete("/upload", {
      data: { fileId },
    });
  },
};
