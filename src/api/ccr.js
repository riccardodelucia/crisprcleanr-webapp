import { getEnv } from '@/utils.js';
import axios from 'axios';

import { interceptorAuthorize } from '@/authentication.js';
import { interceptorCamelize } from '../utils.js';

const baseURL = `${getEnv('VITE_URL_IORIO_CCR_BACKEND')}`;
const connectionTimeout = `${getEnv('VITE_CONNECTION_TIMEOUT_MS')}`;

const protectedInstance = axios.create({
  baseURL,
});

const instance = axios.create({
  baseURL,
});

protectedInstance.interceptors.request.use(interceptorAuthorize);
protectedInstance.interceptors.response.use(interceptorCamelize);

instance.interceptors.response.use(interceptorCamelize);

export default {
  submitJob(formData) {
    return protectedInstance({
      method: 'post',
      url: 'jobs/',
      data: formData,
    });
  },
  getResultsList() {
    return protectedInstance({
      method: 'get',
      url: 'jobs/',
      connectionTimeout,
    });
  },
  getResultByID(id) {
    return protectedInstance({
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
