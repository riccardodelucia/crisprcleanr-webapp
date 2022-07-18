import { createMachine, assign } from "xstate";
import getEnv from "@/utils/env";

////////////////////////////////////////////////////////////////
// SERVICES
const uploadFile =
  ({ file, id, jobId }, event) =>
  (callback) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("jobId", jobId);
    formData.append("id", id);

    const req = new XMLHttpRequest();
    const baseURL = `${getEnv("VUE_APP_FILE_SERVER_URL")}`;
    const uploadURL = new URL("upload", baseURL);

    req.open("POST", uploadURL, true);
    req.setRequestHeader("Content-Range", `bytes=0-${file.size}/${file.size}`);
    req.setRequestHeader("X-Upload-Id", jobId);

    req.onload = (e) => {
      // it is possible for load to be called when the request status is not 200
      // this will treat 200 only as success and everything else as failure
      if (req.status === 200) {
        callback({ type: "UPLOADED" });
      } else {
        callback({ type: "ERROR" });
      }
    };

    req.upload.onprogress = (progress) => {
      callback({
        type: "PROGRESS",
        progress,
      });
    };

    req.ontimeout = (e) => callback({ type: "ERROR" });

    req.onerror = (e) => callback({ type: "ERROR" });

    req.send(formData);

    return () => {
      req.abort();
    };
  };

////////////////////////////////////////////////////////////////
// ACTIONS
const assignProgress = assign(({ file }, { progress }) => {
  const totalFileBytesUploaded = progress.loaded;
  const percentage = Math.min(
    Math.round((totalFileBytesUploaded * 100) / file.size),
    100
  );
  return {
    totalFileBytesUploaded,
    percentage,
  };
});

//const sendDeleteUpload = (context) => Upload.deleteUpload(context);

////////////////////////////////////////////////////////////////
// GUARDS
const warnAbort = () =>
  window.confirm(
    "This action will permanently delete the file upload. Your job will not be able to be computed. Are you sure?"
  );

export default createMachine({
  context: {
    file: null,
    id: "",
    filename: "",
    jobId: "",
    totalFileBytesUploaded: 0,
    percentage: 0,
  },
  initial: "uploading",
  states: {
    uploading: {
      invoke: {
        id: "uploadFile",
        src: "uploadFile",
      },
      on: {
        PROGRESS: { actions: ["assignProgress"] },
        ABORT: { target: "aborted" },
        ERROR: { target: "error" },
        UPLOADED: {
          target: "uploaded",
        },
      },
    },
    uploaded: { type: "final" },
    aborted: {
      type: "final",
      entry: [() => console.log("aborted")],
    },
    error: {
      type: "final",
      entry: [() => console.log("machine in error state")],
    },
    idle: {
      on: {
        RESUME: {
          target: "uploading",
        },
      },
    },
  },
  on: {
    ABORT: {
      cond: "warnAbort",
      target: "aborted",
      //actions: ["sendDeleteUpload"],
    },
  },
}).withConfig({
  services: {
    uploadFile,
  },
  actions: { assignProgress },
  guards: { warnAbort },
});
