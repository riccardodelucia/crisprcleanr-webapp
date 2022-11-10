<template>
  <BaseHeader>
    <template #logo
      ><a
        href="https://humantechnopole.it/en/research-groups/iorio-group/"
        target="_blank"
        class="header__logo-link"
        ><img
          src="@/assets/logos/iorio-logo-white.svg"
          alt="Iorio logo"
          class="header__logo logo-iorio" /></a
    ></template>
    <template #nav>
      <a :href="dashboardURL" target="_blank" class="header__link">
        <vue-feather type="grid" />
      </a>
      <a v-if="!authenticated" to="#" class="header__link" @click="loginUser"
        >Sign in or Register</a
      >
      <BaseUser v-else></BaseUser>
    </template>
  </BaseHeader>
</template>

<script>
import getEnv from '@/utils/env';

const dashboardURL = getEnv('VITE_URL_IORIO_DASHBOARD');

export default {
  name: 'TheHeader',
  inject: ['login', 'authenticated'],
  props: {
    sidenavObject: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { dashboardURL };
  },
  methods: {
    loginUser() {
      this.login(this.$route.fullPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.logo-iorio {
  height: 5.5rem;
}
</style>
