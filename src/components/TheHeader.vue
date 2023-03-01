<template>
  <ht-header :is-web="isWeb" :show-menu-button="showMenuButton">
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
      <div class="header-nav">
        <a :href="dashboardURL" target="_blank" class="link">
          <vue-feather type="grid" />
        </a>
        <ht-user :auth="auth"></ht-user>
      </div>
    </template>
  </ht-header>
</template>

<script>
import getEnv from '@/utils/env.js';

import { useAuth } from '../authentication/index.js';

const dashboardURL = getEnv('VITE_URL_IORIO_DASHBOARD');

export default {
  name: 'TheHeader',
  props: {
    isWeb: {
      type: Boolean,
      default: false,
    },
    showMenuButton: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const auth = useAuth();
    return { dashboardURL, auth };
  },
};
</script>

<style scoped>
.logo-iorio {
  height: 5.5rem;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}
</style>
