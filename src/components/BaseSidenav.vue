<template>
  <div v-if="collapsible" class="sidenav-controller">
    <div class="sidenav-controller__menu" @click="manageSidenav(true)">
      <div class="menu__item"></div>
    </div>
  </div>
  <div v-if="showSideNav && collapsible" class="overlay" @click="manageSidenav(false)"></div>

  <nav class="sidenav" :class="{
    'sidenav--collapsible': collapsible,
    'sidenav--active': showSideNav,
  }">
    <div class="sidenav__title">{{ sidenavObject.title }}</div>
    <ul class="sidenav__list">
      <li v-for="link in sidenavObject.links" class="sidenav__item" :key="link.id" @click="linkClick(link.url)"
        :class="{ 'sidenav__item--active': $route.path.includes(link.url) }">
        <span class="sidenav__label">{{ link.label }}</span>
      </li>
    </ul>
    <div v-if="collapsible" class="sidenav__close" @click="manageSidenav(false)">
      <span>hide</span>
      <BaseIcon name="chevrons-left"></BaseIcon>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { resizeListener } from "@/composables/utilities.js";

export default {
  name: "TheSidenav",
  props: {
    sidenavObject: {
      type: Object,
      required: true
    }
  },
  setup() {
    const router = useRouter();

    const collapsible = ref(false);
    const showSideNav = ref(false);

    resizeListener(() => (collapsible.value = window.innerWidth < 1100));

    const manageSidenav = (value) => {
      showSideNav.value = value;
      const body = document.querySelector("body");
      body.style.overflow = value ? "hidden" : "auto";
    };

    const linkClick = (url) => {
      if (collapsible.value) manageSidenav(false);

      router.push(url);
    };

    return {
      collapsible,
      showSideNav,
      linkClick,
      manageSidenav,
    };
  },
};
</script>

<style lang="scss">
.sidenav-controller {
  background-color: var(--color-blue);
  color: white;

  &__menu {
    cursor: pointer;
    width: 4rem;
    height: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2em 1em 0 1em;

    @media only screen and (max-width: 600px) {
      margin: 0.5em 0 0.5em 2em;
    }

    .menu__item {
      height: 2px;
      background-color: white;

      &:before,
      &:after {
        content: "";
        display: block;
        height: 2px;
      }

      &:before {
        background-color: white;
        transform: translateY(-1.2rem);
      }

      &:after {
        background-color: white;
        transform: translateY(1rem);
      }
    }
  }
}

.sidenav {
  width: 20rem;
  background-color: var(--color-blue);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding: 1em 0;

  &--collapsible {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    transform: translateX(-20rem);
    transition: transform 0.2s ease-out;
  }

  &--active {
    transform: none;
  }

  &__close {
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    font-size: 2.5rem;
  }

  &__title {
    font-weight: bold;
    color: white;
  }

  &__label {
    transition: transform 0.3s ease-in-out;
  }

  &__list {
    font-size: 1.8rem;
    list-style: none;
    font-weight: 400;
    align-self: stretch;
    margin-bottom: auto;
  }

  &__item {
    &--active {
      background-color: var(--color-green-lighter);
    }

    padding: 0.2em 0.3em;

    * {
      display: block;
      width: 100%;
      color: white;
      text-decoration: none;
      padding: 1rem 2rem;
    }

    &:not(:last-child) {
      margin-bottom: 0.2em;
    }

    &:hover,
    &:focus {
      cursor: pointer;
      background-color: var(--color-green-lighter);

      .sidenav__label {
        transform: translateX(0.5em);
        transition: transform 0.3s ease-in-out;
      }
    }
  }
}
</style>
