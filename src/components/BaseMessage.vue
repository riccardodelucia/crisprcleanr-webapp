<template>
  <div class="message">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <!--  <div class="u-center-content">
      <button
        class="button button--primary button--large"
        type="button"
        @click="$router.push({ name: 'dashboard' })"
      >
        Back to Dashboard
      </button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "BaseMessage",
  props: {
    title: { type: String, default: "" },
    message: { type: String, default: "" },
  },
};
</script>

<style lang="scss">
.message {
  padding: 1em 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
}
</style>
