<template>
  <header class="header">
    <div
      class="header__content"
      :class="{ 'header__content--web': layout === 'web' }"
    >
      <a
        href="https://humantechnopole.it/en/"
        target="_blank"
        class="header__logo-link"
        ><img
          src="@/assets/logos/ht-logo-white.svg"
          alt="HT logo"
          class="header__logo header__logo--ht"
      /></a>
      <a
        href="https://humantechnopole.it/en/research-groups/iorio-group/"
        target="_blank"
        class="header__logo-link"
        ><img
          src="@/assets/logos/iorio-white.svg"
          alt="Iorio logo"
          class="header__logo header__logo--iorio"
      /></a>

      <nav>
        <router-link class="header__link" to="/dashboard"
          ><BaseIcon name="grid"
        /></router-link>
        <a
          v-if="!keycloak.authenticated"
          to="#"
          class="header__link"
          @click="login"
          >Sign in or Register</a
        >
        <User v-else></User>
      </nav>
    </div>
  </header>
</template>

<script>
import User from "@/components/User";

export default {
  name: "TheHeader",
  components: { User },
  inject: ["keycloak"],
  props: {
    layout: {
      type: String,
      default: "app",
    },
  },
  data() {
    return {
      currentUri: `${window.location.protocol}//${window.location.host}${this.$route.fullPath}`,
    };
  },
  methods: {
    login() {
      this.keycloak.login({ redirectUri: this.currentUri });
    },
  },
};
</script>

<style lang="scss">
.header {
  background-image: linear-gradient(
    to right,
    var(--color-gradient-blue-0) 0%,
    var(--color-gradient-blue-100) 5%,
    var(--color-gradient-green-0) 95%,
    var(--color-gradient-green-100) 100%
  );
  background-size: cover;
  background-repeat: no-repeat;

  &__content {
    justify-content: space-between;
    display: flex;
    padding: 1em 2em;

    gap: 2rem;
    flex-wrap: wrap;

    nav {
      display: flex;
      align-items: center;
      gap: 1em;
      margin-left: auto;
    }

    &--web {
      max-width: 150rem;
      margin: auto;
    }
  }

  &__logo {
    width: auto;

    &--ht {
      height: 4rem;
    }

    &--iorio {
      height: 5.5rem;
    }
  }

  &__logo-link {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  &__link {
    color: white;
    text-decoration: none;
    font-weight: 400;
    cursor: pointer;

    &:hover {
      color: var(--color-text-dark-blue);
      transition: color 0.3s ease-in-out;
    }
  }
}
</style>
