import { getEnv } from '@/utils.js';

import axios from 'axios';

import { interceptorAuthorize } from '@/authentication/index.js';
import { interceptorCamelize } from '@computational-biology-sw-web-dev-unit/ht-vue';

const baseURL = `${getEnv('VITE_URL_IORIO_CCR_FILESERVER')}`;

export default {
  setupUpload(file, objectKey) {
    const controller = new AbortController();

    // cannot setup a timeout on upload , otherwise large file uploads get canceled
    const instance = axios.create({
      signal: controller.signal,
      baseURL,
    });

    instance.interceptors.request.use(interceptorAuthorize);

    const formData = new FormData();
    formData.append('file', file, file.name);
    const config = {
      url: 'upload/',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Range': `bytes=0-${file.size}/${file.size}`,
        'X-Object-Key': objectKey,
      },
    };

    return {
      controller,
      instance,
      config,
    };
  },
  downloadFile({ objectKey, blob = false }) {
    const instance = axios.create({
      baseURL,
    });
    instance.interceptors.request.use(interceptorAuthorize);
    instance.interceptors.response.use(interceptorCamelize);

    const options = { url: 'download/', params: { 'object-key': objectKey } };
    if (blob) options.responseType = 'blob';
    return instance(options);
  },
};
