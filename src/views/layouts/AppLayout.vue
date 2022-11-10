<template>
  <div class="layout layout--app">
    <BaseSidenav :sidenav-object="sidenavObject"></BaseSidenav>
    <TheHeader></TheHeader>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import sidenavObject from '@/sidenav.json';

import TheHeader from '@/components/ccr/TheHeader.vue';

export default {
  name: 'AppLayout',
  components: { TheHeader },
  data() {
    return { sidenavObject };
  },
};
</script>

<style lang="scss" scoped></style>
