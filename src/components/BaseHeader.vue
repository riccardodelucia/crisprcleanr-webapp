<template>
  <header class="header">
    <a href="https://humantechnopole.it/en/" target="_blank" class="header__logo-link"><img
        src="@/assets/logos/ht-logo-white.svg" alt="HT logo" class="header__logo" /></a>
    <slot name="logo"></slot>
    <nav class="header__nav">
      <slot name="nav"></slot>
    </nav>
  </header>
</template>

<script>

export default {
  name: "BaseHeader",
};
</script>

<style lang="scss">
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  min-height: 9.5rem;
  padding: 1em 2em;

  gap: 2rem;

  &__nav {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  &__logo {
    width: auto;
    height: 4rem;
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
