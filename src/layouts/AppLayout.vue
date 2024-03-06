<template>
  <ht-layout-app sidenav-title="CRISPRcleanR">
    <template #sidenav-list>
      <li class="sidenav-link">
        <RouterLink active-class="active" to="/home">
          <VueFeather type="home"></VueFeather><span>Home</span>
        </RouterLink>
      </li>
      <li class="sidenav-link">
        <RouterLink active-class="active" to="/submit">
          <VueFeather type="upload"></VueFeather><span>Submit</span>
        </RouterLink>
      </li>
      <li class="sidenav-link">
        <RouterLink active-class="active" to="/jobs">
          <VueFeather type="eye"></VueFeather><span>Results</span>
        </RouterLink>
      </li>
    </template>
    <template #header>
      <ul class="ht-reset ht-flex">
        <li>
          <ht-theme-switcher></ht-theme-switcher>
        </li>
        <li><ht-user></ht-user></li>
      </ul>
    </template>
    <slot></slot>
  </ht-layout-app>
</template>

<script>
import VueFeather from 'vue-feather';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppLayout',
  components: { VueFeather, RouterLink },
};
</script>

<style lang="postcss" scoped>
.sidenav-link {
  margin-bottom: var(--size-1);
}

.sidenav-link > a {
  display: flex;
  align-items: center;
  padding: var(--size-2);
  gap: var(--size-3);
  cursor: pointer;
  color: white;
  text-decoration: none;

  &.active {
    background-color: var(--ht-color-secondary);
  }

  &:not(.active):hover {
    background-color: var(--ht-color-secondary);
  }

  &:not(.active):hover span {
    transform: translateX(0.5em);
  }

  & > span {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
