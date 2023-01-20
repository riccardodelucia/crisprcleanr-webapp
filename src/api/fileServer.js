import getEnv from '@/utils/env.js';

import { ConnectionManager } from '@computational-biology-web-unit/ht-vue/api';

import auth from '@/authentication/index.js';

const baseURL = `${getEnv('VITE_URL_IORIO_CCR_FILESERVER')}`;

const connectionManager = new ConnectionManager(baseURL, auth);

export default {
  abortAndDeleteRequest(requestId) {
    return connectionManager.abortAndDeleteRequest(requestId);
  },
  getUploadSetup(file, objectKey) {
    const request = connectionManager.getRequest(objectKey);

    const config = ConnectionManager.makeFileUploadConfig({
      file,
      url: 'upload/',
    });
    config.headers['X-Object-Key'] = objectKey;

    return { request, config };
  },
  downloadFile({ objectKey, blob = false }) {
    const options = { url: 'download/', params: { 'object-key': objectKey } };
    if (blob) options.responseType = 'blob';
    return connectionManager.sendRequest(options);
  },
};
