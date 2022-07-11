<template>
  <div class="notification">
    <BaseNotificationBar v-for="notification in notifications" :key="notification.storeItemId"
      :notification="notification">
    </BaseNotificationBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "BaseNotificationContainer",
  computed: {
    ...mapState("notification", ["notifications"]),
  },
};
</script>
