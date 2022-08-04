import { createMachine, assign } from "xstate";
import getEnv from "@/utils/env";
import uploadAPI from "@/api/upload.js";

////////////////////////////////////////////////////////////////
// SERVICES
const uploadFile =
  ({ file, id, jobId }, event) =>
  (callback) => {
    const progressCallback = (progress) =>
      callback({
        type: "PROGRESS",
        progress,
      });

    const uploadedCallback = () =>
      callback({
        type: "UPLOADED",
      });

    const errorCallback = () =>
      callback({
        type: "ERROR",
      });

    const controller = new AbortController();

    uploadAPI.uploadFile({
      file,
      id,
      jobId,
      progressCallback,
      uploadedCallback,
      errorCallback,
      controller,
    });

    return () => {
      controller.abort();
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
