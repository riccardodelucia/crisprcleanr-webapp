<template>
  <div class="container">
    <PrimaryHeader></PrimaryHeader>
    <main>
      <slot></slot>
    </main>
    <ht-footer>
      <div class="footer-content">
        <h2>CRISPRcleanR WebApp</h2>
        <router-link class="footer-link" :to="{ name: 'termsAndConditions' }"
          >Terms And Conditions</router-link
        >
        |
        <router-link class="footer-link" :to="{ name: 'termsDataProcessing' }"
          >Data Processing Policy</router-link
        >
      </div>
    </ht-footer>
  </div>
</template>

<script>
import PrimaryHeader from '@/components/PrimaryHeader.vue';

export default {
  name: 'WebLayout',
  components: { PrimaryHeader },
  setup() {
    return {};
  },
};
</script>

<style lang="postcss" scoped>
.container {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-rows: auto 1fr auto;
}

.footer-content {
  padding-block: var(--size-4);
  text-align: center;
  margin-bottom: var(--size-6);

  h2{
    font-size: var(--font-size-6);
  }
}

.footer-link {
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
}
</style>
