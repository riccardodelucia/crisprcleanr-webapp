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
import getEnv from "@/utils/env";
import NProgress from "nprogress";
import store from "../store";

const dashboardURL = getEnv("VUE_APP_URL_GROUPS_DASHBOARDS");

const manageRouteError = (from, error, message) => {
  if (error?.response?.status === 404) return "/inexistent-address"; //this translates into catchAll route
  store.dispatch("notification/add", {
    type: "error",
    title: "Something went wrong... 💥",
    message,
    timeout: 5,
  });
  NProgress.done();
  if (from.name !== undefined) return false;
  return { name: "home" };
};

export const routes = [
  {
    path: "/test",
    component: ViewTest,
  },
  {
    path: "/dashboard",
    beforeEnter() {
      window.location.href = dashboardURL;
    },
  },
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
        beforeEnter(to, from) {
          //ALWAYS REMEMBER TO RETURN THE PROMISE TO MAKE THE ROUTE GUARD WAIT FOR THE PROMISE RESULT!!!!
          return CcrAPI.getStaticResource("job_config.json")
            .then((response) => {
              to.params.config = response.data;
              return true;
            })
            .catch((error) =>
              //THIS ALSO NEEDS TO RETURN THE manageRoute METHOD!!!
              manageRouteError(
                from,
                error,
                "Unable to load job submission form"
              )
            );
        },
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
    NProgress.start();
    CcrAPI.abortAndDeleteAllRequests(from.fullPath);
  });

  router.afterEach(() => {
    NProgress.done();
  });

  return router;
};
