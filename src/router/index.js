import { createRouter, createWebHistory } from "vue-router";

import WebLayout from "@/views/layouts/WebLayout";
import AppLayout from "@/views/layouts/AppLayout";

import ViewTest from "@/views/ViewTest.vue";

import ViewHome from "@/views/ViewHome.vue";
import ViewSubmitJob from "@/views/ViewSubmitJob.vue";
import ViewResultsList from "@/views/ViewResultsList.vue";
import ViewResultsByID from "@/views/ViewResultsByID.vue";
import ViewTermsAndConditions from "@/views/ViewTermsAndConditions.vue";
import ViewTermsDataProcessing from "@/views/ViewTermsDataProcessing.vue";

import ViewMessagePage from "@/views/ViewMessagePage.vue";

import CcrAPI from "@/api/ccr.js";
import store from "../store";

// const dashboardURL = getEnv("VUE_APP_URL_IORIO_DASHBOARD");

const manageRouteError = (from, error, title) => {
  if (error?.response?.status === 404) return "/404"; //this translates into catchAll route
  const message = error?.message;
  store.dispatch("notification/sendErrorNotification", {
    title,
    message,
  });
  // when this is the first page visited on the app (e.g. copying the URL in the browser bar)
  if (from.name !== undefined) return false;
  return { name: "home" };
};

export const routes = [
  {
    path: "/test",
    component: ViewTest,
  },
  /* {
    path: "/dashboard",
    beforeEnter() {
      window.location.href = dashboardURL;
    },
  }, */
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/",
    component: WebLayout,
    children: [
      {
        path: "home",
        name: "home",
        component: ViewHome,
      },
      {
        path: "terms-and-conditions",
        name: "termsAndConditions",
        component: ViewTermsAndConditions,
      },
      {
        path: "terms-data-processing",
        name: "termsDataProcessing",
        component: ViewTermsDataProcessing,
      },
    ],
  },
  {
    path: "/submit",
    meta: {
      requiresAuth: true,
    },
    component: AppLayout,
    children: [
      {
        path: "",
        name: "submit",
        component: ViewSubmitJob,
      },
    ],
  },
  {
    path: "/jobs",
    component: AppLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "resultsList",
        component: ViewResultsList,
        props: true,
        beforeEnter(to, from) {
          return CcrAPI.getResultsList()
            .then((response) => {
              to.params.results = response.data;
              return true;
            })
            .catch((error) =>
              manageRouteError(
                from,
                error,
                "Unable to load job results list from server"
              )
            );
        },
      },
      {
        path: ":id",
        name: "resultsId",
        component: ViewResultsByID,
        props: true,
        beforeEnter(to, from) {
          return CcrAPI.getResultByID(to.params.id)
            .then((response) => {
              to.params.result = response.data;
              return true;
            })
            .catch((error) =>
              manageRouteError(
                from,
                error,
                `Unable to load results data for job ${to.params.id}`
              )
            );
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: ViewMessagePage,
    beforeEnter(to) {
      to.params.title = "Not found 🔍";
      to.params.message = "The content you're looking for is not there.";
      return;
    },
    props: true,
  },
];

export const getRouter = function () {
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });

  router.beforeEach((to, from) => {
    store.dispatch("progressBar/increase");
    CcrAPI.abortAndDeleteAllRequests(from.fullPath);
  });

  router.afterEach(() => {
    store.dispatch("progressBar/decrease");
  });

  return router;
};
