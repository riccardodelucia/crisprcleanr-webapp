import { createMachine, assign } from "xstate";
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

    uploadAPI.uploadFile({
      file,
      id,
      jobId,
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

const abortUpload = (context, event) =>
  uploadAPI.abortAndDeleteRequest(context.id);

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
        ABORT: {
          target: "aborted",
          cond: "warnAbort",
          actions: ["abortUpload"],
        },
        ERROR: { target: "error" },
        UPLOADED: {
          target: "uploaded",
        },
      },
    },
    uploaded: { type: "final", entry: ["assignProgress100"] },
    aborted: {
      type: "final",
      entry: [() => console.log("upload aborted")],
    },
    error: {
      type: "final",
      entry: [() => console.log("upload error")],
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
  actions: { assignProgress, assignProgress100, abortUpload },
  guards: { warnAbort },
});
