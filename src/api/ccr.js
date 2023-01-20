import getEnv from '@/utils/env.js';
import { ConnectionManager } from '@computational-biology-web-unit/ht-vue/api';
import auth from '@/authentication/index.js';

const baseURL = `${getEnv('VITE_URL_IORIO_CCR_BACKEND')}`;
const connectionTimeout = `${getEnv('VITE_CONNECTION_TIMEOUT_MS')}`;

const connectionManager = new ConnectionManager(baseURL, auth);

export default {
  abortAndDeleteRequest(requestId) {
    return connectionManager.abortAndDeleteRequest(requestId);
  },
  submitJob(formData) {
    return connectionManager.sendRequest({
      method: 'post',
      url: 'jobs/',
      data: formData,
    });
  },
  getResultsList() {
    return connectionManager.sendRequest({
      method: 'get',
      url: 'jobs/',
      connectionTimeout,
    });
  },
  getResultByID(id) {
    return connectionManager.sendRequest({
      method: 'get',
      url: `jobs/${id}`,
      connectionTimeout,
    });
  },
  getStaticResource(resource) {
    return connectionManager.sendRequest({
      method: 'get',
      url: `/static/${resource}`,
      responseType: 'blob',
      connectionTimeout,
    });
  },
};
