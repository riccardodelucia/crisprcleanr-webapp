<template>
  <ht-header :is-web="isWeb">
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
      <HTUser></HTUser>
    </template>
  </ht-header>
</template>

<script>
import getEnv from '@/utils/env.js';

const dashboardURL = getEnv('VITE_URL_IORIO_DASHBOARD');

export default {
  name: 'TheHeader',
  props: {
    isWeb: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { dashboardURL };
  },
};
</script>

<style scoped>
.logo-iorio {
  height: 5.5rem;
}
</style>
