import { createMachine, assign } from "xstate";
import CcrAPI from "@/api/ccr.js";
import store from "@/store";

export const submitJobMachine = createMachine({
  id: "submitJob",
  context: {
    submittedJob: {},
  },
  initial: "idle",
  states: {
    idle: {
      //entry: "resetContext", // if enabled, send success notification reads an undefined id...
      on: { SUBMIT: { target: "submitting", cond: "confirmSubmission" } },
    },
    submitting: {
      invoke: {
        src: (context, payload) => {
          return CcrAPI.submitJob(payload);
        },
        // resolved promise
        onDone: {
          target: "success",
          actions: "assignSubmittedJob",
        },
        // rejected promise
        onError: {
          target: "error",
        },
      },
    },
    success: {
      entry: "sendSuccessNotification",
      always: { target: "idle" },
    },
    error: {
      entry: "sendErrorNotification",
      always: { target: "idle" },
    },
  },
}).withConfig({
  actions: {
    assignSubmittedJob: assign({
      submittedJob: (context, event) => {
        return event.data.data;
      },
    }),
    resetContext: assign({
      submittedJob: () => ({}),
    }),
    sendErrorNotification: (context, event) => {
      store.dispatch("notification/add", {
        type: "error",
        title: "Submission Error",
        message: event.data.message,
      });
    },
    sendSuccessNotification: (context) => {
      store.dispatch("notification/add", {
        type: "success",
        title: "Job Submitted",
        message: `Job ID: ${context.submittedJob.id}`,
      });
    },
  },
  guards: {
    confirmSubmission: () => window.confirm("Do you want to submit your job?"),
  },
});
