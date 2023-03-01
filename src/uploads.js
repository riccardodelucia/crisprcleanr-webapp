import { ref, inject } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export function useUploads() {
  return inject('uploads');
}

export function addFileUpload(upload) {
  uploads.value.push({ ...upload, id: uuidv4() });
}

export function removeFileUpload({ id }) {
  uploads.value = uploads.value.filter((upload) => upload.id !== id);
}

export const uploads = ref([]);
