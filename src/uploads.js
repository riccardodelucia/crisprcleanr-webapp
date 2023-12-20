import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import fileServerAPI from '@/api/fileServer.js';

export function addFileUpload(upload) {
  if (upload.errorMessage) {
    uploads.value.push({ ...upload, id: uuidv4() });
  } else {
    const { instance, config, controller } = fileServerAPI.setupUpload(
      upload.file,
      upload.fileObject.objectKey
    );
    uploads.value.push({
      ...upload,
      instance,
      config,
      controller,
      id: uuidv4(),
    });
  }
}

export function removeFileUpload({ id }) {
  uploads.value = uploads.value.filter((upload) => upload.id !== id);
}

export const uploads = ref([]);
