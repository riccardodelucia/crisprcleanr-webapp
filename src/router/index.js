import { createRouter, createWebHistory } from 'vue-router';

import ViewHome from '@/views/ViewHome.vue';
import ViewSubmitJob from '@/views/ViewSubmitJob.vue';
import ViewResultsList from '@/views/ViewResultsList.vue';
import ViewResultsByID from '@/views/ViewResultsByID.vue';
import ViewTermsAndConditions from '@/views/ViewTermsAndConditions.vue';
import ViewTermsDataProcessing from '@/views/ViewTermsDataProcessing.vue';

import View404NotFound from '@/views/View404NotFound.vue';

import { authorize } from '@/authentication.js';

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
      },
      {
        path: ':id',
        name: 'resultsId',
        component: ViewResultsByID,
        props: true,
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: View404NotFound,
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
