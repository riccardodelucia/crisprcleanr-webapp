import { createRouter, createWebHistory } from "vue-router";

import WebLayout from "@/views/layouts/WebLayout";
import AppLayout from "@/views/layouts/AppLayout";

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

const dashboardURL = getEnv("VUE_APP_DASHBOARD");

export const routes = [
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
        beforeEnter: (to, from, next) => {
          return CcrAPI.getStaticResource("job_config.json")
            .then((response) => {
              to.params.config = response.data;
              next();
            })
            .catch((error) => {
              next({ name: "error", params: { message: error } });
            });
        },
      },
    ],
  },
  {
    path: "/jobs",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "resultsList",
        component: ViewResultsList,
        meta: {
          requiresAuth: true,
        },
        props: true,
        beforeEnter(to, from, next) {
          CcrAPI.getResultsList()
            .then((response) => {
              to.params.results = response.data;
              next();
            })
            .catch((error) => {
              next({ name: "error", params: { message: error } });
            });
        },
      },
      {
        path: ":id",
        name: "resultsId",
        component: ViewResultsByID,
        meta: {
          requiresAuth: true,
        },
        props: true,
        beforeEnter(to, from, next) {
          CcrAPI.getResultByID(to.params.id)
            .then((response) => {
              to.params.result = response.data;
              next();
            })
            .catch((error) => {
              if (error.response) {
                switch (error.response.status) {
                  case 404:
                    next("/404");
                    break;
                  default:
                    next({ name: "error" });
                    break;
                }
              } else next({ name: "error" });
            });
        },
      },
    ],
  },

  {
    path: "/error",
    name: "error",
    component: ViewMessagePage,
    beforeEnter(to) {
      to.params.title = "Something went wrong... 💥";
      return;
    },
    props: true,
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

  // standard beforeEach handlers we want to setup
  router.beforeEach(() => {
    NProgress.start();
  });

  router.afterEach(() => {
    NProgress.done();
  });

  return router;
};
