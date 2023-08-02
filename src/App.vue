<template>
  <router-view />
  <div class="fixed-container ht-layout-stack">
    <div>
      <ht-toast v-for="({ type, title, message, id }, idx) in notifications" :key="idx" :type="type" :title="title"
        :toast-id="id" @close-notification="onCloseNotification">
        <p>{{ message }}</p>
      </ht-toast>
    </div>
    <div v-if="uploads.length > 0" class="ht-layout-stack">
      <ht-file-upload-controller v-for="upload in uploads" :key="upload.id" class="upload-controller" :upload="upload"
        @remove-upload="onRemoveUpload">
      </ht-file-upload-controller>
    </div>
  </div>
</template>

<script>
import { uploads, removeFileUpload } from './uploads';
import {
  notifications,
  removeNotification,
} from '@computational-biology-sw-web-dev-unit/ht-vue';

export default {
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

<style lang="postcss" scoped>
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
</style>
