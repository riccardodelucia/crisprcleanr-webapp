<template>
  <footer class="footer">
    <img
      src="@/assets/logos/ht-logo-white.svg"
      alt="HT logo"
      class="footer__logo"
    />
    <div class="footer__address">
      Fondazione Human Technopole - Viale Rita Levi-Montalcini, 1 - Area MIND –
      Cargo 6 - 20157 Milano Italy - C.F. 97821360159
    </div>
  </footer>
</template>

<script>
export default {
  name: "TheFooter",
};
</script>

<style lang="scss">
.footer {
  background-color: var(--color-blue-light);

  &__logo {
    padding: 2em 3em 0.5em 3em;
    margin: auto;

    display: block;
    width: 30rem;
  }

  &__address {
    padding: 0.5em 3em 2em 3em;
    color: #fff;
    text-align: center;
  }
}
</style>
