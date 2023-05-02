import getEnv from '@/utils/env.js';
import axios from 'axios';

import { interceptorAuthorize } from '../authentication/index.js';
import { interceptorCamelize } from '@computational-biology-sw-web-dev-unit/ht-vue';

const baseURL = `${getEnv('VITE_URL_IORIO_CCR_BACKEND')}`;
const connectionTimeout = `${getEnv('VITE_CONNECTION_TIMEOUT_MS')}`;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(interceptorAuthorize);
instance.interceptors.response.use(interceptorCamelize);

export default {
  submitJob(formData) {
    return instance({
      method: 'post',
      url: 'jobs/',
      data: formData,
    });
  },
  getResultsList() {
    return instance({
      method: 'get',
      url: 'jobs/',
      connectionTimeout,
    });
  },
  getResultByID(id) {
    return instance({
      method: 'get',
      url: `jobs/${id}`,
      connectionTimeout,
    });
  },
  getStaticResource(resource) {
    return instance({
      method: 'get',
      url: `/static/${resource}`,
      responseType: 'blob',
      connectionTimeout,
    });
  },
};
