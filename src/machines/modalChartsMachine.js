import { createMachine, assign } from "xstate";
import CcrAPI from "@/api/ccr.js";

export const modalChartsMachine = createMachine({
  id: "modalChartsMachine",
  initial: "closed",
  context: {
    jobId: "",
    image: {},
    data: {},
    component: "",
  },
  states: {
    closed: {
      on: { OPEN: { target: "fetching" } },
    },
    fetching: {
      entry: "assignChartDetails",
      invoke: {
        src: ({ jobId, image }) => {
          return CcrAPI.getChart({
            id: jobId,
            chart: image.chart,
          });
        },
        onDone: {
          target: "opened",
          actions: "assignChartData",
        },
        // resolved promise

        // rejected promise
        onError: {
          target: "error",
        },
      },
    },
    opened: {
      on: {
        CLOSE: { target: "closed" },
      },
    },
    error: {
      on: {
        OPEN: { target: "fetching" },
        CLOSE: { target: "closed" },
      },
    },
  },
}).withConfig({
  actions: {
    assignChartDetails: assign({
      jobId: (context, event) => event.jobId,
      image: (context, event) => event.image,
      component: (context, event) => event.component,
    }),
    assignChartData: assign({ data: (context, event) => event.data.data }),
  },
});
