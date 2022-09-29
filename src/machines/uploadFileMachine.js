import { createMachine, assign } from "xstate";
import uploadAPI from "@/api/upload.js";

////////////////////////////////////////////////////////////////
// SERVICES
const uploadFile =
  ({ file, fileId, uploadId }, event) =>
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

    const errorCallback = (error) =>
      callback({
        type: "ERROR",
        payload: { error },
      });

    uploadAPI.uploadFile({
      file,
      fileId,
      uploadId,
      progressCallback,
      uploadedCallback,
      errorCallback,
    });

    return () => {};
  };

////////////////////////////////////////////////////////////////
// ACTIONS
const assignProgress = assign(({ file }, { progress }) => {
  const totalFileBytesUploaded = progress.loaded;
  const percentage = Math.min(
    Math.round((totalFileBytesUploaded * 100) / file.size),
    99
  );
  return {
    totalFileBytesUploaded,
    percentage,
  };
});

const assignProgress100 = assign({
  percentage: () => 100,
});

const assignErrorMessage = assign({
  errorMessage: (context, event) =>
    event.payload.error?.message || "Upload error",
});

const assignAbortMessage = assign({
  errorMessage: () => "canceled",
});

const abortUpload = ({ uploadId }, event) =>
  uploadAPI.abortAndDeleteRequest(uploadId);

////////////////////////////////////////////////////////////////
// GUARDS
/* const warnAbort = () =>
  window.confirm(
    "This action will permanently delete the file upload. Your job will not be able to be computed. Are you sure?"
  ); */

export default createMachine({
  context: {
    file: null,
    fileId: "",
    uploadId: "",
    totalFileBytesUploaded: 0,
    percentage: 0,
    errorMessage: "", //filled only if an error occurs during the upload
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
        ABORT: {
          target: "aborted",
          //cond: "warnAbort",
          actions: ["abortUpload"],
        },
        ERROR: {
          target: "error",
          actions: [(context, event) => console.log(event)],
        },
        UPLOADED: {
          target: "uploaded",
        },
      },
    },
    uploaded: { type: "final", entry: ["assignProgress100"] },
    aborted: {
      type: "final",
      entry: [assignAbortMessage],
    },
    error: {
      type: "final",
      entry: [assignErrorMessage],
    },
    idle: {
      on: {
        RESUME: {
          target: "uploading",
        },
      },
    },
  },
}).withConfig({
  services: {
    uploadFile,
  },
  actions: {
    assignProgress,
    assignProgress100,
    assignErrorMessage,
    assignAbortMessage,
    abortUpload,
  },
  //guards: { warnAbort },
});
