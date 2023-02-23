<template>
  <div class="message-page">
    <h3>Not found 🔍</h3>
    <p>The content you're looking for is not there.</p>
    <button
      class="btn btn--primary btn--lg"
      type="button"
      @click="$router.push({ name: 'home' })"
    >
      Back to Home
    </button>
  </div>
</template>

<script>
export default {
  title: 'Message Page',
  name: 'View404NotFound',
};
</script>

<style lang="scss">
.message-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  background-image: var(--color-gradient-ht-theme);

  background-size: cover;
  background-repeat: no-repeat;
}
</style>
