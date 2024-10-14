<template>
  <ht-header-web class="header">
    <nav class="header__nav">
      <a
        href="https://humantechnopole.it/en/research-groups/iorio-group/"
        target="_blank"
        ><img :src="logo" alt="Iorio logo" class="header__logo"
      /></a>
      <ht-theme-switcher></ht-theme-switcher>
      <ht-user></ht-user>
    </nav>
  </ht-header-web>
</template>

<script>
import logo from '@/assets/logos/iorio-logo-white.svg';

export default {
  name: 'PrimaryHeader',

  setup() {
    return {
      logo,
    };
  },
};
</script>

<style lang="postcss" scoped>
.header {
  &__logo {
    height: 3rem;
  }

  &__nav {
    display: grid;
    grid-template-areas:
      'logo'
      'theme'
      'user';

    grid-row-gap: var(--size-3);
    justify-items: center;
    align-items: center;

    padding-block: var(--size-3);

    & > *:first-child {
      grid-area: logo;
    }

    & > *:nth-child(2) {
      grid-area: theme;
    }

    & > *:last-child {
      grid-area: user;
    }

    @media (min-width: 50em) {
      grid-template-areas: 'logo theme user';
      grid-template-columns: 1fr repeat(2, max-content);
      grid-column-gap: var(--size-3);

      & > *:first-child {
        justify-self: start;
      }
    }
  }
}
</style>
