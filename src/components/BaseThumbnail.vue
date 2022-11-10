<template>
  <div class="thumbnail" @click.stop="$emit('clicked')">
    <img class="thumbnail__img" :src="img.src" :alt="img.title" />
    <p class="thumbnail__caption">{{ img.label }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseThumbnail',
  props: {
    img: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: { clicked: null },
  methods: {},
};
</script>

<style lang="scss"></style>
