<template>
  <div class="message-page ht-skin-brand-gradient">
    <h2>Not found 🔍</h2>
    <p>The content you're looking for is not there.</p>
    <router-link :to="{ name: 'home' }" class="ht-button">
      Back to Home
    </router-link>
  </div>
</template>

<script>
export default {
  title: 'Message Page',
  name: 'View404NotFound',
};
</script>

<style lang="postcss" scoped>
.message-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: var(--size-3);
}
</style>
