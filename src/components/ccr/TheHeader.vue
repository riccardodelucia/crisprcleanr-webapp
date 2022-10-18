<template>
  <BaseHeader>
    <template v-slot:logo
      ><a
        href="https://humantechnopole.it/en/research-groups/iorio-group/"
        target="_blank"
        class="header__logo-link"
        ><img
          src="@/assets/logos/iorio-logo-white.svg"
          alt="Iorio logo"
          class="header__logo logo-iorio" /></a
    ></template>
    <template v-slot:nav>
      <a :href="dashboardURL" target="_blank" class="header__link">
        <BaseIcon name="grid" />
      </a>
      <!--             <router-link class="header__link" to="/dashboard">

            </router-link> -->
      <a v-if="!authenticated" to="#" class="header__link" @click="loginUser"
        >Sign in or Register</a
      >
      <BaseUser v-else></BaseUser>
    </template>
  </BaseHeader>
</template>

<script>
import getEnv from "@/utils/env";

const dashboardURL = getEnv("VUE_APP_URL_IORIO_DASHBOARD");

export default {
  name: "TheHeader",
  props: {
    sidenavObject: {
      type: Object,
    },
  },
  inject: ["login", "authenticated"],
  methods: {
    loginUser() {
      this.login(this.$route.fullPath);
    },
  },
  data() {
    return { dashboardURL };
  },
};
</script>

<style lang="scss" scoped>
.logo-iorio {
  height: 5.5rem;
}
</style>
