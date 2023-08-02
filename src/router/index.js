import { createRouter, createWebHistory } from 'vue-router';

import ViewHome from '@/views/ViewHome.vue';
import ViewSubmitJob from '@/views/ViewSubmitJob.vue';
import ViewResultsList from '@/views/ViewResultsList.vue';
import ViewResultsByID from '@/views/ViewResultsByID.vue';
import ViewTermsAndConditions from '@/views/ViewTermsAndConditions.vue';
import ViewTermsDataProcessing from '@/views/ViewTermsDataProcessing.vue';

import View404NotFound from '@/views/View404NotFound.vue';

import CcrAPI from '@/api/ccr.js';

import { authorize, getAuth } from '@/authentication/index.js';

import fileServerAPI from '@/api/fileServer.js';

import { sendErrorNotification } from '@computational-biology-sw-web-dev-unit/ht-vue';

import { parseErrorMesssage } from '@computational-biology-sw-web-dev-unit/ht-vue';

import nProgress from 'nprogress';

import imageList from '@/images.json';

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
          const id = to.params.id;
          const auth = getAuth();
          const username = auth.userProfile.username;
          let result, genesSignatures, images;
          return CcrAPI.getResultByID(to.params.id)
            .then((response) => {
              result = response.data;
              to.params.result = result;
              if (result.status === 'success') {
                const objectKey = `/${username}/${id}/genes_signatures.json`;
                return fileServerAPI
                  .downloadFile({ objectKey })
                  .then((response) => {
                    genesSignatures = response.data;
                    to.params.genesSignatures = genesSignatures;
                    const imageListWithURL = imageList.map(async (image) => {
                      try {
                        const objectKey = `/${username}/${id}/${image.imgUri}`;
                        const response = await fileServerAPI.downloadFile({
                          objectKey,
                          blob: true,
                        });
                        return {
                          ...image,
                          src: URL.createObjectURL(response.data),
                        };
                      } catch (error) {
                        return {
                          ...image,
                          src: null,
                        };
                      }
                    });
                    return Promise.all(imageListWithURL);
                  })
                  .then((response) => {
                    images = response;
                    to.params.images = images;
                    return true;
                  });
              }
              return true;
            })
            .catch((error) => {
              manageRouteError(
                from,
                error,
                `Unable to load results data for job ${to.params.id}`
              );
              return false;
            });
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

router.beforeEach((to, from) => {
  // TODO investigate why this happens
  // Because vue-router triggers navigation to the same /jobs route twice
  if (to.path === from.path) {
    return false;
  }

  nProgress.start();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const appRootUrl = window.location.origin;
    const redirectUri = new URL(to.path, appRootUrl).toString();
    return authorize(redirectUri).then(() => true);
  }
  // This page did not require authentication
  return;
});

router.afterEach(() => {
  nProgress.done();
});

export default router;
