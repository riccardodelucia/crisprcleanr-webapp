<template>
  <div class="notification__bar card" :class="notificationClass">
    <div class="notification__close" @click="onClick"></div>
    <div class="notification__content">
      <h3 class="notification__title">{{ notification.title }}</h3>
      <p class="notification__message">{{ notification.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseNotificationBar",
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  computed: {
    notificationClass() {
      return `notification__bar--${this.notification.type}`;
    },
  },
  methods: {
    onClick() {
      this.$store.dispatch("notification/remove", this.notification);
    },
  },
};
</script>

<style>
</style>
