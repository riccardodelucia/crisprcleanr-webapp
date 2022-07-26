<template>
  <div class="search">
    <BaseInput @input="updateValue"></BaseInput>
    <BaseIcon name="search" class="search__icon"></BaseIcon>
  </div>
</template>

<script>
export default {
  name: "BaseSearchBar",
  props: {
    value: [String, Number],
  },
  methods: {
    updateValue(e) {
      this.$emit("search", e.target.value);
    },
  },
};
</script>

<style lang="scss">
.search {
  position: relative;

  input {
    padding-left: 5rem;
  }

  &__icon {
    color: var(--color-grey-dark);
    position: absolute;
    left: 1em;
    top: 1.5em;
  }
}
</style>
