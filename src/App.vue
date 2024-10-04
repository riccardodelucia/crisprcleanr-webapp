<template>
  <router-view />
  <div class="fixed-container ht-layout-stack">
    <ht-toast
      v-for="({ type, title, message, id }, idx) in notifications"
      :key="idx"
      :type="type"
      :title="title"
      :toast-id="id"
      @close-notification="onCloseNotification"
    >
      <p>{{ message }}</p>
    </ht-toast>
    <template v-if="uploads.length > 0">
      <div class="ht-card ht-container">
        <FileUploadController
          v-for="upload in uploads"
          :key="upload.id"
          class="upload-controller"
          :upload="upload"
          @remove-upload="onRemoveUpload"
        >
        </FileUploadController>
      </div>
    </template>
  </div>
</template>

<script>
import { uploads, removeFileUpload } from './uploads';
import { notifications, removeNotification } from '@nf-data-iu3/ht-vue';

import FileUploadController from './components/FileUploadController.vue';

export default {
  components: { FileUploadController },
  data() {
    return { uploads, notifications };
  },

  methods: {
    onRemoveUpload(upload) {
      removeFileUpload(upload);
    },
    onCloseNotification(notification) {
      removeNotification(notification);
    },
  },
};
</script>

<style lang="postcss">
.fixed-container {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: var(--size-3);
  width: 25%;

  @media only screen and (max-width: 700px) {
    width: 100%;
  }
}

.upload-controller {
  --background-color: var(--ht-surface-2);
}

.ht-card {
  box-shadow: var(--shadow-3);
}

.toggle-switch-container {
  width: 12rem;
}

.app-content {
  padding: var(--size-4);
  overflow-x: scroll;
}

#main {
  overflow-x: scroll;
}
</style>
