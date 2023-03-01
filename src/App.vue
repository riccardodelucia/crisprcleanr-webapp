<template>
  <div>
    <router-view />
    <div class="notifications-container">
      <ht-notifications
        :notifications="notifications"
        @remove-notification="onRemoveNotification"
      />
      <ht-file-uploads :uploads="uploads" @remove-upload="onRemoveUpload" />
    </div>
  </div>
</template>

<script>
import { uploads, removeFileUpload } from './uploads';
import { notifications, removeNotification } from './notifications';

export default {
  data() {
    return { uploads, notifications };
  },
  methods: {
    onRemoveUpload(upload) {
      removeFileUpload(upload);
    },
    onRemoveNotification(notification) {
      removeNotification(notification);
    },
  },
};
</script>
