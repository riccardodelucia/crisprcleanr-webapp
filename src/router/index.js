import { createRouter, createWebHistory } from 'vue-router';

import ViewHome from '@/views/ViewHome.vue';
import ViewSubmitJob from '@/views/ViewSubmitJob.vue';
import ViewResultsList from '@/views/ViewResultsList.vue';
import ViewResultsByID from '@/views/ViewResultsByID.vue';
import ViewTermsAndConditions from '@/views/ViewTermsAndConditions.vue';
import ViewTermsDataProcessing from '@/views/ViewTermsDataProcessing.vue';

import View404NotFound from '@/views/View404NotFound.vue';

import CcrAPI from '@/api/ccr.js';

import { authorize } from '@/authentication/index.js';
import { sendErrorNotification } from '../notifications';

import { parseErrorMesssage } from '@computational-biology-web-unit/ht-vue';

const manageRouteError = (from, error, title) => {
  if (error?.response?.status === 404) return '/404'; //this translates into catchAll route
  const message = parseErrorMesssage(error);
  sendErrorNotification({
    title,
    message,
  });
  // when this is the first page visited on the app (e.g. copying the URL in the browser bar)
  if (from.name !== undefined) return false;
  return { name: 'home' };
};

const routes = [
  {
    path: '/home',
    alias: '/',
    name: 'home',
    component: ViewHome,
  },
  {
    path: '/terms-and-conditions',
    name: 'termsAndConditions',
    component: ViewTermsAndConditions,
  },
  {
    path: '/terms-data-processing',
    name: 'termsDataProcessing',
    component: ViewTermsDataProcessing,
  },
  {
    path: '/submit',
    name: 'submit',
    meta: {
      requiresAuth: true,
    },
    component: ViewSubmitJob,
  },
  {
    path: '/jobs',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'resultsList',
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
                'Unable to load job results list from server'
              )
            );
        },
      },
      {
        path: ':id',
        name: 'resultsId',
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
    path: '/:catchAll(.*)',
    name: '404',
    component: View404NotFound,
    beforeEnter(to) {
      to.params.title = 'Not found 🔍';
      to.params.message = "The content you're looking for is not there.";
      return;
    },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const appRootUrl = window.location.origin;
    const redirectUri = new URL(to.path, appRootUrl).toString();
    return authorize(redirectUri).then(() => true);
  }
  // This page did not require authentication
  return;
});

export default router;
