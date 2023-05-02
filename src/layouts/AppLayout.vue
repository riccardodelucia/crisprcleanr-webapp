<template>
  <template v-if="!smallScreen">
    <div class="layout-grid">
      <TheHeader class="layout-grid__header"></TheHeader>
      <TheSidenav class="layout-grid__sidenav"></TheSidenav>
      <div class="layout-grid__content"><slot></slot></div>
    </div>
  </template>
  <template v-else>
    <div
      v-if="sidenavVisible"
      class="overlay"
      @click="manageSidenav(false)"
    ></div>
    <div class="layout-flex">
      <TheHeader
        :show-menu-button="true"
        @click="manageSidenav(true)"
      ></TheHeader>
      <div
        class="layout-flex__sidenav"
        :class="{ 'layout-flex__sidenav--visible': sidenavVisible }"
      >
        <TheSidenav></TheSidenav>
      </div>
      <div class="layout-flex__content"><slot></slot></div>
    </div>
  </template>
</template>

<script>
import { resizeListener } from '@computational-biology-sw-web-dev-unit/ht-vue';
import { ref } from 'vue';
import TheHeader from '@/components/TheHeader.vue';
import TheSidenav from '@/components/TheSidenav.vue';

export default {
  name: 'AppLayout',
  components: { TheHeader, TheSidenav },
  props: {
    sidenavObject: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const sidenavVisible = ref(false);
    const smallScreen = ref(false);

    resizeListener(() => {
      smallScreen.value = window.innerWidth < 1100;
    });

    const manageSidenav = (value) => {
      sidenavVisible.value = value;
    };

    return {
      sidenavVisible,
      manageSidenav,
      smallScreen,
    };
  },
};
</script>

<style lang="scss" scoped>
.layout-grid {
  min-height: 100vh;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr;

  &__header {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  &__sidenav {
    grid-column: 1 / 2;
    grid-row: 1 / -1;
  }

  &__content {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
}

.layout-flex {
  &__sidenav {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    transform: translateX(-20rem);

    &--visible {
      transform: none;
      transition: transform 0.2s ease-out;
    }
  }
}
</style>
